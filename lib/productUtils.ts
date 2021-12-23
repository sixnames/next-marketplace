import { ObjectId } from 'mongodb';
import trim from 'trim';
import { DEFAULT_COUNTERS_OBJECT } from '../config/common';
import {
  COL_LANGUAGES,
  COL_OPTIONS,
  COL_PRODUCT_SUMMARIES,
  COL_SHOP_PRODUCTS,
} from '../db/collectionNames';
import {
  brandPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  productRubricPipeline,
  shopProductFieldsPipeline,
  shopProductSupplierProductsPipeline,
} from '../db/dao/constantPipelines';
import {
  LanguageModel,
  ObjectIdModel,
  OptionModel,
  ProductFacetModel,
  ProductSummaryModel,
  ShopProductModel,
  TranslationModel,
} from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import {
  AttributeInterface,
  BarcodeDoublesInterface,
  CategoryInterface,
  ProductAttributeInterface,
  ProductSummaryInterface,
  ProductVariantInterface,
  ProductVariantItemInterface,
  RubricInterface,
  SeoContentCitiesInterface,
  ShopProductBarcodeDoublesInterface,
  ShopProductInterface,
  SupplierProductInterface,
} from '../db/uiInterfaces';
import { updateAlgoliaProducts } from './algolia/productAlgoliaUtils';
import { getFieldStringLocale } from './i18n';
import { noNaN } from './numbers';
import { getSupplierPrice } from './priceUtils';
import { getProductAllSeoContents } from './seoContentUtils';
import { generateCardTitle, GenerateCardTitleInterface, generateSnippetTitle } from './titleUtils';
import { getTreeFromList } from './treeUtils';

interface GetCmsProductInterface {
  productId: string;
  companySlug: string;
  locale: string;
}

interface GetCmsProductPayloadInterface {
  product: ProductSummaryInterface;
  categoriesList: CategoryInterface[];
  cardContent: SeoContentCitiesInterface;
}

export async function getCmsProduct({
  productId,
  locale,
  companySlug,
}: GetCmsProductInterface): Promise<GetCmsProductPayloadInterface | null> {
  const { db } = await getDatabase();
  const productSummariesCollection = db.collection<ProductSummaryInterface>(COL_PRODUCT_SUMMARIES);
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
  const productAggregation = await productSummariesCollection
    .aggregate<ProductSummaryInterface>([
      {
        $match: {
          _id: new ObjectId(productId),
        },
      },

      // get product rubric
      ...productRubricPipeline,

      // get product attributes
      ...productAttributesPipeline(),

      // get product brand
      ...brandPipeline,

      // get product categories
      ...productCategoriesPipeline(),
    ])
    .toArray();
  const initialProduct = productAggregation[0];
  if (!initialProduct) {
    return null;
  }

  const { rubric, ...restProduct } = initialProduct;
  if (!rubric) {
    return null;
  }
  const castedRubric: RubricInterface = {
    ...rubric,
    name: getFieldStringLocale(rubric.nameI18n, locale),
  };

  const allProductAttributes = restProduct.attributes.reduce(
    (acc: AttributeInterface[], { attribute }) => {
      if (!attribute) {
        return acc;
      }
      return [...acc, attribute];
    },
    [],
  );

  // connections
  const variants: ProductVariantInterface[] = [];
  for await (const productVariant of initialProduct.variants) {
    const variantProducts: ProductVariantItemInterface[] = [];
    const attribute = allProductAttributes.find(({ _id }) => {
      return _id.equals(productVariant.attributeId);
    });
    if (!attribute || !attribute.options) {
      continue;
    }

    for await (const variantProduct of productVariant.products || []) {
      const variantProductSummary = await productSummariesCollection.findOne({
        _id: variantProduct.productId,
      });

      const option = await optionsCollection.findOne({
        _id: variantProduct.optionId,
      });

      if (variantProductSummary && option) {
        variantProducts.push({
          ...variantProduct,
          summary: {
            ...variantProductSummary,
            snippetTitle: getFieldStringLocale(variantProductSummary.snippetTitleI18n, locale),
            cardTitle: getFieldStringLocale(variantProductSummary.cardTitleI18n, locale),
          },
          option: option
            ? {
                ...option,
                name: getFieldStringLocale(option.nameI18n, locale),
              }
            : null,
        });
      }
    }

    variants.push({
      ...productVariant,
      products: variantProducts,
      attribute: attribute
        ? {
            ...attribute,
            name: getFieldStringLocale(attribute?.nameI18n, locale),
          }
        : null,
    });
  }

  // attributes
  const attributes = (initialProduct.attributes || []).reduce(
    (acc: ProductAttributeInterface[], productAttribute) => {
      const { attribute } = productAttribute;
      if (!attribute) {
        return acc;
      }
      return [
        ...acc,
        {
          ...productAttribute,
          attribute: {
            ...attribute,
            name: getFieldStringLocale(attribute.nameI18n, locale),
          },
        },
      ];
    },
    [],
  );

  // title
  const cardTitle = getFieldStringLocale(restProduct.cardTitleI18n, locale);
  const snippetTitle = getFieldStringLocale(restProduct.snippetTitleI18n, locale);

  // payload
  const product: ProductSummaryInterface = {
    ...initialProduct,
    rubric: castedRubric,
    cardTitle,
    snippetTitle,
    variants,
    attributes,
  };

  // card content
  const cardContent = await getProductAllSeoContents({
    productSlug: product.slug,
    productId: product._id,
    rubricSlug: product.rubricSlug,
    companySlug,
    locale,
  });
  if (!cardContent) {
    return null;
  }

  return {
    product,
    categoriesList: initialProduct.categories || [],
    cardContent,
  };
}

