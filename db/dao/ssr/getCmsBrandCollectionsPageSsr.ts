import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { CMS_BRANDS_LIMIT, DEFAULT_LOCALE, DEFAULT_PAGE, SORT_ASC, SORT_DESC } from 'config/common';
import { ISO_LANGUAGES } from 'config/constantSelects';
import { alwaysArray } from 'lib/arrayUtils';
import { castUrlFilters } from 'lib/castUrlFilters';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import {
  BrandCollectionsAggregationInterface,
  CmsBrandCollectionsPageInterface,
} from 'pages/cms/brands/brand/[brandId]/collections/[...filters]';
import { COL_BRAND_COLLECTIONS, COL_BRANDS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { BrandCollectionInterface, BrandInterface } from 'db/uiInterfaces';

export const getCmsBrandCollectionsPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsBrandCollectionsPageInterface>> => {
  const { query } = context;
  const { search } = query;
  const filters = alwaysArray(query.filters);
  const { db } = await getDatabase();
  const brandsCollection = db.collection<BrandInterface>(COL_BRANDS);
  const brandCollectionsCollection = db.collection<BrandCollectionInterface>(COL_BRAND_COLLECTIONS);

  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const locale = props.sessionLocale;

  const initialBrand = await brandsCollection.findOne({
    _id: new ObjectId(`${query.brandId}`),
  });
  if (!initialBrand) {
    console.log('if (!initialBrand) {');
    return {
      notFound: true,
    };
  }

  const brand: BrandInterface = {
    ...initialBrand,
    name: getFieldStringLocale(initialBrand.nameI18n, props.sessionLocale),
  };

  // Cast filters
  const { page, skip, limit, clearSlug } = await castUrlFilters({
    filters: alwaysArray(filters),
    initialLimit: CMS_BRANDS_LIMIT,
    searchFieldName: '_id',
  });
  const itemPath = ``;

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

  const brandsAggregationResult = await brandCollectionsCollection
    .aggregate<BrandCollectionsAggregationInterface>(
      [
        {
          $match: {
            brandId: brand._id,
          },
        },
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
    console.log('if (!brandsResult) {');
    return {
      notFound: true,
    };
  }

  const docs: BrandCollectionInterface[] = [];
  for await (const brand of brandsResult.docs) {
    docs.push({
      ...brand,
      name: getFieldStringLocale(brand.nameI18n, locale),
    });
  }

  const payload: BrandCollectionsAggregationInterface = {
    clearSlug,
    totalDocs: brandsResult.totalDocs || 0,
    totalPages: brandsResult.totalPages || 0,
    itemPath,
    page,
    docs,
  };

  return {
    props: {
      ...props,
      brand: castDbData(brand),
      collections: castDbData(payload),
    },
  };
};
