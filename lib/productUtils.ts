import { findTask } from 'db/dao/tasks/taskUtils';
import { ObjectId } from 'mongodb';
import trim from 'trim';
import { DEFAULT_COUNTERS_OBJECT } from 'lib/config/common';
import { COL_OPTIONS, COL_PRODUCT_SUMMARIES, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import {
  brandPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  productRubricPipeline,
  shopProductShopPipeline,
  shopProductSupplierProductsPipeline,
  summaryPipeline,
} from 'db/utils/constantPipelines';
import {
  ObjectIdModel,
  OptionModel,
  ProductFacetModel,
  ProductSummaryModel,
  ShopProductModel,
  TranslationModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
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
} from 'db/uiInterfaces';
import { getFieldStringLocale } from './i18n';
import { noNaN } from './numbers';
import { getSupplierPrice } from './priceUtils';
import { getProductAllSeoContents } from './seoContentUtils';

interface GetFullProductSummaryInterface {
  productId: string;
  companySlug: string;
  locale: string;
}

interface GetFullProductSummaryPayloadInterface {
  summary: ProductSummaryInterface;
  categoriesList: CategoryInterface[];
  seoContentsList: SeoContentCitiesInterface;
}

export async function getFullProductSummary({
  productId,
  locale,
  companySlug,
}: GetFullProductSummaryInterface): Promise<GetFullProductSummaryPayloadInterface | null> {
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

  // variants
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
        const isCurrent = variantProductSummary._id.equals(initialProduct._id);
        const castedVariantProducts: ProductVariantItemInterface = {
          ...variantProduct,
          isCurrent,
          summary: {
            ...variantProductSummary,
            snippetTitle: getFieldStringLocale(variantProductSummary.snippetTitleI18n, locale),
            cardTitle: getFieldStringLocale(variantProductSummary.cardTitleI18n, locale),
          },
          option: {
            ...option,
            name: getFieldStringLocale(option.nameI18n, locale),
          },
        };
        if (isCurrent) {
          variantProducts.unshift(castedVariantProducts);
        } else {
          variantProducts.push(castedVariantProducts);
        }
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
      const { attribute, attributeId } = productAttribute;
      if (!attribute || !attributeId) {
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
    summary: product,
    categoriesList: initialProduct.categories || [],
    seoContentsList: cardContent,
  };
}

interface GetFullProductSummaryWithDraftPayloadInterface extends GetFullProductSummaryInterface {
  taskId?: string | null;
  isContentManager?: boolean;
}

export async function getFullProductSummaryWithDraft({
  companySlug,
  isContentManager,
  locale,
  productId,
  taskId,
}: GetFullProductSummaryWithDraftPayloadInterface): Promise<GetFullProductSummaryPayloadInterface | null> {
  if (isContentManager && !taskId) {
    return null;
  }
  const summaryPayload = await getFullProductSummary({
    locale,
    productId,
    companySlug,
  });
  if (!summaryPayload) {
    return null;
  }
  // react-page-cell-insert-new
  // Text
  const { categoriesList, seoContentsList } = summaryPayload;
  let summary = summaryPayload.summary;

  if (isContentManager) {
    const task = await findTask({
      taskId,
    });
    if (task) {
      const lastLog = task.log[task.log.length - 1];
      if (lastLog) {
        const draft = lastLog.draft as ProductSummaryInterface | null;
        summary = draft || summaryPayload.summary;
      }
    }
  }

  return {
    seoContentsList,
    categoriesList,
    summary,
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

      // get shop
      ...shopProductShopPipeline,

      // get supplier products
      ...shopProductSupplierProductsPipeline,
    ])
    .toArray();
  const shopProductResult = shopProductsAggregation[0];
  if (!shopProductResult) {
    return null;
  }

  const productPayload = await getFullProductSummary({
    companySlug,
    locale,
    productId: shopProductResult.productId.toHexString(),
  });
  if (!productPayload) {
    return null;
  }
  const { seoContentsList, summary } = productPayload;

  const shopProduct: ShopProductInterface = {
    ...shopProductResult,
    supplierProducts: castSupplierProductsList({
      supplierProducts: shopProductResult.supplierProducts,
      locale,
    }),
    summary: {
      ...summary,
      cardContentCities: seoContentsList,
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
        ...summaryPipeline('$productId'),
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
  shopProductUid?: string | null;
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
    mainImage: summary.mainImage,
  };
}
