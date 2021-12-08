import { COL_ORDERS } from 'db/collectionNames';
import { OrderModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface, OrderInterface, OrderInterfacePayloadModel } from 'db/uiInterfaces';
import { detailedDiff } from 'deep-object-diff';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getConsoleOrder } from 'lib/orderUtils';
import { getRequestParams } from 'lib/sessionHelpers';
import { castDbData } from 'lib/ssrUtils';

export interface UpdateOrderInterface {
  order: OrderInterface;
}

export async function updateOrder({
  context,
  input,
}: DaoPropsInterface<UpdateOrderInterface>): Promise<OrderInterfacePayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
  console.log(ordersCollection);

  const session = client.startSession();

  let payload: OrderInterfacePayloadModel = {
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
      const { order } = input;

      // get prev order state
      const prevOrder = await getConsoleOrder({
        locale,
        orderId: order._id,
      });
      if (!prevOrder) {
        payload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.error'),
        };
        await session.abortTransaction();
        return;
      }
      const prevOrderState = castDbData(prevOrder);
      const diff = detailedDiff(prevOrderState, order);
      console.log('');
      console.log('>>>>>>>>>>>>>>>>');
      console.log('');
      console.log(diff);

      // success
      const nextOrderState = await getConsoleOrder({
        locale,
        orderId: order._id,
      });
      payload = {
        success: true,
        message: await getApiMessage('orders.updateOrder.success'),
        payload: nextOrderState,
      };
    });

    return payload;
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
