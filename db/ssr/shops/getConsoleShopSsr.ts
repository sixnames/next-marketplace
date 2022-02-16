import { COL_CITIES, COL_COMPANIES, COL_SYNC_LOGS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { ShopInterface } from 'db/uiInterfaces';
import { SORT_DESC } from 'lib/config/common';
import { ObjectId } from 'mongodb';

export async function getConsoleShopSsr(shopId: string): Promise<ShopInterface | null> {
  const collections = await getDbCollections();
  const shopsCollection = collections.shopsCollection();
  const shopAggregation = await shopsCollection
    .aggregate<ShopInterface>([
      {
        $match: { _id: new ObjectId(`${shopId}`) },
      },
      {
        $lookup: {
          from: COL_COMPANIES,
          as: 'company',
          foreignField: '_id',
          localField: 'companyId',
        },
      },
      {
        $lookup: {
          from: COL_CITIES,
          as: 'city',
          foreignField: 'slug',
          localField: 'citySlug',
        },
      },
      {
        $lookup: {
          from: COL_SYNC_LOGS,
          as: 'lastSyncLog',
          let: {
            token: '$token',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$token', '$token'],
                },
              },
            },
            {
              $sort: {
                createdAt: SORT_DESC,
              },
            },
            {
              $limit: 1,
            },
          ],
        },
      },
      {
        $addFields: {
          company: {
            $arrayElemAt: ['$company', 0],
          },
          lastSyncLog: {
            $arrayElemAt: ['$lastSyncLog', 0],
          },
          city: {
            $arrayElemAt: ['$city', 0],
          },
        },
      },
    ])
    .toArray();
  const shop = shopAggregation[0];
  if (!shop) {
    return null;
  }
  return shop;
}
