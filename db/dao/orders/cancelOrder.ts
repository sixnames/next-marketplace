import { OrderLogModel, OrderPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { DEFAULT_DIFF } from 'lib/config/common';
import { sendOrderCanceledEmail } from 'lib/email/sendOrderCanceledEmail';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { sendOrderCanceledSms } from 'lib/sms/sendOrderCanceledSms';
import { ObjectId } from 'mongodb';

export interface CancelOrderInputInterface {
  orderId: string;
}

export async function cancelOrder({
  context,
  input,
}: DaoPropsInterface<CancelOrderInputInterface>): Promise<OrderPayloadModel> {
  const { getApiMessage, locale, citySlug } = await getRequestParams(context);
  const collections = await getDbCollections();
  const ordersCollection = collections.ordersCollection();
  const orderLogsCollection = collections.ordersLogsCollection();
  const orderStatusesCollection = collections.orderStatusesCollection();
  const orderProductsCollection = collections.ordersProductsCollection();
  const usersCollection = collections.usersCollection();

  const session = collections.client.startSession();

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
          citySlug: citySlug,
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
