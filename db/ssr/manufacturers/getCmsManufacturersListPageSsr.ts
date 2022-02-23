import { getDbCollections } from 'db/mongodb';
import { ManufacturerInterface } from 'db/uiInterfaces';
import { alwaysArray } from 'lib/arrayUtils';
import { castUrlFilters } from 'lib/castUrlFilters';
import {
  CMS_BRANDS_LIMIT,
  DEFAULT_LOCALE,
  DEFAULT_PAGE,
  SORT_ASC,
  SORT_DESC,
} from 'lib/config/common';
import { ISO_LANGUAGES } from 'lib/config/constantSelects';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import {
  CmsManufacturersListConsumerInterface,
  CmsManufacturersListPageInterface,
} from 'pages/cms/manufacturers/[...filters]';

export const getCmsManufacturersListPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsManufacturersListPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { query } = context;
  const { filters, search } = query;
  const locale = props.sessionLocale;

  // Cast filters
  const { page, skip, limit, clearSlug } = await castUrlFilters({
    filters: alwaysArray(filters),
    initialLimit: CMS_BRANDS_LIMIT,
    searchFieldName: '_id',
  });

  const regexSearch = {
    $regex: search,
    $options: 'i',
  };

  // TODO algolia
  const nameSearch = search
    ? ISO_LANGUAGES.map(({ slug }) => {
        return {
          [slug]: search,
        };
      })
    : [];

  const searchStage = search
    ? [
        {
          $match: {
            $or: [
              ...nameSearch,
              {
                url: regexSearch,
              },
              {
                slug: regexSearch,
              },
              {
                itemId: regexSearch,
              },
            ],
          },
        },
      ]
    : [];

  const collections = await getDbCollections();
  const manufacturersCollection = collections.manufacturersCollection();

  const manufacturersAggregationResult = await manufacturersCollection
    .aggregate<CmsManufacturersListConsumerInterface>(
      [
        ...searchStage,
        {
          $facet: {
            docs: [
              {
                $sort: {
                  [`nameI18n.${DEFAULT_LOCALE}`]: SORT_ASC,
                  _id: SORT_DESC,
                },
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
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
            totalPages: 1,
            hasPrevPage: {
              $gt: [page, DEFAULT_PAGE],
            },
            hasNextPage: {
              $lt: [page, '$totalPages'],
            },
          },
        },
      ],
      { allowDiskUse: true },
    )
    .toArray();
  const manufacturersResult = manufacturersAggregationResult[0];
  if (!manufacturersResult) {
    return {
      notFound: true,
    };
  }

  const docs: ManufacturerInterface[] = [];
  for await (const manufacturer of manufacturersResult.docs) {
    docs.push({
      ...manufacturer,
      name: getFieldStringLocale(manufacturer.nameI18n, locale),
    });
  }

  const payload: CmsManufacturersListConsumerInterface = {
    clearSlug,
    totalDocs: manufacturersResult.totalDocs,
    totalPages: manufacturersResult.totalPages,
    page,
    docs,
  };
  const castedPayload = castDbData(payload);
  return {
    props: {
      ...props,
      ...castedPayload,
    },
  };
};
