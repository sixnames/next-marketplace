import { COL_SHOPS } from 'db/collectionNames';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SyncParamsInterface } from 'db/syncInterfaces';
import { NextApiRequest, NextApiResponse } from 'next';

// TODO messages
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(200).send({
      success: false,
      message: 'wrong method',
    });
    return;
  }

  const query = (req.query as unknown) as SyncParamsInterface | undefined | null;

  if (!query) {
    res.status(200).send({
      success: false,
      message: 'no params provided',
    });
    return;
  }

  const { apiVersion, systemVersion, token } = query;
  if (!apiVersion || !systemVersion || !token) {
    res.status(200).send({
      success: false,
      message: 'no query params provided',
    });
    return;
  }

  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);

  // get shop
  const shop = await shopsCollection.findOne({ token });

  if (!shop) {
    res.status(200).send({
      success: false,
      message: 'shop not found',
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: 'synced',
  });
  return;
};
