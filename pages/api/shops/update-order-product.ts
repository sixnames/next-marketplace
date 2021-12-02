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
    res.status(405).send({
      success: false,
      message: 'wrong method',
    });
    return;
  }

  const body = JSON.parse(req.body) as SyncUpdateOrderProductInterface[] | undefined | null;
  const query = req.query as unknown as SyncParamsInterface | undefined | null;

  if (!query || !body || body.length < 1) {
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
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const ordersCollection = db.collection<OrderInterface>(COL_ORDERS);
  const orderProductsCollection = db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);
  const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);

  // get shop
  const shop = await shopsCollection.findOne({ token });

  if (!shop) {
    res.status(401).send({
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

  const lookupStages = [
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
  ];

  // get order statuses
  const doneOrderStatus = await orderStatusesCollection.findOne({
    isDone: true,
  });
  const canceledOrderStatus = await orderStatusesCollection.findOne({
    isCanceled: true,
  });
  if (!doneOrderStatus || !canceledOrderStatus) {
    res.status(200).send({
      success: true,
      message: 'order statuses not fount',
    });
    return;
  }

  const erroredOrderProducts: SyncUpdateOrderProductInterface[] = [];

  for await (const bodyItem of body) {
    const { orderId } = bodyItem;
    const shopOrdersAggregation = await ordersCollection
      .aggregate<OrderInterface>([
        {
          $match: {
            shopId: shop._id,
            itemId: orderId,
          },
        },
        ...lookupStages,
      ])
      .toArray();

    const shopOrder = shopOrdersAggregation[0];
    if (!shopOrder) {
      erroredOrderProducts.push(bodyItem);
      continue;
    }

    // find order product
    const currentProduct = (shopOrder.products || []).find((orderProduct) => {
      return orderProduct.barcode?.includes(`${bodyItem.barcode}`);
    });
    if (!currentProduct) {
      erroredOrderProducts.push(bodyItem);
      continue;
    }

    // find order product new status
    const newOrderProductStatus = await orderStatusesCollection.findOne({
      slug: `${bodyItem.status}`,
    });
    if (!newOrderProductStatus) {
      erroredOrderProducts.push(bodyItem);
      continue;
    }

    // update order product
    const newAmount = bodyItem.amount ? noNaN(bodyItem.amount) : currentProduct.amount;
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
        returnDocument: 'after',
      },
    );
    const updatedOrderProduct = updatedOrderProductResult.value;
    if (!updatedOrderProductResult.ok || !updatedOrderProduct) {
      erroredOrderProducts.push(bodyItem);
      continue;
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

    // close order if all product is in Done status
    const notDoneOrderProducts = orderUpdatedProducts.filter(({ statusId }) => {
      return !statusId.equals(doneOrderStatus._id) && !statusId.equals(canceledOrderStatus._id);
    });

    const doneOrderProducts = orderUpdatedProducts.filter(({ statusId }) => {
      return statusId.equals(doneOrderStatus._id);
    });

    if (notDoneOrderProducts.length < 1) {
      const updatedOrderResult = await ordersCollection.findOneAndUpdate(
        {
          shopId: shop._id,
          itemId: orderId,
        },
        {
          $set: {
            statusId: doneOrderProducts.length > 0 ? doneOrderStatus._id : canceledOrderStatus._id,
            updatedAt: new Date(),
          },
        },
        {
          returnDocument: 'after',
        },
      );

      const updatedOrder = updatedOrderResult.value;
      if (!updatedOrderResult.ok || !updatedOrder) {
        erroredOrderProducts.push(bodyItem);
      }
    }
  }

  if (erroredOrderProducts.length === body.length) {
    res.status(500).send({
      success: true,
      message: 'all products errored',
      erroredOrderProducts,
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: 'success',
    erroredOrderProducts,
  });
  return;
};
