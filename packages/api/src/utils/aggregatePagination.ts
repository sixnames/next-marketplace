import { PaginatedAggregationInput } from '../resolvers/commonInputs/PaginatedAggregationType';
import {
  PAGE_DEFAULT,
  PAGINATION_DEFAULT_LIMIT,
  SORT_BY_CREATED_AT,
  SORT_BY_ID_DIRECTION,
  SORT_DESC_NUM,
} from '@yagu/shared';
import { mongoose } from '@typegoose/typegoose';
import { SortDirectionNumEnum } from '../resolvers/commonInputs/PaginateInput';
import { CollectionAggregationOptions } from 'mongodb';

interface AggregatePaginationInputInterface extends PaginatedAggregationInput {
  [key: string]: any;
}

interface AggregatePaginationPropsInterface<TInput> {
  input?: TInput | null;
  collectionName: string;
  pipeline?: Record<string, any>[];
  options?: CollectionAggregationOptions;
}

interface CollectionAggregationInterface<TModel> {
  docs: TModel[];
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export async function aggregatePagination<
  TModel,
  TInput extends AggregatePaginationInputInterface
>({ input, collectionName, pipeline = [], options }: AggregatePaginationPropsInterface<TInput>) {
  try {
    const {
      page = PAGE_DEFAULT,
      sortDir = SORT_DESC_NUM,
      sortBy = SORT_BY_CREATED_AT,
      limit = PAGINATION_DEFAULT_LIMIT,
    } = input || {
      page: PAGE_DEFAULT,
      sortDir: SORT_DESC_NUM,
      sortBy: SORT_BY_CREATED_AT,
      limit: PAGINATION_DEFAULT_LIMIT,
    };

    const skip = page ? (page - 1) * limit : 0;
    const aggregated = await mongoose.connection.db
      .collection(collectionName)
      .aggregate<CollectionAggregationInterface<TModel>>(
        [
          ...pipeline,
          { $sort: { createdAt: sortDir, _id: SORT_BY_ID_DIRECTION } },
          { $addFields: { id: { $toString: '$_id' } } },
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
                $gt: [page, PAGE_DEFAULT],
              },
              hasNextPage: {
                $lt: [page, '$totalPages'],
              },
            },
          },
        ],
        options,
      )
      .toArray();

    const aggregationResult = aggregated[0];
    const { totalDocs, totalPages, hasPrevPage, hasNextPage } = aggregationResult;

    return {
      sortBy,
      sortDir,
      page,
      limit,
      totalDocs,
      totalPages,
      docs: aggregationResult.docs,
      hasPrevPage,
      hasNextPage,
    };
  } catch (e) {
    console.log(e);
    return {
      sortBy: SORT_BY_CREATED_AT,
      sortDir: SORT_DESC_NUM as SortDirectionNumEnum,
      docs: [],
      page: 1,
      limit: 0,
      totalDocs: 0,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: false,
    };
  }
}
