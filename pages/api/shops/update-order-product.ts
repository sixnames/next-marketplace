import { ORDER_STATUS_CANCELED, ORDER_STATUS_DONE } from 'config/common';
import { COL_ORDER_PRODUCTS, COL_ORDER_STATUSES, COL_ORDERS, COL_SHOPS } from 'db/collectionNames';
import { OrderProductModel, OrderStatusModel, ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SyncParamsInterface, SyncUpdateOrderProductInterface } from 'db/syncInterfaces';
import { OrderInterface, OrderProductInterface } from 'db/uiInterfaces';
import { noNaN } from 'lib/numbers';
import { NextApiRequest, NextApiResponse } from 'next';

// TODO messages
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PATCH') {
    res.status(200).send({
      success: false,
      message: 'wrong method',
    });
    return;
  }

  const body = JSON.parse(req.body) as SyncUpdateOrderProductInterface | undefined | null;
  const query = req.query as unknown as SyncParamsInterface | undefined | null;

  if (!query || !body) {
    res.status(200).send({
      success: false,
      message: 'no params provided',
    });
    return;
  }

  const { orderId } = body;
  const { apiVersion, systemVersion, token } = query;
  if (!apiVersion || !systemVersion || !token || !orderId) {
    res.status(200).send({
      success: false,
      message: 'no query params provided',
    });
    return;
  }

  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const ordersCollection = db.collection<OrderInterface>(COL_ORDERS);
  const orderProductsCollection = db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);
  const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);

  // get shop
  const shop = await shopsCollection.findOne({ token });

  if (!shop) {
    res.status(200).send({
      success: false,
      message: 'shop not found',
    });
    return;
  }

  // get shop order
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

  const shopOrdersAggregation = await ordersCollection
    .aggregate([
      {
        $match: {
          shopId: shop._id,
          itemId: orderId,
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

  const shopOrder = shopOrdersAggregation[0];
  if (!shopOrder) {
    res.status(200).send({
      success: false,
      message: 'shop order not found',
    });
    return;
  }

  // find order product
  const currentProduct = (shopOrder.products || []).find((orderProduct) => {
    return orderProduct.barcode === body.barcode;
  });
  if (!currentProduct) {
    res.status(200).send({
      success: false,
      message: 'order product not found',
    });
    return;
  }

  // find order product new status
  const newOrderProductStatus = await orderStatusesCollection.findOne({
    slug: `${body.status}`,
  });
  if (!newOrderProductStatus) {
    res.status(200).send({
      success: false,
      message: 'order product status not found',
    });
    return;
  }

  // update order product
  const newAmount = body.amount ? noNaN(body.amount) : currentProduct.amount;
  const updatedOrderProductResult = await orderProductsCollection.findOneAndUpdate(
    {
      _id: currentProduct._id,
    },
    {
      $set: {
        statusId: newOrderProductStatus._id,
        amount: newAmount,
        totalPrice: newAmount * currentProduct.price,
        updatedAt: new Date(),
      },
    },
    {
      returnOriginal: false,
    },
  );
  const updatedOrderProduct = updatedOrderProductResult.value;
  if (!updatedOrderProductResult.ok || !updatedOrderProduct) {
    res.status(200).send({
      success: false,
      message: 'order product update error',
    });
    return;
  }

  // close order if all product is in Done status
  const doneOrderProductStatus = await orderStatusesCollection.findOne({
    slug: ORDER_STATUS_DONE,
  });
  const canceledOrderProductStatus = await orderStatusesCollection.findOne({
    slug: ORDER_STATUS_CANCELED,
  });
  if (!doneOrderProductStatus || !canceledOrderProductStatus) {
    res.status(200).send({
      success: false,
      message: 'Done or Canceled order product status not found',
    });
    return;
  }

  const orderUpdatedProducts = (shopOrder.products || []).reduce(
    (acc: OrderProductInterface[], orderProduct) => {
      if (orderProduct._id.equals(updatedOrderProduct._id)) {
        return [...acc, updatedOrderProduct];
      }
      return [...acc, orderProduct];
    },
    [],
  );

  const notDoneOrderProducts = orderUpdatedProducts.filter(({ statusId }) => {
    return (
      !statusId.equals(doneOrderProductStatus._id) &&
      !statusId.equals(canceledOrderProductStatus._id)
    );
  });
  if (notDoneOrderProducts.length < 1) {
    const updatedOrderResult = await ordersCollection.findOneAndUpdate(
      {
        shopId: shop._id,
        itemId: orderId,
      },
      {
        $set: {
          statusId: doneOrderProductStatus._id,
          updatedAt: new Date(),
        },
      },
      {
        returnOriginal: false,
      },
    );

    const updatedOrder = updatedOrderResult.value;
    if (!updatedOrderResult.ok || !updatedOrder) {
      res.status(200).send({
        success: false,
        message: 'order update error',
      });
      return;
    }
  }

  res.status(200).send({
    success: true,
    message: 'success',
  });
  return;
};
