import {
  ORDER_LOG_VARIANT_CANCEL,
  ORDER_LOG_VARIANT_CANCEL_PRODUCT,
  ORDER_STATUS_CANCELED,
} from 'config/common';
import {
  COL_ORDER_LOGS,
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
} from 'db/collectionNames';
import {
  OrderLogModel,
  OrderModel,
  OrderProductModel,
  OrderProductPayloadModel,
  OrderStatusModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface CancelOrderProductInputInterface {
  orderProductId: string;
}

export async function cancelOrderProduct({
  context,
  input,
}: DaoPropsInterface<CancelOrderProductInputInterface>): Promise<OrderProductPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
  const orderLogsCollection = db.collection<OrderLogModel>(COL_ORDER_LOGS);
  const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);
  const orderProductsCollection = db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);

  const session = client.startSession();

  let mutationPayload: OrderProductPayloadModel = {
    success: false,
    message: await getApiMessage('orders.makeAnOrder.error'),
  };

  try {
    await session.withTransaction(async () => {
      // check input
      if (!input) {
        await session.abortTransaction();
        return;
      }

      // Permission
      const { allow, message, user } = await getOperationPermission({
        context,
        slug: 'cancelOrder',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      if (!user) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      // order product
      const orderProduct = await orderProductsCollection.findOne({
        _id: new ObjectId(input.orderProductId),
      });
      if (!orderProduct) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      // Get order
      const order = await ordersCollection.findOne({
        _id: orderProduct.orderId,
      });
      if (!order) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.notFound'),
        };
        await session.abortTransaction();
        return;
      }

      // Get order cancel status
      const orderCancelStatus = await orderStatusesCollection.findOne({
        slug: ORDER_STATUS_CANCELED,
      });
      if (!orderCancelStatus) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.statusNotFound'),
        };
        await session.abortTransaction();
        return;
      }

      // Create order log
      const orderLog: OrderLogModel = {
        _id: new ObjectId(),
        orderId: order._id,
        userId: user._id,
        prevStatusId: order.statusId,
        statusId: orderCancelStatus._id,
        productId: orderProduct._id,
        variant: ORDER_LOG_VARIANT_CANCEL_PRODUCT,
        createdAt: new Date(),
      };
      await orderLogsCollection.insertOne(orderLog);

      // Update order products
      const updatedOrderProductsResult = await orderProductsCollection.findOneAndUpdate(
        {
          _id: orderProduct._id,
        },
        {
          $set: {
            statusId: orderCancelStatus._id,
            isCanceled: true,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      const updatedOrderProducts = updatedOrderProductsResult.value;
      if (!updatedOrderProductsResult.ok || !updatedOrderProducts) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      // cancel order if all products are canceled
      const orderProducts = await orderProductsCollection
        .find({
          orderId: order._id,
        })
        .toArray();
      const canceledProducts = orderProducts.filter(({ isCanceled }) => isCanceled);
      if (orderProducts.length === canceledProducts.length) {
        const updatedOrderResult = await ordersCollection.findOneAndUpdate(
          {
            _id: order._id,
          },
          {
            $set: {
              statusId: orderCancelStatus._id,
              isCanceled: true,
            },
          },
        );
        const updatedOrder = updatedOrderResult.value;
        if (!updatedOrderResult.ok || !updatedOrder) {
          mutationPayload = {
            success: false,
            message: await getApiMessage('orders.updateOrder.error'),
          };
          await session.abortTransaction();
          return;
        }

        // create order log
        const orderLog: OrderLogModel = {
          _id: new ObjectId(),
          orderId: order._id,
          userId: user._id,
          prevStatusId: order.statusId,
          statusId: orderCancelStatus._id,
          variant: ORDER_LOG_VARIANT_CANCEL,
          createdAt: new Date(),
        };
        await orderLogsCollection.insertOne(orderLog);
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('orders.updateOrder.success'),
        payload: updatedOrderProducts,
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
