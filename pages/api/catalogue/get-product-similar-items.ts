import {
  CATEGORY_SLUG_PREFIX_SEPARATOR,
  CATEGORY_SLUG_PREFIX_WORD,
  SORT_DESC,
} from 'config/common';
import { COL_PRODUCTS, COL_RUBRICS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import {
  brandPipeline,
  noImageStage,
  productAttributesPipeline,
  productCategoriesPipeline,
  shopProductFieldsPipeline,
} from 'db/dao/constantPipelines';
import { ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ShopProductInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getTreeFromList } from 'lib/optionsUtils';
import { getRequestParams, getSessionCompanySlug } from 'lib/sessionHelpers';
import { generateSnippetTitle } from 'lib/titleUtils';
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
    const { locale, city } = await getRequestParams({ req, res });
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
    const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
    const companyRubricsMatch = companyId ? { companyId: new ObjectId(companyId) } : {};

    // get product
    const product = await productsCollection.findOne({
      _id: finalProductId,
    });
    if (!product) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end('[]');
      return;
    }

    // get category slugs
    const categoriesSlugs = product.selectedOptionsSlugs.filter((slug) => {
      const slugParts = slug.split(CATEGORY_SLUG_PREFIX_SEPARATOR);
      return slugParts[0] === CATEGORY_SLUG_PREFIX_WORD && slugParts[1];
    });
    const categoriesMatch =
      categoriesSlugs.length > 0
        ? {
            selectedOptionsSlugs: {
              $all: categoriesSlugs,
            },
          }
        : {};

    // aggregate product similar products
    const shopProductsAggregation = await shopProductsCollection
      .aggregate<ShopProductInterface>([
        {
          $match: {
            productId: finalProductId,
            citySlug: city,
            ...companyRubricsMatch,
            ...noImageStage,
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
                  ...categoriesMatch,
                  citySlug: city,
                  productId: {
                    $ne: finalProductId,
                  },
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
                  brandSlug: { $first: `$brandSlug` },
                  brandCollectionSlug: { $first: '$brandCollectionSlug' },
                  views: { $max: `$views.${companySlug}.${city}` },
                  priorities: { $max: `$priorities.${companySlug}.${city}` },
                  selectedOptionsSlugs: {
                    $first: '$selectedOptionsSlugs',
                  },
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

              // get product brand
              ...brandPipeline,

              // get product attributes
              ...productAttributesPipeline,

              // get product categories
              ...productCategoriesPipeline(),

              // get shop product fields
              ...shopProductFieldsPipeline('$_id'),

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
    const productResult = shopProductsAggregation[0];

    if (!productResult || !productResult.similarProducts) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end('[]');
      return;
    }

    const similarProducts = productResult.similarProducts.reduce(
      (acc: ShopProductInterface[], shopProduct) => {
        const exist = acc.some(({ itemId }) => shopProduct.itemId === itemId);
        if (exist) {
          return acc;
        }
        const product = shopProduct.product;
        if (!product) {
          return acc;
        }

        // title
        const snippetTitle = generateSnippetTitle({
          locale,
          brand: product.brand,
          rubricName: getFieldStringLocale(product.rubric?.nameI18n, locale),
          showRubricNameInProductTitle: product.rubric?.showRubricNameInProductTitle,
          showCategoryInProductTitle: product.rubric?.showCategoryInProductTitle,
          attributes: product.attributes || [],
          originalName: product.originalName,
          defaultGender: product.gender,
          titleCategoriesSlugs: product.titleCategoriesSlugs,
          categories: getTreeFromList({
            list: product.categories,
            childrenFieldName: 'categories',
            locale,
          }),
        });

        const minPrice = noNaN(shopProduct.cardPrices?.min);
        const maxPrice = noNaN(shopProduct.cardPrices?.max);
        const cardPrices = {
          _id: new ObjectId(),
          min: `${minPrice}`,
          max: `${maxPrice}`,
        };

        return [
          ...acc,
          {
            ...shopProduct,
            product: {
              ...product,
              shopsCount: shopProduct.shopsCount,
              name: getFieldStringLocale(product.nameI18n, locale),
              cardPrices,
              snippetTitle,
            },
          },
        ];
      },
      [],
    );

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
