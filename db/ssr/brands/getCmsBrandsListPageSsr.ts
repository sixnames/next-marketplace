import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { CMS_BRANDS_LIMIT, DEFAULT_LOCALE, DEFAULT_PAGE, SORT_ASC, SORT_DESC } from 'lib/config/common';
import { ISO_LANGUAGES } from 'lib/config/constantSelects';
import { alwaysArray } from 'lib/arrayUtils';
import { castUrlFilters } from 'lib/castUrlFilters';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import {
  CmsBrandsListConsumerInterface,
  CmsBrandsListPageInterface,
} from 'pages/cms/brands/[...filters]';
import { COL_BRANDS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { BrandInterface } from 'db/uiInterfaces';

export const getCmsBrandsListPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsBrandsListPageInterface>> => {
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
  const links = getProjectLinks();
  const itemPath = links.cms.brands.brand.url;

  const regexSearch = {
    $regex: search,
    $options: 'i',
  };

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

  const { db } = await getDatabase();
  const brandsCollection = db.collection<BrandInterface>(COL_BRANDS);

  const brandsAggregationResult = await brandsCollection
    .aggregate<CmsBrandsListConsumerInterface>(
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
  const brandsResult = brandsAggregationResult[0];
  if (!brandsResult) {
    return {
      notFound: true,
    };
  }

  const docs: BrandInterface[] = [];
  for await (const brand of brandsResult.docs) {
    docs.push({
      ...brand,
      name: getFieldStringLocale(brand.nameI18n, locale),
    });
  }

  const payload: CmsBrandsListConsumerInterface = {
    clearSlug,
    totalDocs: brandsResult.totalDocs,
    totalPages: brandsResult.totalPages,
    itemPath,
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
