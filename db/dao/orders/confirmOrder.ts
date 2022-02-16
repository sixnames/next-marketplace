import { OrderLogModel, OrderPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { DEFAULT_DIFF, SORT_ASC } from 'lib/config/common';
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
  const { getApiMessage, citySlug, locale } = await getRequestParams(context);
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
      const orderCancelStatus = orderStatusesList.find(({ isCanceled }) => {
        return isCanceled;
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
          customer: user,
          orderItemId: order.orderId,
          companyId: order.companyId,
          companySiteSlug: order.companySiteSlug,
          citySlug: citySlug,
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
