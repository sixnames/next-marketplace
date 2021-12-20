import { ObjectId } from 'mongodb';
import { DEFAULT_DIFF } from '../../../config/common';
import { sendOrderProductCanceledEmail } from '../../../lib/email/sendOrderProductCanceledEmail';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { sendOrderProductCanceledSms } from '../../../lib/sms/sendOrderProductCanceledSms';
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
  OrderProductModel,
  OrderProductPayloadModel,
  OrderStatusModel,
  UserModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface CancelOrderProductInputInterface {
  orderProductId: string;
}

export async function cancelOrderProduct({
  context,
  input,
}: DaoPropsInterface<CancelOrderProductInputInterface>): Promise<OrderProductPayloadModel> {
  const { getApiMessage, locale, city } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
  const orderLogsCollection = db.collection<OrderLogModel>(COL_ORDER_LOGS);
  const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);
  const orderProductsCollection = db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);
  const usersCollection = db.collection<UserModel>(COL_USERS);

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

      // Create order log
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
      }

      // send order notifications
      const customer = await usersCollection.findOne({
        _id: order.customerId,
      });
      if (customer) {
        const notificationConfig = {
          customer,
          orderItemId: order.orderId,
          productOriginalName: updatedOrderProducts.originalName,
          companyId: order.companyId,
          companySiteSlug: order.companySiteSlug,
          citySlug: city,
          locale,
        };
        await sendOrderProductCanceledEmail(notificationConfig);
        await sendOrderProductCanceledSms(notificationConfig);
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
