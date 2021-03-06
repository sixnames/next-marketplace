import { COL_CITIES, COL_SHOP_PRODUCTS, COL_USERS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { AppPaginationAggregationInterface, ShopInterface } from 'db/uiInterfaces';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { castUrlFilters } from 'lib/castUrlFilters';
import { DEFAULT_PAGE, SORT_DESC } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';

import { noNaN } from 'lib/numbers';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { CmsCompanyShopsPageInterface } from 'pages/cms/companies/[companyId]/shops/[...filters]';

export const getCmsCompanyShopsPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsCompanyShopsPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
  const shopsCollection = collections.shopsCollection();

  const { search } = query;
  const filters = alwaysArray(query.filters);
  const companyId = alwaysString(query.companyId);

  // Cast filters
  const { page, skip, limit, clearSlug } = await castUrlFilters({
    filters,
    searchFieldName: '_id',
  });

  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${companyId}`),
        },
      },
      {
        $lookup: {
          from: COL_USERS,
          as: 'owner',
          let: { ownerId: '$ownerId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$ownerId'],
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }

  const searchStage = search
    ? {
        $or: [
          {
            itemId: {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'contacts.emails': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            name: {
              $regex: search,
              $options: 'i',
            },
          },
          {
            slug: {
              $regex: search,
              $options: 'i',
            },
          },
        ],
      }
    : {};

  const shopsAggregationResult = await shopsCollection
    .aggregate<AppPaginationAggregationInterface<ShopInterface>>([
      {
        $match: {
          companyId: new ObjectId(`${companyId}`),
          ...searchStage,
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
                from: COL_CITIES,
                as: 'city',
                let: { citySlug: '$citySlug' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$citySlug', '$slug'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: COL_SHOP_PRODUCTS,
                as: 'productsCount',
                let: { shopId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$shopId', '$shopId'],
                      },
                    },
                  },
                  {
                    $count: 'counter',
                  },
                ],
              },
            },
            {
              $addFields: {
                city: {
                  $arrayElemAt: ['$city', 0],
                },
                productsCount: {
                  $arrayElemAt: ['$productsCount', 0],
                },
              },
            },
            {
              $addFields: {
                productsCount: '$productsCount.counter',
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
          totalDocsObject: {
            $arrayElemAt: ['$countAllDocs', 0],
          },
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
          totalPages: 1,
          hasPrevPage: {
            $gt: [page, DEFAULT_PAGE],
          },
          hasNextPage: {
            $lt: [page, '$totalPages'],
          },
        },
      },
    ])
    .toArray();

  const shopsAggregation = shopsAggregationResult[0];
  if (!shopsAggregation) {
    return {
      notFound: true,
    };
  }

  const docs = shopsAggregation.docs.map(({ city, ...shop }) => {
    return {
      ...shop,
      city: city
        ? {
            ...city,
            name: getFieldStringLocale(city.nameI18n, props.sessionLocale),
          }
        : null,
    };
  });

  return {
    props: {
      ...props,
      clearSlug,
      page,
      pageCompany: castDbData(companyResult),
      totalPages: noNaN(shopsAggregation.totalPages),
      totalDocs: noNaN(shopsAggregation.totalDocs),
      docs: castDbData(docs),
    },
  };
};
