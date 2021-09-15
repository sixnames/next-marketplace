import { ORDER_STATUS_PENDING } from 'config/common';
import { COL_ORDER_STATUSES, COL_ORDERS } from 'db/collectionNames';
import { OrderModel, OrderStatusModel, PayloadType } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { ObjectId } from 'mongodb';

export type GetNewOrdersCounterPayload = PayloadType<number>;

export interface GetNewOrdersCounterInputInterface {
  companyId?: string | null;
  shopId?: string | null;
  customerId?: string | null;
}

export async function getNewOrdersCounter({
  input,
}: DaoPropsInterface<GetNewOrdersCounterInputInterface>): Promise<GetNewOrdersCounterPayload> {
  try {
    const { db } = await getDatabase();

    const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
    const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);
    const companyId = input?.companyId;
    const shopId = input?.shopId;
    const customerId = input?.customerId;

    // by company
    const companyQuery = companyId
      ? {
          companyId: new ObjectId(companyId),
        }
      : {};

    // by shop
    const shopQuery = shopId
      ? {
          shopId: new ObjectId(shopId),
        }
      : {};

    // by user
    const customerQuery = customerId
      ? {
          customerId: new ObjectId(customerId),
        }
      : {};

    const pendingOrderStatus = await orderStatusesCollection.findOne({
      slug: ORDER_STATUS_PENDING,
    });

    if (!pendingOrderStatus) {
      return {
        success: false,
        message: 'Initial order status not found',
      };
    }

    const counter = await ordersCollection.countDocuments({
      statusId: pendingOrderStatus._id,
      ...companyQuery,
      ...shopQuery,
      ...customerQuery,
    });

    return {
      success: true,
      message: 'Success',
      payload: counter,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
