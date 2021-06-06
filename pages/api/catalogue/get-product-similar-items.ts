import { SORT_DESC } from 'config/common';
import { COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ProductInterface } from 'db/uiInterfaces';
import { getCurrencyString, getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getSessionCity, getSessionCompanySlug, getSessionLocale } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

const fullPercentage = 100;
const filterPercentage = 50;

export interface CatalogueQueryInterface {
  productId: string;
  companyId?: string;
}

async function getProductSimilarItems(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query } = req;
    const locale = getSessionLocale({ req, res });
    const city = getSessionCity({ req, res });
    const companySlug = getSessionCompanySlug({ req, res });
    const anyQuery = query as unknown;
    const { productId, companyId } = anyQuery as CatalogueQueryInterface;
    const finalProductId = productId ? new ObjectId(productId) : null;

    if (!finalProductId) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end('[]');
      return;
    }

    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const companyRubricsMatch = companyId ? { companyId: new ObjectId(companyId) } : {};

    const shopProductsAggregation = await shopProductsCollection
      .aggregate<ProductInterface>([
        {
          $match: {
            productId: finalProductId,
            citySlug: city,
            ...companyRubricsMatch,
          },
        },
        {
          $group: {
            _id: '$productId',
            rubricId: { $first: `$rubricId` },
            rubricSlug: { $first: `$rubricSlug` },
            selectedOptionsSlugs: { $first: `$selectedOptionsSlugs` },
            minPrice: {
              $min: '$price',
            },
            maxPrice: {
              $max: '$price',
            },
          },
        },
        {
          $addFields: {
            minPercent: {
              $ceil: {
                $divide: ['$minPrice', fullPercentage],
              },
            },
            maxPercent: {
              $ceil: {
                $divide: ['$maxPrice', fullPercentage],
              },
            },
          },
        },
        {
          $addFields: {
            minFilterPart: {
              $multiply: ['$minPercent', filterPercentage],
            },
            maxFilterPart: {
              $multiply: ['$maxPercent', filterPercentage],
            },
          },
        },
        {
          $addFields: {
            minFilterPrice: {
              $subtract: ['$minPrice', '$minFilterPart'],
            },
            maxFilterPrice: {
              $add: ['$maxPrice', '$maxFilterPart'],
            },
          },
        },

        // Lookup similar products
        {
          $unwind: '$selectedOptionsSlugs',
        },
        {
          $lookup: {
            from: COL_SHOP_PRODUCTS,
            as: 'similarProducts',
            let: {
              rubricSlug: '$rubricSlug',
              selectedOptionsSlugs: '$selectedOptionsSlugs',
              minFilterPrice: '$minFilterPrice',
              maxFilterPrice: '$maxFilterPrice',
            },
            pipeline: [
              {
                $match: {
                  ...companyRubricsMatch,
                  citySlug: city,
                  $expr: {
                    $and: [
                      { $gte: ['$price', '$$minFilterPrice'] },
                      { $lte: ['$price', '$$maxFilterPrice'] },
                      { $eq: ['$$rubricSlug', '$rubricSlug'] },
                      { $in: ['$$selectedOptionsSlugs', '$selectedOptionsSlugs'] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: '$productId',
                  itemId: { $first: '$itemId' },
                  rubricId: { $first: '$rubricId' },
                  rubricSlug: { $first: `$rubricSlug` },
                  slug: { $first: '$slug' },
                  mainImage: { $first: `$mainImage` },
                  originalName: { $first: `$originalName` },
                  nameI18n: { $first: `$nameI18n` },
                  views: { $max: `$views.${companySlug}.${city}` },
                  priorities: { $max: `$priorities.${companySlug}.${city}` },
                  minPrice: {
                    $min: '$price',
                  },
                  maxPrice: {
                    $min: '$price',
                  },
                  available: {
                    $max: '$available',
                  },
                  shopProductsIds: {
                    $addToSet: '$_id',
                  },
                },
              },
              {
                $sort: {
                  priorities: SORT_DESC,
                  views: SORT_DESC,
                  available: SORT_DESC,
                },
              },
              {
                $limit: 4,
              },
              {
                $addFields: {
                  shopsCount: { $size: '$shopProductsIds' },
                  cardPrices: {
                    min: '$minPrice',
                    max: '$maxPrice',
                  },
                },
              },

              // Lookup product attributes
              /*{
                $lookup: {
                  from: COL_PRODUCT_ATTRIBUTES,
                  as: 'attributes',
                  let: {
                    productId: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$productId', '$productId'],
                        },
                        viewVariant: {
                          $in: [ATTRIBUTE_VIEW_VARIANT_LIST, ATTRIBUTE_VIEW_VARIANT_OUTER_RATING],
                        },
                      },
                    },
                    {
                      $lookup: {
                        from: COL_OPTIONS,
                        as: 'options',
                        let: {
                          optionsGroupId: '$optionsGroupId',
                          selectedOptionsIds: '$selectedOptionsIds',
                        },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $and: [
                                  {
                                    $eq: ['$optionsGroupId', '$$optionsGroupId'],
                                  },
                                  {
                                    $in: ['$_id', '$$selectedOptionsIds'],
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },*/
            ],
          },
        },
        {
          $unwind: '$similarProducts',
        },
        {
          $group: {
            _id: '$_id',
            similarProducts: {
              $addToSet: '$similarProducts',
            },
            minFilterPrice: {
              $first: '$minFilterPrice',
            },
            maxFilterPrice: {
              $first: '$maxFilterPrice',
            },
          },
        },
      ])
      .toArray();
    const product = shopProductsAggregation[0];

    console.log(product.similarProducts?.length);

    if (!product || !product.similarProducts) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end('[]');
      return;
    }

    const similarProducts = product.similarProducts.reduce((acc: ProductInterface[], product) => {
      const exist = acc.some(({ itemId }) => product.itemId === itemId);
      if (exist) {
        return acc;
      }

      const minPrice = noNaN(product.cardPrices?.min);
      const maxPrice = noNaN(product.cardPrices?.max);
      const cardPrices = {
        _id: new ObjectId(),
        min: getCurrencyString(minPrice),
        max: getCurrencyString(maxPrice),
      };

      return [
        ...acc,
        {
          ...product,
          name: getFieldStringLocale(product.nameI18n, locale),
          cardPrices,
        },
      ];
    }, []);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(similarProducts));
  } catch (e) {
    console.log(e);

    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end('[]');
  }
}

export default getProductSimilarItems;
