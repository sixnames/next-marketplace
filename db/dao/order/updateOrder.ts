import { COL_ORDER_LOGS } from 'db/collectionNames';
import { OrderLogDiffModel, OrderLogModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface, OrderInterface, OrderInterfacePayloadModel } from 'db/uiInterfaces';
import { detailedDiff } from 'deep-object-diff';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getConsoleOrder } from 'lib/orderUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { castDbData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';

export interface UpdateOrderInterface {
  order: OrderInterface;
}

export async function updateOrder({
  context,
  input,
}: DaoPropsInterface<UpdateOrderInterface>): Promise<OrderInterfacePayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const orderLogsCollection = db.collection<OrderLogModel>(COL_ORDER_LOGS);
  // const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
  // console.log(ordersCollection);

  const session = client.startSession();

  let mutationPayload: OrderInterfacePayloadModel = {
    success: false,
    message: await getApiMessage('orders.updateOrder.error'),
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
        slug: 'updateOrder',
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

      const { order } = input;

      // get prev order state
      const prevOrder = await getConsoleOrder({
        locale,
        orderId: order._id,
      });
      if (!prevOrder) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      // get diff for log
      const prevOrderState = castDbData(prevOrder.order);
      const diff = detailedDiff(prevOrderState, order) as OrderLogDiffModel;
      console.log(JSON.stringify(diff, null, 2));

      // create order log
      const orderLog: OrderLogModel = {
        _id: new ObjectId(),
        orderId: order._id,
        userId: user._id,
        diff,
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

      // success
      const nextOrderState = await getConsoleOrder({
        locale,
        orderId: order._id,
      });
      mutationPayload = {
        success: true,
        message: await getApiMessage('orders.updateOrder.success'),
        payload: nextOrderState?.order,
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('updateOrder error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
