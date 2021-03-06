import { OrderLogModel, OrderProductPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { DEFAULT_DIFF } from 'lib/config/common';
import { sendOrderProductCanceledEmail } from 'lib/email/sendOrderProductCanceledEmail';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { sendOrderProductCanceledSms } from 'lib/sms/sendOrderProductCanceledSms';
import { ObjectId } from 'mongodb';

export interface CancelOrderProductInputInterface {
  orderProductId: string;
}

export async function cancelOrderProduct({
  context,
  input,
}: DaoPropsInterface<CancelOrderProductInputInterface>): Promise<OrderProductPayloadModel> {
  const { getApiMessage, locale, citySlug } = await getRequestParams(context);
  const collections = await getDbCollections();
  const ordersCollection = collections.ordersCollection();
  const orderLogsCollection = collections.ordersLogsCollection();
  const orderStatusesCollection = collections.orderStatusesCollection();
  const orderProductsCollection = collections.ordersProductsCollection();
  const usersCollection = collections.usersCollection();

  const session = collections.client.startSession();

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
          citySlug: citySlug,
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
