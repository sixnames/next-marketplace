import { SORT_ASC } from 'config/common';
import { COL_ORDER_STATUSES, COL_SHOPS } from 'db/collectionNames';
import { OrderStatusModel, ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SyncOrderStatusInterface, SyncParamsInterface } from 'db/syncInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getSessionLocale } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

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

  const { token } = query;
  if (!token) {
    res.status(400).send({
      success: false,
      message: 'no query params provided',
    });
    return;
  }

  const { db } = await getDatabase();
  const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);
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
  const orderStatusesAggregationResult = await orderStatusesCollection
    .aggregate([
      {
        $sort: {
          index: SORT_ASC,
        },
      },
    ])
    .toArray();

  const locale = getSessionLocale({ req, res });
  const orderStatuses: SyncOrderStatusInterface[] = orderStatusesAggregationResult.map((status) => {
    return {
      _id: status.slug,
      name: getFieldStringLocale(status.nameI18n, locale),
    };
  });

  res.status(200).send({
    success: true,
    message: 'success',
    orderStatuses,
  });
  return;
};
