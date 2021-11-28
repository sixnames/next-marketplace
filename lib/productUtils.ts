import { SUPPLIER_PRICE_VARIANT_CHARGE } from 'config/common';
import {
  COL_COMPANIES,
  COL_PRODUCT_ASSETS,
  COL_PRODUCTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import {
  brandPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  productConnectionsSimplePipeline,
  productRubricPipeline,
  shopProductFieldsPipeline,
  shopProductSupplierProductsPipeline,
} from 'db/dao/constantPipelines';
import { Maybe, ObjectIdModel, TranslationModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  BarcodeDoublesInterface,
  CategoryInterface,
  ProductAttributeInterface,
  ProductConnectionInterface,
  ProductConnectionItemInterface,
  ProductInterface,
  RubricInterface,
  SeoContentCitiesInterface,
  ShopProductBarcodeDoublesInterface,
  ShopProductInterface,
  SupplierProductInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList } from 'lib/optionUtils';
import { getProductAllSeoContents } from 'lib/seoContentUtils';
import { generateCardTitle, generateSnippetTitle } from 'lib/titleUtils';
import { ObjectId } from 'mongodb';
import trim from 'trim';

interface GetCmsProductInterface {
  productId: string;
  companySlug: string;
  locale: string;
}

interface GetCmsProductPayloadInterface {
  product: ProductInterface;
  categoriesList: CategoryInterface[];
  cardContent: SeoContentCitiesInterface;
}

export async function getCmsProduct({
  productId,
  locale,
  companySlug,
}: GetCmsProductInterface): Promise<GetCmsProductPayloadInterface | null> {
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
  const productAggregation = await productsCollection
    .aggregate<ProductInterface>([
      {
        $match: {
          _id: new ObjectId(productId),
        },
      },

      // get product assets
      {
        $lookup: {
          as: 'assets',
          from: COL_PRODUCT_ASSETS,
          localField: '_id',
          foreignField: 'productId',
        },
      },
      {
        $addFields: {
          assets: {
            $arrayElemAt: ['$assets', 0],
          },
        },
      },

      // get product rubric
      ...productRubricPipeline,

      // get product attributes
      ...productAttributesPipeline,

      // get product brand
      ...brandPipeline,

      // get product categories
      ...productCategoriesPipeline(),

      // get product connections
      ...productConnectionsSimplePipeline,
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

  const categories = getTreeFromList({
    list: initialProduct.categories,
    childrenFieldName: 'categories',
    locale,
  });

  // title
  const titleProps = {
    locale,
    brand: initialProduct.brand,
    rubricName: getFieldStringLocale(rubric.nameI18n, locale),
    showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
    showCategoryInProductTitle: rubric.showCategoryInProductTitle,
    attributes: initialProduct.attributes,
    titleCategoriesSlugs: restProduct.titleCategoriesSlugs,
    originalName: restProduct.originalName,
    defaultGender: restProduct.gender,
    categories,
  };
  const cardTitle = generateCardTitle(titleProps);
  const snippetTitle = generateSnippetTitle(titleProps);

  // connections
  const connections: ProductConnectionInterface[] = [];
  for await (const productConnection of initialProduct.connections || []) {
    const connectionProducts: ProductConnectionItemInterface[] = [];
    for await (const connectionProduct of productConnection.connectionProducts || []) {
      if (connectionProduct.product) {
        const snippetTitle = generateSnippetTitle({
          locale,
          brand: connectionProduct.product.brand,
          rubricName: getFieldStringLocale(rubric.nameI18n, locale),
          showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
          showCategoryInProductTitle: rubric.showCategoryInProductTitle,
          attributes: connectionProduct.product.attributes,
          titleCategoriesSlugs: connectionProduct.product.titleCategoriesSlugs,
          originalName: connectionProduct.product.originalName,
          defaultGender: connectionProduct.product.gender,
          categories,
        });
        connectionProducts.push({
          ...connectionProduct,
          product: {
            ...connectionProduct.product,
            snippetTitle,
          },
          option: connectionProduct.option
            ? {
                ...connectionProduct.option,
                name: getFieldStringLocale(connectionProduct.option?.nameI18n, locale),
              }
            : null,
        });
      }
    }

    connections.push({
      ...productConnection,
      attribute: productConnection.attribute
        ? {
            ...productConnection.attribute,
            name: getFieldStringLocale(productConnection.attribute?.nameI18n, locale),
          }
        : null,
      connectionProducts,
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

  const product: ProductInterface = {
    ...initialProduct,
    rubric: castedRubric,
    cardTitle,
    snippetTitle,
    connections,
    attributes,
  };

  // card content
  const cardContent = await getProductAllSeoContents({
    productSlug: product.slug,
    productId: product._id,
    rubricSlug: product.rubricSlug,
    companySlug,
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

export function getSupplierPrice(supplierProduct: SupplierProductInterface): number {
  const { variant, price, percent } = supplierProduct;
  if (variant === SUPPLIER_PRICE_VARIANT_CHARGE) {
    const charge = Math.round((price / 100) * percent);
    return charge + price;
  }
  return price;
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

      // get company
      {
        $lookup: {
          from: COL_COMPANIES,
          as: 'company',
          localField: 'companyId',
          foreignField: '_id',
        },
      },
      {
        $addFields: {
          company: {
            $arrayElemAt: ['$company', 0],
          },
        },
      },

      // get shop
      {
        $lookup: {
          from: COL_SHOPS,
          as: 'shop',
          localField: 'shopId',
          foreignField: '_id',
        },
      },
      {
        $addFields: {
          shop: {
            $arrayElemAt: ['$shop', 0],
          },
        },
      },
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
    product: {
      ...product,
      cardContentCities: cardContent,
    },
  };
  if (!shopProduct || !shopProduct.product) {
    return null;
  }

  return shopProduct;
}

interface CheckBarcodeIntersectsInterface {
  barcode: string[];
  productId: Maybe<ObjectIdModel>;
  locale: string;
}

export async function checkBarcodeIntersects({
  barcode,
  locale,
  productId,
}: CheckBarcodeIntersectsInterface): Promise<BarcodeDoublesInterface[]> {
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
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
    const products = await productsCollection
      .aggregate<ProductInterface>([
        {
          $match: {
            ...idMatch,
            barcode: barcodeItem,
          },
        },
        {
          $project: {
            descriptionI18n: false,
          },
        },

        // get product attributes
        ...productAttributesPipeline,

        // get product brand
        ...brandPipeline,

        // get product categories
        ...productCategoriesPipeline(),

        // get product rubric
        {
          $lookup: {
            from: COL_RUBRICS,
            as: 'rubric',
            let: {
              rubricId: '$rubricId',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$rubricId', '$_id'],
                  },
                },
              },
              {
                $project: {
                  _id: true,
                  slug: true,
                  nameI18n: true,
                  showRubricNameInProductTitle: true,
                  showCategoryInProductTitle: true,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            rubric: { $arrayElemAt: ['$rubric', 0] },
          },
        },
      ])
      .toArray();

    if (products.length > 0) {
      barcodeDoubles.push({
        barcode: barcodeItem,
        products: products.map((product) => {
          const snippetTitle = generateSnippetTitle({
            locale,
            brand: product.brand,
            rubricName: getFieldStringLocale(product.rubric?.nameI18n, locale),
            showRubricNameInProductTitle: product.rubric?.showRubricNameInProductTitle,
            showCategoryInProductTitle: product.rubric?.showCategoryInProductTitle,
            attributes: product.attributes || [],
            categories: product.categories,
            titleCategoriesSlugs: product.titleCategoriesSlugs,
            originalName: `${product.originalName}`,
            defaultGender: `${product.gender}`,
          });

          return {
            ...product,
            snippetTitle,
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
          const { product } = shopProduct;
          if (!product) {
            return acc;
          }

          const snippetTitle = generateSnippetTitle({
            locale,
            brand: product.brand,
            rubricName: getFieldStringLocale(product.rubric?.nameI18n, locale),
            showRubricNameInProductTitle: product.rubric?.showRubricNameInProductTitle,
            showCategoryInProductTitle: product.rubric?.showCategoryInProductTitle,
            attributes: product.attributes || [],
            categories: product.categories,
            titleCategoriesSlugs: product.titleCategoriesSlugs,
            originalName: `${product.originalName}`,
            defaultGender: `${product.gender}`,
          });

          const productPayload: ProductInterface = {
            ...product,
            snippetTitle,
          };

          const payload: ShopProductInterface = {
            ...shopProduct,
            product: productPayload,
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