interface CastSupplierProductsListInterface {
  supplierProducts?: SupplierProductInterface[] | null;
  locale: string;
}

export function castSupplierProductsList({
  supplierProducts,
  locale,
}: CastSupplierProductsListInterface): SupplierProductInterface[] {
  return (supplierProducts || []).reduce((acc: SupplierProductInterface[], supplierProduct) => {
    const { supplier } = supplierProduct;
    if (!supplier) {
      return acc;
    }
    const payload: SupplierProductInterface = {
      ...supplierProduct,
      recommendedPrice: getSupplierPrice(supplierProduct),
      supplier: {
        ...supplier,
        name: getFieldStringLocale(supplier.nameI18n, locale),
      },
    };
    return [...acc, payload];
  }, []);
}

interface GetConsoleShopProductInterface {
  shopProductId: string | string[];
  locale: string;
  companySlug: string;
}

export async function getConsoleShopProduct({
  shopProductId,
  locale,
  companySlug,
}: GetConsoleShopProductInterface): Promise<ShopProductInterface | null> {
  const { db } = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);

  // get shop product
  const shopProductsAggregation = await shopProductsCollection
    .aggregate<ShopProductInterface>([
      {
        $match: {
          _id: new ObjectId(`${shopProductId}`),
        },
      },

      // get supplier products
      ...shopProductSupplierProductsPipeline,
    ])
    .toArray();
  const shopProductResult = shopProductsAggregation[0];
  if (!shopProductResult) {
    return null;
  }

  const productPayload = await getCmsProduct({
    companySlug,
    locale,
    productId: shopProductResult.productId.toHexString(),
  });
  if (!productPayload) {
    return null;
  }
  const { cardContent, product } = productPayload;

  const shopProduct: ShopProductInterface = {
    ...shopProductResult,
    supplierProducts: castSupplierProductsList({
      supplierProducts: shopProductResult.supplierProducts,
      locale,
    }),
    summary: {
      ...product,
      cardContentCities: cardContent,
    },
  };

  return shopProduct;
}

interface CheckBarcodeIntersectsInterface {
  barcode: string[];
  productId?: ObjectIdModel | null;
  locale: string;
}

