import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { ObjectId } from 'mongodb';
import { PayloadType } from '../../dbModels';
import { getDbCollections } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

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
    const collections = await getDbCollections();

    const ordersCollection = collections.ordersCollection();
    const orderStatusesCollection = collections.orderStatusesCollection();
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
      isNew: true,
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
