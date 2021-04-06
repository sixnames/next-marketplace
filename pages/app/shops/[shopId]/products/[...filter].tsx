import Inner from 'components/Inner/Inner';
import { CATALOGUE_OPTION_SEPARATOR, PAGE_DEFAULT, SORT_DESC } from 'config/common';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import {
  CatalogueProductOptionInterface,
  CatalogueProductPricesInterface,
  ShopModel,
  ShopProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import AppLayout from 'layout/AppLayout/AppLayout';
import AppShopLayout from 'layout/AppLayout/AppShopLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters, getCatalogueRubric } from 'lib/catalogueUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ShopProductsListRouteInterface {
  shop: ShopModel;
}

const ShopProductsListRoute: React.FC<ShopProductsListRouteInterface> = ({ shop }) => {
  return (
    <AppShopLayout shop={shop}>
      <Inner>products</Inner>
    </AppShopLayout>
  );
};

interface CompanyShopProductsListInterface
  extends PagePropsInterface,
    ShopProductsListRouteInterface {}

const CompanyShopProductsList: NextPage<CompanyShopProductsListInterface> = ({
  pageUrls,
  shop,
}) => {
  return (
    <AppLayout pageUrls={pageUrls}>
      <ShopProductsListRoute shop={shop} />
    </AppLayout>
  );
};

interface ShopProductsAggregationInterface {
  docs: ShopProductModel[];
  totalDocs: number;
  totalPages: number;
  prices: CatalogueProductPricesInterface[];
  options: CatalogueProductOptionInterface[];
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopProductsListInterface>> => {
  const db = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const { query } = context;
  const { shopId, filter } = query;
  const [rubricId, ...restFilter] = alwaysArray(filter);
  const initialProps = await getAppInitialData({ context });

  console.log(' ');
  console.log('>>>>>>>>>>>>>>>>>>>>>>>');
  console.log('CompanyShopProductsList props ');
  const startTime = new Date().getTime();

  // Get shop
  const shop = await shopsCollection.findOne({ _id: new ObjectId(`${shopId}`) });
  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  // Get rubric
  const rubric = await getCatalogueRubric([
    {
      $match: { _id: new ObjectId(rubricId) },
    },
  ]);
  if (!rubric) {
    return {
      notFound: true,
    };
  }

  // Cast filters
  const {
    minPrice,
    maxPrice,
    realFilterOptions,
    // sortBy,
    // sortDir,
    // sortFilterOptions,
    noFiltersSelected,
    // castedFilters,
    page,
    skip,
    limit,
  } = castCatalogueFilters(restFilter);

  // Product stages
  const pricesStage =
    minPrice && maxPrice
      ? {
          price: {
            $gte: minPrice,
            $lte: maxPrice,
          },
        }
      : {};

  const optionsStage = noFiltersSelected
    ? {}
    : {
        selectedOptionsSlugs: {
          $all: realFilterOptions,
        },
      };

  const shopProductsAggregation = await shopProductsCollection
    .aggregate<ShopProductsAggregationInterface>([
      {
        $match: {
          rubricId: rubric._id,
          shopId: shop._id,
          ...pricesStage,
          ...optionsStage,
        },
      },
      {
        $facet: {
          docs: [
            {
              $sort: {
                _id: SORT_DESC,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $lookup: {
                from: COL_PRODUCTS,
                as: 'products',
                let: { productId: '$productId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$productId', '$_id'],
                      },
                    },
                  },
                  {
                    $project: {
                      attributes: false,
                      shopProductsCountCities: false,
                      isCustomersChoiceCities: false,
                      connections: false,
                    },
                  },
                ],
              },
            },
          ],
          options: [
            {
              $project: {
                selectedOptionsSlugs: 1,
              },
            },
            {
              $unwind: '$selectedOptionsSlugs',
            },
            {
              $group: {
                _id: '$selectedOptionsSlugs',
              },
            },
            {
              $addFields: {
                slugArray: {
                  $split: ['$_id', CATALOGUE_OPTION_SEPARATOR],
                },
              },
            },
            {
              $addFields: {
                attributeSlug: {
                  $arrayElemAt: ['$slugArray', 0],
                },
              },
            },
            {
              $group: {
                _id: '$attributeSlug',
                optionsSlugs: {
                  $addToSet: '$_id',
                },
              },
            },
          ],
          prices: [
            {
              $project: {
                price: 1,
              },
            },
            {
              $group: {
                _id: '$price',
              },
            },
          ],
          countAllDocs: [
            {
              $count: 'totalDocs',
            },
          ],
        },
      },
      {
        $addFields: {
          totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
        },
      },
      {
        $addFields: {
          totalDocs: '$totalDocsObject.totalDocs',
        },
      },
      {
        $addFields: {
          totalPagesFloat: {
            $divide: ['$totalDocs', limit],
          },
        },
      },
      {
        $addFields: {
          totalPages: {
            $ceil: '$totalPagesFloat',
          },
        },
      },
      {
        $project: {
          docs: 1,
          totalDocs: 1,
          options: 1,
          prices: 1,
          totalPages: 1,
          hasPrevPage: {
            $gt: [page, PAGE_DEFAULT],
          },
          hasNextPage: {
            $lt: [page, '$totalPages'],
          },
        },
      },
    ])
    .toArray();
  const shopProductsResult = shopProductsAggregation[0];
  if (!shopProductsResult) {
    return {
      notFound: true,
    };
  }
  console.log(shopProductsResult.docs[0]);
  console.log('After products ', new Date().getTime() - startTime);

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
    },
  };
};

export default CompanyShopProductsList;
