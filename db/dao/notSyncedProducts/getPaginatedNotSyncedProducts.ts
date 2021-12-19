import { ObjectId } from 'mongodb';
import { PAGINATION_DEFAULT_LIMIT, SORT_DESC } from '../../../config/common';
import { castUrlFilters } from '../../../lib/catalogueUtils';
import { COL_NOT_SYNCED_PRODUCTS, COL_SHOPS } from '../../collectionNames';
import { getDatabase } from '../../mongodb';
import {
  AppPaginationAggregationInterface,
  AppPaginationInterface,
  NotSyncedProductInterface,
  ShopInterface,
} from '../../uiInterfaces';

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
  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);

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
