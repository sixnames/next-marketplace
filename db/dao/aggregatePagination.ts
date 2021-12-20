import { AggregateOptions } from 'mongodb';
import {
  DEFAULT_PAGE,
  PAGINATION_DEFAULT_LIMIT,
  SORT_BY_CREATED_AT,
  SORT_BY_ID_DIRECTION,
  SORT_DESC,
} from '../../config/common';
import { PaginationInputModel, PaginationPayloadType } from '../dbModels';
import { getDatabase } from '../mongodb';

interface CastPaginationInputPayload {
  search?: string | null;
  sortBy: string;
  sortDir: number;
  page: number;
  limit: number;
  skip: number;
}

export function castPaginationInput(
  input?: PaginationInputModel | null,
): CastPaginationInputPayload {
  const realLimit = input?.limit || PAGINATION_DEFAULT_LIMIT;
  const realPage = input?.page || DEFAULT_PAGE;
  return {
    search: input?.search,
    limit: realLimit,
    page: realPage,
    sortDir: input?.sortDir || SORT_DESC,
    sortBy: input?.sortBy || SORT_BY_CREATED_AT,
    skip: (realPage - 1) * realLimit,
  };
}

interface AggregatePaginationPropsInterface {
  input?: PaginationInputModel | null;
  collectionName: string;
  pipeline?: Record<string, any>[];
  options?: AggregateOptions;
  city: string;
}

const aggregationFallback = {
  sortBy: SORT_BY_CREATED_AT,
  sortDir: SORT_DESC,
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
    const { db } = await getDatabase();
    const { page, sortDir, sortBy, limit, skip } = castPaginationInput(input);

    const aggregated = await db
      .collection<TModel>(collectionName)
      .aggregate<PaginationPayloadType<TModel>>(
        [
          ...pipeline,
          {
            $sort: {
              [`${sortBy}`]: sortDir,
              [`views.${city}`]: SORT_DESC,
              [`priorities.${city}`]: SORT_DESC,
              _id: SORT_BY_ID_DIRECTION,
            },
          },
          {
            $facet: {
              docs: [{ $skip: skip }, { $limit: limit }],
              countAllDocs: [{ $count: 'totalDocs' }],
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
      totalPages: aggregationResult.totalPages || DEFAULT_PAGE,
      sortBy,
      sortDir,
      page,
      limit,
    };
  } catch (e) {
    console.log(e);
    return aggregationFallback;
  }
}