export async function checkBarcodeIntersects({
  barcode,
  locale,
  productId,
}: CheckBarcodeIntersectsInterface): Promise<BarcodeDoublesInterface[]> {
  const { db } = await getDatabase();
  const productSummariesCollection = db.collection<ProductSummaryInterface>(COL_PRODUCT_SUMMARIES);
  const idMatch = productId
    ? {
        _id: {
          $ne: productId,
        },
      }
    : {};
  const barcodeDoubles: BarcodeDoublesInterface[] = [];
  if (barcode.length < 1) {
    return barcodeDoubles;
  }

  for await (const barcodeItem of barcode) {
    const products = await productSummariesCollection
      .aggregate<ProductSummaryInterface>([
        {
          $match: {
            ...idMatch,
            barcode: barcodeItem,
          },
        },
      ])
      .toArray();

    if (products.length > 0) {
      barcodeDoubles.push({
        barcode: barcodeItem,
        products: products.map((product) => {
          return {
            ...product,
            snippetTitle: getFieldStringLocale(product.snippetTitleI18n, locale),
          };
        }),
      });
    }
  }

  return barcodeDoubles;
}

interface CheckShopProductBarcodeIntersectsInterface {
  barcode: string[];
  shopProductId: ObjectIdModel;
  locale: string;
}

export async function checkShopProductBarcodeIntersects({
  barcode,
  locale,
  shopProductId,
}: CheckShopProductBarcodeIntersectsInterface): Promise<ShopProductBarcodeDoublesInterface[]> {
  const { db } = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
  const barcodeDoubles: ShopProductBarcodeDoublesInterface[] = [];
  const shopProduct = await shopProductsCollection.findOne({
    _id: shopProductId,
  });
  if (barcode.length < 1 || !shopProduct) {
    return barcodeDoubles;
  }

  for await (const barcodeItem of barcode) {
    const shopProducts = await shopProductsCollection
      .aggregate<ShopProductInterface>([
        {
          $match: {
            _id: {
              $ne: shopProductId,
            },
            shopId: shopProduct.shopId,
            barcode: barcodeItem,
          },
        },
        {
          $project: {
            descriptionI18n: false,
          },
        },

        // get product
        ...shopProductFieldsPipeline('$productId'),
      ])
      .toArray();

    if (shopProducts.length > 0) {
      const double: ShopProductBarcodeDoublesInterface = {
        barcode: barcodeItem,
        products: shopProducts.reduce((acc: ShopProductInterface[], shopProduct) => {
          const { summary } = shopProduct;
          if (!summary) {
            return acc;
          }

          const productPayload: ProductSummaryInterface = {
            ...summary,
            snippetTitle: getFieldStringLocale(summary.snippetTitleI18n, locale),
          };

          const payload: ShopProductInterface = {
            ...shopProduct,
            summary: productPayload,
          };
          return [...acc, payload];
        }, []),
      };
      barcodeDoubles.push(double);
    }
  }

  return barcodeDoubles;
}

interface TrimProductNameInterface {
  originalName?: string | null;
  nameI18n?: TranslationModel | null;
}
export function trimProductName({ originalName, nameI18n }: TrimProductNameInterface) {
  const translation = nameI18n || {};
  return {
    originalName: originalName ? trim(originalName) : '',
    nameI18n: Object.keys(translation).reduce((acc: TranslationModel, key) => {
      const value = translation[key];
      if (!value) {
        return acc;
      }
      acc[key] = trim(value);
      return acc;
    }, {}),
  };
}

