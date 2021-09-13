import { ORDER_LOG_VARIANT_CONFIRM, ORDER_STATUS_CANCELED, SORT_ASC } from 'config/common';
import {
  COL_ORDER_LOGS,
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_USERS,
} from 'db/collectionNames';
import {
  OrderLogModel,
  OrderModel,
  OrderPayloadModel,
  OrderProductModel,
  OrderStatusModel,
  UserModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { sendOrderConfirmedEmail } from 'lib/email/sendOrderConfirmedEmail';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { sendOrderConfirmedSms } from 'lib/sms/sendOrderConfirmedSms';
import { ObjectId } from 'mongodb';

export interface ConfirmOrderInputInterface {
  orderId: string;
}

export async function confirmOrder({
  context,
  input,
}: DaoPropsInterface<ConfirmOrderInputInterface>): Promise<OrderPayloadModel> {
  const { getApiMessage, city, locale, companySlug } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
  const orderLogsCollection = db.collection<OrderLogModel>(COL_ORDER_LOGS);
  const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);
  const orderProductsCollection = db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);
  const usersCollection = db.collection<UserModel>(COL_USERS);

  const session = client.startSession();

  let mutationPayload: OrderPayloadModel = {
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
        slug: 'confirmOrder',
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

      // Get order
      const order = await ordersCollection.findOne({
        _id: new ObjectId(input.orderId),
      });
      if (!order) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.notFound'),
        };
        await session.abortTransaction();
        return;
      }

      // Get order statuses
      const orderStatusesList = await orderStatusesCollection
        .aggregate([
          {
            $sort: {
              index: SORT_ASC,
            },
          },
        ])
        .toArray();

      // Get order current status
      const orderCurrentStatusIndex = orderStatusesList.findIndex(({ _id }) => {
        return _id.equals(order.statusId);
      });
      if (orderCurrentStatusIndex < 0) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.statusNotFound'),
        };
        await session.abortTransaction();
        return;
      }

      // Get order next status
      const orderNextStatus = orderStatusesList[orderCurrentStatusIndex + 1];
      if (!orderNextStatus) {
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
        statusId: orderNextStatus._id,
        variant: ORDER_LOG_VARIANT_CONFIRM,
        createdAt: new Date(),
      };
      await orderLogsCollection.insertOne(orderLog);

      // Update order
      const updatedOrderResult = await ordersCollection.findOneAndUpdate(
        {
          _id: order._id,
        },
        {
          $set: {
            statusId: orderNextStatus._id,
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

      // Get order cancel status
      const orderCancelStatus = orderStatusesList.find(({ slug }) => {
        return slug === ORDER_STATUS_CANCELED;
      });
      if (!orderCancelStatus) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.statusNotFound'),
        };
        await session.abortTransaction();
        return;
      }

      // Update order products
      const updatedOrderProductsResult = await orderProductsCollection.updateMany(
        {
          orderId: order._id,
          statusId: {
            $ne: orderCancelStatus._id,
          },
        },
        {
          $set: {
            statusId: orderNextStatus._id,
          },
        },
      );
      if (!updatedOrderProductsResult.result.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      // send order notifications
      const customer = await usersCollection.findOne({
        _id: updatedOrder.customerId,
      });
      if (customer) {
        const notificationConfig = {
          customer,
          orderItemId: order.itemId,
          companySlug,
          city,
          locale,
        };
        await sendOrderConfirmedEmail(notificationConfig);
        await sendOrderConfirmedSms(notificationConfig);
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('orders.updateOrder.success'),
        payload: updatedOrder,
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
