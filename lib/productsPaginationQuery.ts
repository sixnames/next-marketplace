import {
  ProductModel,
  ProductsPaginationPayloadModel,
  ProductsPaginationInputModel,
  SortDirectionModel,
} from 'db/dbModels';
import { COL_PRODUCTS } from 'db/collectionNames';
import {
  PAGE_DEFAULT,
  PAGINATION_DEFAULT_LIMIT,
  SORT_ASC,
  SORT_BY_CREATED_AT,
  SORT_BY_ID_DIRECTION,
  SORT_DESC,
} from 'config/common';
import { getDatabase } from 'db/mongodb';
import { CollectionAggregationOptions } from 'mongodb';

export interface ProductsPaginationQueryInterface {
  input?: ProductsPaginationInputModel | null;
  city: string;
  initialMatchPipeline?: any[];
  shopsMatchPipeline?: any[];
  options?: CollectionAggregationOptions;
}

const aggregationFallback: ProductsPaginationPayloadModel = {
  sortBy: SORT_BY_CREATED_AT,
  sortDir: SORT_DESC as SortDirectionModel,
  docs: [],
  minPrice: 0,
  maxPrice: 0,
  page: 1,
  limit: 0,
  totalDocs: 0,
  totalActiveDocs: 0,
  totalPages: 0,
  hasPrevPage: false,
  hasNextPage: false,
};

export async function productsPaginationQuery({
  input,
  city,
  initialMatchPipeline = [],
  shopsMatchPipeline = [],
  options,
}: ProductsPaginationQueryInterface): Promise<ProductsPaginationPayloadModel> {
  try {
    const db = await getDatabase();
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
    const {
      excludedProductsIds,
      excludedRubricsIds,
      isWithoutRubrics,
      rubricsIds,
      attributesIds,
      ...restInputValues
    } = input || {};
    const { page, sortDir, sortBy, limit } = restInputValues || {
      page: PAGE_DEFAULT,
      sortDir: SORT_DESC,
      sortBy: SORT_BY_CREATED_AT,
      limit: PAGINATION_DEFAULT_LIMIT,
    };

    const realLimit = limit || PAGINATION_DEFAULT_LIMIT;
    const realPage = page || PAGE_DEFAULT;
    const skip = realPage ? (realPage - 1) * realLimit : 0;
    const realSortDir = sortDir || SORT_DESC;
    let realSortBy = sortBy || SORT_BY_CREATED_AT;
    if (sortBy === 'price') {
      realSortBy = 'minPrice';
    }

    // TODO search pipeline

    const excludedProductsStage = excludedProductsIds
      ? [
          {
            $match: {
              _id: { $nin: excludedProductsIds },
            },
          },
        ]
      : [];

    const excludedRubricsStage = excludedRubricsIds
      ? [
          {
            $match: {
              rubricsIds: { $nin: excludedRubricsIds },
            },
          },
        ]
      : [];

    const isWithoutRubricsStage = isWithoutRubrics
      ? [
          {
            $match: {
              $or: [
                {
                  rubricsIds: { $exists: true, $size: 0 },
                },
                {
                  rubricsIds: { $exists: false },
                },
              ],
            },
          },
        ]
      : [];

    const rubricsStage = rubricsIds
      ? [
          {
            $match: {
              rubricsIds: { $in: rubricsIds },
            },
          },
        ]
      : [];

    const attributesStage = attributesIds
      ? [
          {
            $match: {
              'attributes.attributeId': { $in: attributesIds },
            },
          },
        ]
      : [];

    const aggregated = await productsCollection
      .aggregate<ProductsPaginationPayloadModel>(
        [
          ...rubricsStage,
          ...excludedProductsStage,
          ...excludedRubricsStage,
          ...isWithoutRubricsStage,
          ...attributesStage,

          // filter shop products data
          ...shopsMatchPipeline,

          // add minPrice and maxPrice fields
          { $addFields: { minPrice: `$minPriceCities.${city}` } },
          { $addFields: { maxPrice: `$maxPriceCities.${city}` } },

          // Optional initial pipeline
          ...initialMatchPipeline,

          {
            $sort: {
              [realSortBy]: realSortDir,
              [`priority.${city}`]: SORT_DESC,
              [`views.${city}`]: SORT_DESC,
              _id: SORT_BY_ID_DIRECTION,
            },
          },

          // facet pagination totals
          {
            $facet: {
              docs: [{ $skip: skip }, { $limit: realLimit }],
              countAllDocs: [{ $count: 'totalDocs' }],
              countActiveDocs: [{ $match: { active: true } }, { $count: 'totalActiveDocs' }],
              minPriceDocs: [
                { $group: { _id: '$minPrice' } },
                { $sort: { _id: SORT_ASC } },
                { $limit: 1 },
              ],
              maxPriceDocs: [
                { $group: { _id: '$maxPrice' } },
                { $sort: { _id: SORT_DESC } },
                { $limit: 1 },
              ],
            },
          },
          {
            $addFields: {
              totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
              minPriceDocsObject: { $arrayElemAt: ['$minPriceDocs', 0] },
              maxPriceDocsObject: { $arrayElemAt: ['$maxPriceDocs', 0] },
            },
          },
          {
            $addFields: {
              totalDocs: '$totalDocsObject.totalDocs',
              minPrice: '$minPriceDocsObject._id',
              maxPrice: '$maxPriceDocsObject._id',
            },
          },
          {
            $addFields: {
              totalPagesFloat: {
                $divide: ['$totalDocs', realLimit],
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
              minPrice: 1,
              maxPrice: 1,
              hasPrevPage: {
                $gt: [page, PAGE_DEFAULT],
              },
              hasNextPage: {
                $lt: [page, '$totalPages'],
              },
            },
          },
        ],
        { ...options, allowDiskUse: true },
      )
      .toArray();

    const aggregationResult = aggregated[0];

    if (!aggregationResult) {
      return aggregationFallback;
    }

    return {
      ...aggregationResult,
      minPrice: aggregationResult.minPrice || 0,
      maxPrice: aggregationResult.maxPrice || 0,
      totalDocs: aggregationResult.totalDocs || 0,
      totalActiveDocs: aggregationResult.totalActiveDocs || 0,
      totalPages: aggregationResult.totalPages || PAGE_DEFAULT,
      sortBy: realSortBy,
      sortDir: realSortDir,
      page: realPage,
      limit: realLimit,
    };
  } catch (e) {
    console.log(e);
    return aggregationFallback;
  }
}
