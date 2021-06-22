import { COL_ORDER_PRODUCTS, COL_ORDER_STATUSES, COL_ORDERS, COL_SHOPS } from 'db/collectionNames';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  SyncOrderInterface,
  SyncOrderProductInterface,
  GetOrdersParamsInterface,
} from 'db/syncInterfaces';
import { OrderInterface } from 'db/uiInterfaces';
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

  const query = req.query as unknown as GetOrdersParamsInterface | undefined | null;

  if (!query) {
    res.status(400).send({
      success: false,
      message: 'no params provided',
    });
    return;
  }

  const { apiVersion, systemVersion, token, fromDate } = query;
  if (!apiVersion || !systemVersion || !token || !fromDate) {
    res.status(400).send({
      success: false,
      message: 'no query params provided',
    });
    return;
  }

  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const ordersCollection = db.collection<OrderInterface>(COL_ORDERS);

  // get shop
  const shop = await shopsCollection.findOne({ token });

  if (!shop) {
    res.status(401).send({
      success: false,
      message: 'shop not found',
    });
    return;
  }

  const statusStages = [
    {
      $lookup: {
        as: 'status',
        from: COL_ORDER_STATUSES,
        let: { statusId: '$statusId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$statusId'],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        status: {
          $arrayElemAt: ['$status', 0],
        },
      },
    },
  ];

  const updatedAt = new Date(fromDate);
  const shopOrdersAggregation = await ordersCollection
    .aggregate([
      {
        $match: {
          shopId: shop._id,
          updatedAt: {
            $gte: updatedAt,
          },
        },
      },
      {
        $lookup: {
          as: 'products',
          from: COL_ORDER_PRODUCTS,
          let: { orderId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$orderId', '$$orderId'],
                },
              },
            },
            ...statusStages,
          ],
        },
      },
      ...statusStages,
    ])
    .toArray();

  // TODO barcode of current shop product
  const shopOrders = shopOrdersAggregation.reduce((acc: SyncOrderInterface[], order) => {
    const { itemId, status, products, updatedAt, createdAt, reservationDate } = order;
    if (!status || !products || products.length < 1) {
      return acc;
    }

    return [
      ...acc,
      {
        orderId: itemId,
        shopId: shop.itemId,
        status: status.slug,
        reservationDate: reservationDate ? reservationDate.toISOString() : null,
        updatedAt,
        createdAt,
        products: products.reduce((acc: SyncOrderProductInterface[], orderProduct) => {
          const { status, barcode, amount, price, createdAt, updatedAt } = orderProduct;
          if (!status) {
            return acc;
          }
          return [
            ...acc,
            {
              status: status.slug,
              barcode: barcode && barcode[0] ? `${barcode[0]}` : undefined, // TODO current barcode
              amount,
              price,
              createdAt,
              updatedAt,
            },
          ];
        }, []),
      },
    ];
  }, []);

  res.status(200).send({
    success: true,
    message: 'success',
    orders: shopOrders,
  });
  return;
};
