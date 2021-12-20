import { ObjectId } from 'mongodb';
import { DEFAULT_DIFF } from '../../../config/common';
import { sendOrderCanceledEmail } from '../../../lib/email/sendOrderCanceledEmail';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { sendOrderCanceledSms } from '../../../lib/sms/sendOrderCanceledSms';
import {
  COL_ORDER_LOGS,
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_USERS,
} from '../../collectionNames';
import {
  OrderLogModel,
  OrderModel,
  OrderPayloadModel,
  OrderProductModel,
  OrderStatusModel,
  UserModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface CancelOrderInputInterface {
  orderId: string;
}

export async function cancelOrder({
  context,
  input,
}: DaoPropsInterface<CancelOrderInputInterface>): Promise<OrderPayloadModel> {
  const { getApiMessage, locale, city } = await getRequestParams(context);
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

      // permission
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

      // get order
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

      // get order cancel status
      const orderCancelStatus = await orderStatusesCollection.findOne({
        isCanceled: true,
      });
      if (!orderCancelStatus) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.statusNotFound'),
        };
        await session.abortTransaction();
        return;
      }

      // create order log
      const orderLog: OrderLogModel = {
        _id: new ObjectId(),
        orderId: order._id,
        userId: user._id,
        diff: DEFAULT_DIFF,
        logUser: {
          name: user.name,
          lastName: user.lastName,
          secondName: user.secondName,
          email: user.email,
          phone: user.phone,
        },
        createdAt: new Date(),
      };
      await orderLogsCollection.insertOne(orderLog);

      // update order
      const updatedOrderResult = await ordersCollection.findOneAndUpdate(
        {
          _id: order._id,
        },
        {
          $set: {
            statusId: orderCancelStatus._id,
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

      // update order products
      const updatedOrderProductsResult = await orderProductsCollection.updateMany(
        {
          orderId: order._id,
        },
        {
          $set: {
            statusId: orderCancelStatus._id,
            isCanceled: true,
          },
        },
      );
      if (!updatedOrderProductsResult.acknowledged) {
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
          orderItemId: order.orderId,
          companyId: order.companyId,
          companySiteSlug: order.companySiteSlug,
          orderObjectId: order._id,
          citySlug: city,
          locale,
        };
        await sendOrderCanceledEmail(notificationConfig);
        await sendOrderCanceledSms(notificationConfig);
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('orders.updateOrder.success'),
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
