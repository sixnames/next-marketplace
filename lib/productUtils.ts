import { SUPPLIER_PRICE_VARIANT_CHARGE } from 'config/common';
import {
  COL_COMPANIES,
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_CARD_DESCRIPTIONS,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import {
  brandPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  productConnectionsSimplePipeline,
  productRubricPipeline,
  productSeoPipeline,
  shopProductFieldsPipeline,
  shopProductSupplierProductsPipeline,
} from 'db/dao/constantPipelines';
import { getDatabase } from 'db/mongodb';
import {
  CategoryInterface,
  ProductAttributeInterface,
  ProductConnectionInterface,
  ProductConnectionItemInterface,
  ProductInterface,
  RubricInterface,
  ShopProductInterface,
  SupplierProductInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList } from 'lib/optionsUtils';
import { generateCardTitle, generateSnippetTitle } from 'lib/titleUtils';
import { ObjectId } from 'mongodb';

interface GetCmsProductInterface {
  productId: string;
  locale: string;
  companySlug: string;
}

interface GetCmsProductPayloadInterface {
  product: ProductInterface;
  rubric: RubricInterface;
  categoriesList: CategoryInterface[];
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

      // get seo text
      {
        $lookup: {
          from: COL_PRODUCT_CARD_DESCRIPTIONS,
          as: 'cardDescription',
          let: {
            productId: '$_id',
          },
          pipeline: [
            {
              $match: {
                companySlug,
                $expr: {
                  $eq: ['$$productId', '$productId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          cardDescription: {
            $arrayElemAt: ['$cardDescription', 0],
          },
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

      // get product seo info
      ...productSeoPipeline(companySlug),
    ])
    .toArray();
  const initialProduct = productAggregation[0];
  if (!initialProduct) {
    return null;
  }

  const { rubric, seo, cardDescription, ...restProduct } = initialProduct;
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
    cardDescription: cardDescription
      ? {
          ...cardDescription,
          seo,
        }
      : null,
    cardTitle,
    snippetTitle,
    connections,
    attributes,
  };

  return {
    product,
    rubric: castedRubric,
    categoriesList: initialProduct.categories || [],
  };
}

export function getSupplierPrice(supplierProduct: SupplierProductInterface): number {
  const { variant, price, percent } = supplierProduct;
  if (variant === SUPPLIER_PRICE_VARIANT_CHARGE) {
    const charge = (price / 100) * percent;
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

interface CastProductInterface {
  product?: ProductInterface | null;
  locale: string;
}

export function castProduct({ product, locale }: CastProductInterface): ProductInterface | null {
  if (!product) {
    return null;
  }

  const { rubric } = product;
  if (!rubric) {
    return null;
  }

  // attributes
  const productAttributes = (product.attributes || []).reduce(
    (acc: ProductAttributeInterface[], productAttribute) => {
      const { attribute } = productAttribute;
      if (!attribute) {
        return acc;
      }

      const resultProductAttribute: ProductAttributeInterface = {
        ...productAttribute,
        attribute: {
          ...attribute,
          name: getFieldStringLocale(attribute.nameI18n, locale),
          metric: attribute.metric
            ? {
                ...attribute.metric,
                name: getFieldStringLocale(attribute.metric.nameI18n, locale),
              }
            : null,
          options: getTreeFromList({
            list: attribute.options,
            childrenFieldName: 'options',
            locale,
          }),
        },
      };
      return [...acc, resultProductAttribute];
    },
    [],
  );

  // categories
  const productCategories = getTreeFromList({
    list: product.categories,
    childrenFieldName: 'categories',
    locale,
  });

  // brand
  const productBrand = product.brand
    ? {
        ...product.brand,
        collections: (product.brand.collections || []).filter(({ itemId }) => {
          return itemId === product.brandCollectionSlug;
        }),
      }
    : null;

  // snippet title
  const snippetTitle = generateSnippetTitle({
    locale,
    brand: productBrand,
    rubricName: getFieldStringLocale(rubric.nameI18n, locale),
    showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
    showCategoryInProductTitle: rubric.showCategoryInProductTitle,
    attributes: productAttributes,
    categories: productCategories,
    titleCategoriesSlugs: product.titleCategoriesSlugs,
    originalName: product.originalName,
    defaultGender: product.gender,
  });

  const payload: ProductInterface = {
    ...product,
    name: getFieldStringLocale(product.nameI18n, locale),
    snippetTitle,
    rubric: {
      ...rubric,
      name: getFieldStringLocale(rubric.nameI18n, locale),
    },
  };

  return payload;
}

interface CastShopProductInterface {
  shopProduct: ShopProductInterface;
  locale: string;
}

export function castShopProduct({
  shopProduct,
  locale,
}: CastShopProductInterface): ShopProductInterface | null {
  const { product } = shopProduct;
  const castedProduct = castProduct({ product, locale });
  if (!product) {
    return null;
  }
  const { rubric } = product;
  if (!rubric) {
    return null;
  }

  const payload: ShopProductInterface = {
    ...shopProduct,
    supplierProducts: castSupplierProductsList({
      supplierProducts: shopProduct.supplierProducts,
      locale,
    }),
    product: castedProduct,
  };
  return payload;
}

interface GetConsoleShopProductInterface {
  shopProductId: string | string[];
  locale: string;
}

export async function getConsoleShopProduct({
  shopProductId,
  locale,
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

      // get shop product fields
      ...shopProductFieldsPipeline('$productId'),

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

  const shopProduct = castShopProduct({
    shopProduct: shopProductResult,
    locale,
  });
  if (!shopProduct || !shopProduct.product) {
    return null;
  }

  return shopProduct;
}
