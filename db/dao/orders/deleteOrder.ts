import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { MakeAnOrderPayloadModel } from './makeAnOrder';

export interface DeleteOrderPayloadModel {
  success: boolean;
  message: string;
}

export interface DeleteOrderInputInterface {
  orderId: string;
}

export async function deleteOrder({
  context,
  input,
}: DaoPropsInterface<DeleteOrderInputInterface>): Promise<DeleteOrderPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const ordersCollection = collections.ordersCollection();
  const orderProductsCollection = collections.ordersProductsCollection();
  const orderLogsCollection = collections.ordersLogsCollection();
  const ordersCustomersCollection = collections.ordersCustomersCollection();

  const session = collections.client.startSession();

  let payload: MakeAnOrderPayloadModel = {
    success: false,
    message: await getApiMessage('orders.deleteOrder.error'),
  };

  try {
    await session.withTransaction(async () => {
      // check input
      if (!input || !input.orderId) {
        await session.abortTransaction();
        return;
      }
      const orderId = new ObjectId(input.orderId);

      // Permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'deleteOrder',
      });
      if (!allow) {
        payload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      // check order availability
      const order = await ordersCollection.findOne({
        _id: orderId,
      });
      if (!order) {
        payload = {
          success: false,
          message: await getApiMessage('orders.deleteOrder.notFound'),
        };
        await session.abortTransaction();
        return;
      }

      // delete order products
      const removedOrderProductsResult = await orderProductsCollection.deleteMany({
        orderId,
      });
      if (!removedOrderProductsResult.acknowledged) {
        payload = {
          success: false,
          message: await getApiMessage('orders.deleteOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      // delete order customer
      const removedOrderCustomerResult = await ordersCustomersCollection.findOneAndDelete({
        orderId,
      });
      if (!removedOrderCustomerResult.ok) {
        payload = {
          success: false,
          message: await getApiMessage('orders.deleteOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      // delete order logs
      const removedOrderLogsResult = await orderLogsCollection.deleteMany({
        orderId,
      });
      if (!removedOrderLogsResult.acknowledged) {
        payload = {
          success: false,
          message: await getApiMessage('orders.deleteOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      // delete order
      const removedOrderResult = await ordersCollection.findOneAndDelete({
        _id: orderId,
      });
      if (!removedOrderResult.ok) {
        payload = {
          success: false,
          message: await getApiMessage('orders.deleteOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      // success
      payload = {
        success: true,
        message: await getApiMessage('orders.deleteOrder.success'),
      };
    });

    // send success
    return payload;
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
