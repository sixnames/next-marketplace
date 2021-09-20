import { SORT_DESC } from 'config/common';
import {
  COL_ATTRIBUTES,
  COL_OPTIONS,
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_PRODUCT_CONNECTIONS,
  COL_PRODUCTS,
  COL_RUBRICS,
} from 'db/collectionNames';
import {
  brandPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
} from 'db/dao/constantPipelines';
import { getDatabase } from 'db/mongodb';
import {
  ProductConnectionInterface,
  ProductConnectionItemInterface,
  ProductInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList } from 'lib/optionsUtils';
import { generateCardTitle, generateSnippetTitle } from 'lib/titleUtils';
import { ObjectId } from 'mongodb';

interface GetCmsProductInterface {
  productId: string;
  locale: string;
}

interface GetCmsProductPayloadInterface {
  product: ProductInterface;
  rubric: RubricInterface;
}

export async function getCmsProduct({
  productId,
  locale,
}: GetCmsProductInterface): Promise<GetCmsProductPayloadInterface | null> {
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
  const productAggregation = await productsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(productId),
        },
      },

      // Lookup product assets
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

      // Lookup product rubric
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
                  $eq: ['$_id', '$$rubricId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          rubric: {
            $arrayElemAt: ['$rubric', 0],
          },
        },
      },

      // Lookup product attributes
      ...productAttributesPipeline,

      // Lookup product brand
      ...brandPipeline,

      // Lookup product categories
      ...productCategoriesPipeline(),

      // Lookup product connections
      {
        $lookup: {
          from: COL_PRODUCT_CONNECTIONS,
          as: 'connections',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$$productId', '$productsIds'],
                },
              },
            },
            {
              $lookup: {
                from: COL_ATTRIBUTES,
                as: 'attribute',
                let: { attributeId: '$attributeId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$attributeId', '$_id'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                attribute: {
                  $arrayElemAt: ['$attribute', 0],
                },
              },
            },
            {
              $lookup: {
                from: COL_PRODUCT_CONNECTION_ITEMS,
                as: 'connectionProducts',
                let: { connectionId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$connectionId', '$connectionId'],
                      },
                    },
                  },
                  {
                    $sort: {
                      _id: SORT_DESC,
                    },
                  },
                  {
                    $lookup: {
                      from: COL_OPTIONS,
                      as: 'option',
                      let: { optionId: '$optionId' },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $eq: ['$$optionId', '$_id'],
                            },
                          },
                        },
                      ],
                    },
                  },
                  {
                    $lookup: {
                      from: COL_PRODUCTS,
                      as: 'product',
                      let: { productId: '$productId' },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $eq: ['$$productId', '$_id'],
                            },
                          },
                        },

                        // Lookup product attributes
                        ...productAttributesPipeline,

                        // Lookup product brand
                        ...brandPipeline,

                        // Lookup product categories
                        ...productCategoriesPipeline(),
                      ],
                    },
                  },
                  {
                    $addFields: {
                      product: {
                        $arrayElemAt: ['$product', 0],
                      },
                      option: {
                        $arrayElemAt: ['$option', 0],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
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
  const cardTitle = generateCardTitle({
    locale,
    brand: initialProduct.brand,
    rubricName: getFieldStringLocale(rubric.nameI18n, locale),
    showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
    showCategoryInProductTitle: rubric.showCategoryInProductTitle,
    attributes: initialProduct.attributes,
    titleCategoriesSlugs: restProduct.titleCategoriesSlugs,
    nameI18n: restProduct.nameI18n,
    originalName: restProduct.originalName,
    defaultGender: restProduct.gender,
    categories,
  });

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
          nameI18n: connectionProduct.product.nameI18n,
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
  const attributes = (initialProduct.attributes || []).map((productAttribute) => {
    return {
      ...productAttribute,
      name: getFieldStringLocale(productAttribute.nameI18n, locale),
    };
  });

  const product: ProductInterface = {
    ...initialProduct,
    cardTitle,
    connections,
    attributes,
  };

  return {
    product,
    rubric: castedRubric,
  };
}
