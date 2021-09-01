import {
  ProductsPaginationPayloadModel,
  ProductsPaginationInputModel,
  SortDirectionModel,
} from 'db/dbModels';
import { COL_PRODUCTS } from 'db/collectionNames';
import {
  DEFAULT_PAGE,
  PAGINATION_DEFAULT_LIMIT,
  // SORT_ASC,
  SORT_BY_CREATED_AT,
  SORT_DESC,
} from 'config/common';
import { getDatabase } from 'db/mongodb';
import { ProductsPaginationAggregationInterface } from 'db/uiInterfaces';
import { getAlgoliaProductsSearch } from 'lib/algoliaUtils';
import { noNaN } from 'lib/numbers';
import { CollectionAggregationOptions, ObjectId } from 'mongodb';

export interface ProductsPaginationQueryInterface {
  input?: ProductsPaginationInputModel | null;
  city: string;
  initialMatchPipeline?: any[];
  shopsMatchPipeline?: any[];
  options?: CollectionAggregationOptions;
  active?: boolean;
}

const aggregationFallback: ProductsPaginationPayloadModel = {
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

export async function productsPaginationQuery({
  input,
  // city,
  initialMatchPipeline = [],
  shopsMatchPipeline = [],
  options,
  active,
}: ProductsPaginationQueryInterface): Promise<ProductsPaginationPayloadModel> {
  try {
    // const timeStart = new Date().getTime();

    const { db } = await getDatabase();
    const productsCollection = db.collection(COL_PRODUCTS);
    const {
      excludedProductsIds,
      excludedRubricsIds,
      excludedOptionsSlugs,
      rubricId,
      attributesIds,
      search,
      ...restInputValues
    } = input || {};
    const { page, sortDir, sortBy, limit } = restInputValues || {
      page: DEFAULT_PAGE,
      sortDir: SORT_DESC,
      sortBy: SORT_BY_CREATED_AT,
      limit: PAGINATION_DEFAULT_LIMIT,
    };

    const realLimit = limit || PAGINATION_DEFAULT_LIMIT;
    const realPage = page || DEFAULT_PAGE;
    const skip = realPage ? (realPage - 1) * realLimit : 0;
    const realSortDir = sortDir || SORT_DESC;
    let realSortBy = sortBy || '_id';
    if (sortBy === 'price') {
      realSortBy = 'minPrice';
    }

    const sortStage = {
      [realSortBy]: realSortDir,
    };

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
              rubricId: { $nin: excludedRubricsIds },
            },
          },
        ]
      : [];

    const excludedOptionsSlugsStage = excludedOptionsSlugs
      ? [
          {
            $unwind: {
              path: '$selectedOptionsSlugs',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              selectedOptionsSlugs: { $nin: excludedOptionsSlugs },
            },
          },
          {
            $group: {
              _id: '$_id',
              doc: { $first: '$$ROOT' },
              selectedOptionsSlugs: {
                $push: '$selectedOptionsSlugs',
              },
            },
          },
          {
            $addFields: {
              'doc.selectedOptionsSlugs': '$selectedOptionsSlugs',
            },
          },
          {
            $replaceRoot: {
              newRoot: '$doc',
            },
          },
        ]
      : [];

    // activity
    const activeStage = active ? { active: true } : {};

    const rubricsStage = rubricId
      ? [
          {
            $match: {
              rubricId,
              ...activeStage,
            },
          },
        ]
      : [];

    const attributesStage = attributesIds
      ? [
          {
            $unwind: {
              path: '$selectedAttributesIds',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              selectedAttributesIds: { $in: attributesIds },
            },
          },
          {
            $group: {
              _id: '$_id',
              doc: { $first: '$$ROOT' },
              selectedAttributesIds: {
                $push: '$selectedAttributesIds',
              },
            },
          },
          {
            $addFields: {
              'doc.selectedAttributesIds': '$selectedAttributesIds',
            },
          },
          {
            $replaceRoot: {
              newRoot: '$doc',
            },
          },
        ]
      : [];

    // algolia
    let searchIds: ObjectId[] = [];
    if (search) {
      searchIds = await getAlgoliaProductsSearch({
        indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
        search: `${search}`,
        excludedProductsIds,
      });

      // return empty page if no search results
      if (searchIds.length < 1) {
        return aggregationFallback;
      }
    }

    // search
    const searchStage =
      search && search.length > 0 && searchIds.length > 0
        ? [
            {
              $match: {
                _id: {
                  $in: searchIds,
                },
              },
            },
          ]
        : [];

    const pipeline = [
      ...searchStage,
      ...excludedProductsStage,
      ...rubricsStage,
      ...excludedRubricsStage,
      ...attributesStage,
      ...excludedOptionsSlugsStage,

      // filter shop products data
      ...shopsMatchPipeline,

      // Optional initial pipeline
      ...initialMatchPipeline,

      // facet pagination totals
      {
        $facet: {
          docs: [
            // Stable sort
            { $sort: sortStage },
            { $skip: skip },
            { $limit: realLimit },
          ],
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
            $gt: [page, DEFAULT_PAGE],
          },
          hasNextPage: {
            $lt: [page, '$totalPages'],
          },
        },
      },
    ];
    /*const stats = await productsCollection
      .aggregate<ProductsPaginationPayloadModel>(pipeline, { allowDiskUse: true, ...options })
      .explain();
    console.log(JSON.stringify(stats, null, 2));*/

    const aggregated = await productsCollection
      .aggregate<ProductsPaginationAggregationInterface>(pipeline, {
        allowDiskUse: true,
        ...options,
      })
      .toArray();
    const aggregationResult = aggregated[0];

    if (!aggregationResult) {
      return aggregationFallback;
    }

    // console.log('Products pagination >>> ', new Date().getTime() - timeStart);

    return {
      docs: aggregationResult.docs,
      totalDocs: noNaN(aggregationResult.totalDocs),
      totalActiveDocs: noNaN(aggregationResult.totalActiveDocs),
      totalPages: aggregationResult.totalPages || DEFAULT_PAGE,
      sortBy: realSortBy,
      sortDir: realSortDir,
      page: realPage,
      limit: realLimit,
      hasNextPage: aggregationResult.hasNextPage,
      hasPrevPage: aggregationResult.hasPrevPage,
    };
  } catch (e) {
    console.log(e);
    return aggregationFallback;
  }
}
