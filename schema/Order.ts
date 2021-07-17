import { ORDER_STATUS_PENDING } from 'config/common';
import { COL_ORDER_STATUSES, COL_ORDERS } from 'db/collectionNames';
import { OrderModel, OrderStatusModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { arg, extendType, inputObjectType, objectType } from 'nexus';

export const Order = objectType({
  name: 'Order',
  definition(t) {
    t.implements('Base');
    t.implements('Timestamp');
    t.string('comment');
    t.nonNull.objectId('statusId');
  },
});

export const GetNewOrdersCounterInput = inputObjectType({
  name: 'GetNewOrdersCounterInput',
  definition(t) {
    t.objectId('companyId');
    t.objectId('shopId');
    t.objectId('customerId');
  },
});

export const OrderQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return new orders counter
    t.nonNull.field('getNewOrdersCounter', {
      type: 'Int',
      description: 'Should return new orders counter',
      args: {
        input: arg({
          type: 'GetNewOrdersCounterInput',
        }),
      },
      resolve: async (_root, args): Promise<number> => {
        const { db } = await getDatabase();
        const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
        const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);
        const companyId = args?.input?.companyId;
        const shopId = args?.input?.shopId;
        const customerId = args?.input?.customerId;

        // by company
        const companyQuery = companyId
          ? {
              companyId,
            }
          : {};

        // by shop
        const shopQuery = shopId
          ? {
              shopId,
            }
          : {};

        // by user
        const customerQuery = customerId
          ? {
              customerId: customerId,
            }
          : {};

        const pendingOrderStatus = await orderStatusesCollection.findOne({
          slug: ORDER_STATUS_PENDING,
        });

        if (!pendingOrderStatus) {
          return 0;
        }

        const counter = await ordersCollection.countDocuments({
          statusId: pendingOrderStatus._id,
          ...companyQuery,
          ...shopQuery,
          ...customerQuery,
        });

        return counter;
      },
    });
  },
});
