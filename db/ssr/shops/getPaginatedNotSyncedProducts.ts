import { COL_NOT_SYNCED_PRODUCTS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import {
  AppPaginationAggregationInterface,
  AppPaginationInterface,
  NotSyncedProductInterface,
} from 'db/uiInterfaces';
import { castUrlFilters } from 'lib/castUrlFilters';
import { PAGINATION_DEFAULT_LIMIT, SORT_DESC } from 'lib/config/common';
import { ObjectId } from 'mongodb';

interface GetPaginatedNotSyncedProductsInterface {
  shopId?: string;
  filters: string[];
}

interface GetPaginatedNotSyncedProductsPayloadInterface
  extends AppPaginationInterface<NotSyncedProductInterface> {}

export async function getPaginatedNotSyncedProducts({
  shopId,
  filters,
}: GetPaginatedNotSyncedProductsInterface): Promise<GetPaginatedNotSyncedProductsPayloadInterface | null> {
  const collections = await getDbCollections();
  const shopsCollection = collections.shopsCollection();

  const { page, skip, limit, clearSlug } = await castUrlFilters({
    filters: filters,
    initialLimit: PAGINATION_DEFAULT_LIMIT,
    searchFieldName: '_id',
  });

  let shopStage: any[] = [];
  if (shopId) {
    shopStage = [
      {
        $match: {
          _id: new ObjectId(shopId),
        },
      },
    ];
  }

  const notSyncedProductsAggregationResult = await shopsCollection
    .aggregate<AppPaginationAggregationInterface<NotSyncedProductInterface>>([
      ...shopStage,
      {
        $project: {
          _id: true,
          name: true,
        },
      },

      // get sync errors
      {
        $lookup: {
          from: COL_NOT_SYNCED_PRODUCTS,
          as: 'notSyncedProducts',
          let: {
            shopId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$shopId', '$$shopId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          notSyncedProductsCount: {
            $size: '$notSyncedProducts',
          },
        },
      },
      {
        $match: {
          notSyncedProductsCount: {
            $gt: 0,
          },
        },
      },

      // unwind notSyncedProducts
      {
        $unwind: {
          path: '$notSyncedProducts',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          'notSyncedProducts.shop': '$$ROOT',
        },
      },
      {
        $addFields: {
          'notSyncedProducts.shop.notSyncedProducts': null,
          'notSyncedProducts.shop.notSyncedProductsCount': null,
        },
      },

      // set notSyncedProduct as root
      {
        $replaceRoot: {
          newRoot: '$notSyncedProducts',
        },
      },

      // facets
      {
        $facet: {
          docs: [
            {
              $sort: {
                createdAt: SORT_DESC,
                name: SORT_DESC,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
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
        },
      },
    ])
    .toArray();
  const notSyncedProducts = notSyncedProductsAggregationResult[0];
  if (!notSyncedProducts) {
    return null;
  }

  return {
    ...notSyncedProducts,
    page,
    clearSlug,
  };
}
