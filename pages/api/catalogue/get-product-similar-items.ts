import { SORT_DESC } from 'config/common';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { ignoreNoImageStage, shopProductFieldsPipeline } from 'db/dao/constantPipelines';
import { ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ShopProductInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getRequestParams, getSessionCompanySlug } from 'lib/sessionHelpers';
import { generateSnippetTitle } from 'lib/titleUtils';
import { getTreeFromList } from 'lib/treeUtils';
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

    // aggregate product similar products
    // const start = new Date().getTime();
    const shopProductsAggregation = await shopProductsCollection
      .aggregate<ShopProductInterface>([
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
          $lookup: {
            from: COL_SHOP_PRODUCTS,
            as: 'similarProducts',
            let: {
              minFilterPrice: '$minFilterPrice',
              maxFilterPrice: '$maxFilterPrice',
            },
            pipeline: [
              {
                $match: {
                  ...companyRubricsMatch,
                  rubricSlug: product.rubricSlug,
                  selectedOptionsSlugs: {
                    $in: product.selectedOptionsSlugs,
                  },
                  // ...categoriesMatch,
                  citySlug: city,
                  productId: {
                    $ne: finalProductId,
                  },
                  $expr: {
                    $and: [
                      { $gte: ['$price', '$$minFilterPrice'] },
                      { $lte: ['$price', '$$maxFilterPrice'] },
                    ],
                  },
                  ...ignoreNoImageStage,
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

              // get shop product fields
              ...shopProductFieldsPipeline('$_id'),
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
    // console.log('aggregation ', new Date().getTime() - start);

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
