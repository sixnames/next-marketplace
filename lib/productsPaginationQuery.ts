import {
  ProductsPaginationPayloadModel,
  ProductsPaginationInputModel,
  SortDirectionModel,
  ProductFacetModel,
  ProductsPaginationAggregationInterface,
  ProductModel,
} from 'db/dbModels';
import { COL_PRODUCT_FACETS, COL_PRODUCTS } from 'db/collectionNames';
import {
  PAGE_DEFAULT,
  PAGINATION_DEFAULT_LIMIT,
  // SORT_ASC,
  SORT_BY_CREATED_AT,
  SORT_DESC,
} from 'config/common';
import { getDatabase } from 'db/mongodb';
import { noNaN } from 'lib/numbers';
import { CollectionAggregationOptions } from 'mongodb';

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

    const db = await getDatabase();
    const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
    const { excludedProductsIds, excludedRubricsIds, rubricId, attributesIds, ...restInputValues } =
      input || {};
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
            $match: {
              'attributes.attributeId': { $in: attributesIds },
            },
          },
        ]
      : [];

    // TODO search pipeline

    const pipeline = [
      ...rubricsStage,
      ...excludedProductsStage,
      ...excludedRubricsStage,
      ...attributesStage,

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
            {
              $lookup: {
                from: COL_PRODUCTS,
                as: 'products',
                localField: '_id',
                foreignField: '_id',
              },
            },
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
            $gt: [page, PAGE_DEFAULT],
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

    const aggregated = await productFacetsCollection
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

    const finalDocs = aggregationResult.docs.reduce((acc: ProductModel[], { products }) => {
      if (!products) {
        return acc;
      }
      const product = products[0];
      if (product) {
        return [...acc, product];
      }
      return acc;
    }, []);

    return {
      docs: finalDocs,
      totalDocs: noNaN(aggregationResult.totalDocs),
      totalActiveDocs: noNaN(aggregationResult.totalActiveDocs),
      totalPages: aggregationResult.totalPages || PAGE_DEFAULT,
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
