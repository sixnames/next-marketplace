import { COL_NOT_SYNCED_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { NotSyncedProductModel, ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SyncParamsInterface } from 'db/syncInterfaces';
import { NextApiRequest, NextApiResponse } from 'next';

// TODO messages
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).send({
      success: false,
      message: 'wrong method',
    });
    return;
  }

  const query = req.query as unknown as SyncParamsInterface | undefined | null;

  if (!query) {
    res.status(400).send({
      success: false,
      message: 'no params provided',
    });
    return;
  }

  const { apiVersion, systemVersion, token } = query;
  if (!apiVersion || !systemVersion || !token) {
    res.status(400).send({
      success: false,
      message: 'no query params provided',
    });
    return;
  }

  const { db } = await getDatabase();
  const notSyncedProductsCollection = db.collection<NotSyncedProductModel>(COL_NOT_SYNCED_PRODUCTS);
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);

  // get shop
  const shop = await shopsCollection.findOne({ token });

  if (!shop) {
    res.status(401).send({
      success: false,
      message: 'shop not found',
    });
    return;
  }

  // get order statuses
  const syncErrors = await notSyncedProductsCollection.find({ shopId: shop._id }).toArray();
  const finalSyncErrors = syncErrors.map(
    ({ price, available, shopId, barcode, createdAt, name }) => {
      return {
        price,
        available,
        shopId,
        barcode,
        createdAt,
        name,
      };
    },
  );

  res.status(200).send({
    success: true,
    message: 'success',
    syncErrors: finalSyncErrors,
  });
  return;
};
