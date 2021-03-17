import { CollectionAggregationOptions } from 'mongodb';
import {
  PAGE_DEFAULT,
  PAGINATION_DEFAULT_LIMIT,
  SORT_BY_CREATED_AT,
  SORT_BY_ID_DIRECTION,
  SORT_DESC,
} from 'config/common';
import { PaginationInputModel, PaginationPayloadType, SortDirectionModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';

interface AggregatePaginationPropsInterface {
  input?: PaginationInputModel | null;
  collectionName: string;
  pipeline?: Record<string, any>[];
  options?: CollectionAggregationOptions;
  city: string;
}

const aggregationFallback = {
  sortBy: SORT_BY_CREATED_AT,
  sortDir: SORT_DESC as SortDirectionModel,
  docs: [],
  page: 1,
  limit: 0,
  totalDocs: 0,
  totalActiveDocs: 0,
  totalPages: 0,
  hasPrevPage: false,
  hasNextPage: false,
};

export async function aggregatePagination<TModel>({
  input,
  collectionName,
  pipeline = [],
  options,
  city,
}: AggregatePaginationPropsInterface): Promise<PaginationPayloadType<TModel>> {
  try {
    const { page, sortDir, sortBy, limit } = input || {
      page: PAGE_DEFAULT,
      sortDir: SORT_DESC,
      sortBy: SORT_BY_CREATED_AT,
      limit: PAGINATION_DEFAULT_LIMIT,
    };

    const realLimit = limit || PAGINATION_DEFAULT_LIMIT;
    const realPage = page || PAGE_DEFAULT;
    const realSortDir = sortDir || SORT_DESC;
    const realSortBy = sortBy || SORT_BY_CREATED_AT;

    const db = await getDatabase();
    const skip = realPage ? (realPage - 1) * realLimit : 0;

    const aggregated = await db
      .collection<TModel>(collectionName)
      .aggregate<PaginationPayloadType<TModel>>(
        [
          ...pipeline,
          {
            $sort: {
              [realSortBy]: realSortDir,
              [`views.${city}`]: SORT_DESC,
              [`priorities.${city}`]: SORT_DESC,
              _id: SORT_BY_ID_DIRECTION,
            },
          },
          {
            $facet: {
              docs: [{ $skip: skip }, { $limit: realLimit }],
              countAllDocs: [{ $count: 'totalDocs' }],
              countActiveDocs: [{ $match: { active: true } }, { $count: 'totalActiveDocs' }],
            },
          },
          {
            $addFields: {
              totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
              totalActiveDocsObject: { $arrayElemAt: ['$countActiveDocs', 0] },
            },
          },
          {
            $addFields: {
              totalDocs: '$totalDocsObject.totalDocs',
              totalActiveDocs: '$totalActiveDocsObject.totalActiveDocs',
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
              totalActiveDocs: 1,
              totalPages: 1,
              hasPrevPage: {
                $gt: [page, PAGE_DEFAULT],
              },
              hasNextPage: {
                $lt: [page, '$totalPages'],
              },
            },
          },
        ],
        {
          ...options,
          allowDiskUse: true,
        },
      )
      .toArray();

    const aggregationResult = aggregated[0];

    if (!aggregationResult) {
      return aggregationFallback;
    }

    return {
      ...aggregationResult,
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