export async function updateProductTitles(match?: Record<any, any>) {
  try {
    const { db } = await getDatabase();
    const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
    const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
    const languages = await languagesCollection.find({}).toArray();
    const locales = languages.map(({ slug }) => slug);

    const aggregationMatch = match
      ? [
          {
            $match: match,
          },
        ]
      : [];

    const products = await productSummariesCollection
      .aggregate<ProductSummaryInterface>([
        ...aggregationMatch,

        // get product rubric
        ...productRubricPipeline,

        // get product attributes
        ...productAttributesPipeline(),

        // get product brand
        ...brandPipeline,

        // get product categories
        ...productCategoriesPipeline(),
      ])
      .toArray();

    for await (const initialProduct of products) {
      const { rubric, ...restProduct } = initialProduct;
      if (!rubric) {
        return false;
      }

      // update titles
      const cardTitleI18n: TranslationModel = {};
      const snippetTitleI18n: TranslationModel = {};
      for await (const locale of locales) {
        const categories = getTreeFromList({
          list: initialProduct.categories,
          childrenFieldName: 'categories',
          locale,
        });

        const titleProps: GenerateCardTitleInterface = {
          locale,
          brand: initialProduct.brand,
          rubricName: getFieldStringLocale(rubric.nameI18n, locale),
          showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
          showCategoryInProductTitle: rubric.showCategoryInProductTitle,
          attributes: initialProduct.attributes,
          titleCategorySlugs: restProduct.titleCategorySlugs,
          originalName: restProduct.originalName,
          defaultGender: restProduct.gender,
          categories,
        };
        const cardTitle = generateCardTitle(titleProps);
        cardTitleI18n[locale] = cardTitle;
        const snippetTitle = generateSnippetTitle(titleProps);
        snippetTitleI18n[locale] = snippetTitle;
      }
      await productSummariesCollection.findOneAndUpdate(
        {
          _id: initialProduct._id,
        },
        {
          $set: {
            cardTitleI18n,
            snippetTitleI18n,
          },
        },
      );

      // update algolia index
      await updateAlgoliaProducts({ _id: initialProduct._id });
    }
    return true;
  } catch (e) {
    console.log('updateProductTitlesInterface error ', e);
    return false;
  }
}

interface CastSummaryToShopProductInterface {
  summary: ProductSummaryModel;
  available?: number | null;
  price?: number | null;
  itemId: string;
  barcode: string[];
  shopId: ObjectIdModel;
  citySlug: string;
  companyId: ObjectIdModel;
  companySlug: string;
}

export function castSummaryToShopProduct({
  available,
  barcode,
  itemId,
  price,
  summary,
  citySlug,
  companyId,
  companySlug,
  shopId,
}: CastSummaryToShopProductInterface): ShopProductModel {
  return {
    _id: new ObjectId(),
    itemId,
    barcode,
    available: noNaN(available),
    price: noNaN(price),
    oldPrices: [],
    discountedPercent: 0,
    productId: summary._id,
    shopId,
    citySlug,
    companyId,
    companySlug,
    rubricId: summary.rubricId,
    rubricSlug: summary.rubricSlug,
    brandSlug: summary.brandSlug,
    mainImage: summary.mainImage,
    allowDelivery: summary.allowDelivery,
    brandCollectionSlug: summary.brandCollectionSlug,
    manufacturerSlug: summary.manufacturerSlug,
    filterSlugs: summary.filterSlugs,
    categorySlugs: summary.categorySlugs,
    updatedAt: new Date(),
    createdAt: new Date(),
    ...DEFAULT_COUNTERS_OBJECT,
  };
}

interface CastSummaryToFacetInterface {
  summary: ProductSummaryModel;
}

export function castSummaryToFacet({ summary }: CastSummaryToFacetInterface): ProductFacetModel {
  return {
    _id: summary._id,
    filterSlugs: summary.filterSlugs,
    attributeIds: summary.attributeIds,
    categorySlugs: summary.categorySlugs,
    slug: summary.slug,
    active: summary.active,
    rubricId: summary.rubricId,
    rubricSlug: summary.rubricSlug,
    itemId: summary.itemId,
    allowDelivery: summary.allowDelivery,
    brandCollectionSlug: summary.brandCollectionSlug,
    brandSlug: summary.brandSlug,
    manufacturerSlug: summary.manufacturerSlug,
    barcode: summary.barcode,
  };
}
