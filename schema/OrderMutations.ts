import {
  DEFAULT_COMPANY_SLUG,
  ORDER_LOG_VARIANT_CANCEL,
  ORDER_LOG_VARIANT_CONFIRM,
  ORDER_STATUS_CANCELED,
  SORT_ASC,
} from 'config/common';
import {
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_ORDER_PRODUCTS,
  COL_ORDER_LOGS,
} from 'db/collectionNames';
import {
  MakeAnOrderPayloadModel,
  OrderLogModel,
  OrderModel,
  OrderPayloadModel,
  OrderProductModel,
  OrderStatusModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams, getSessionUser } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';

export const MakeAnOrderPayload = objectType({
  name: 'MakeAnOrderPayload',
  definition(t) {
    t.implements('Payload');
  },
});

export const OrderPayload = objectType({
  name: 'OrderPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Order',
    });
  },
});

export const MakeAnOrderInput = inputObjectType({
  name: 'MakeAnOrderInput',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.phone('phone');
    t.nonNull.email('email');
    t.nonNull.date('reservationDate');
    t.string('comment');
    t.string('companySlug', { default: DEFAULT_COMPANY_SLUG });
  },
});

export const ConfirmOrderInput = inputObjectType({
  name: 'ConfirmOrderInput',
  definition(t) {
    t.nonNull.objectId('orderId');
  },
});

export const CancelOrderInput = inputObjectType({
  name: 'CancelOrderInput',
  definition(t) {
    t.nonNull.objectId('orderId');
  },
});

// Order Mutations
export const OrderMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should confirm order
    t.nonNull.field('confirmOrder', {
      type: 'MakeAnOrderPayload',
      description: 'Should confirm order',
      args: {
        input: nonNull(
          arg({
            type: 'ConfirmOrderInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OrderPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
        const orderLogsCollection = db.collection<OrderLogModel>(COL_ORDER_LOGS);
        const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);
        const orderProductsCollection = db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);

        const session = client.startSession();

        let mutationPayload: MakeAnOrderPayloadModel = {
          success: false,
          message: await getApiMessage('orders.makeAnOrder.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
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

            const { input } = args;
            const sessionUser = await getSessionUser(context);
            if (!sessionUser) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('orders.updateOrder.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Get order
            const order = await ordersCollection.findOne({
              _id: input.orderId,
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
              userId: sessionUser._id,
              prevStatusId: order.statusId,
              statusId: orderNextStatus._id,
              variant: ORDER_LOG_VARIANT_CONFIRM,
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

            // Update order products
            const updatedOrderProductsResult = await orderProductsCollection.updateMany(
              {
                orderId: order._id,
              },
              {
                $set: {
                  statusId: orderNextStatus._id,
                },
              },
            );
            if (!updatedOrderProductsResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('orders.updateOrder.error'),
              };
              await session.abortTransaction();
              return;
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
      },
    });

    // Should cancel order
    t.nonNull.field('cancelOrder', {
      type: 'MakeAnOrderPayload',
      description: 'Should cancel order',
      args: {
        input: nonNull(
          arg({
            type: 'CancelOrderInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OrderPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
        const orderLogsCollection = db.collection<OrderLogModel>(COL_ORDER_LOGS);
        const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);
        const orderProductsCollection = db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);

        const session = client.startSession();

        let mutationPayload: MakeAnOrderPayloadModel = {
          success: false,
          message: await getApiMessage('orders.makeAnOrder.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
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

            const { input } = args;
            const sessionUser = await getSessionUser(context);
            if (!sessionUser) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('orders.updateOrder.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Get order
            const order = await ordersCollection.findOne({
              _id: input.orderId,
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
            const orderNextStatus = orderStatusesList.find(({ slug }) => {
              return slug === ORDER_STATUS_CANCELED;
            });
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
              userId: sessionUser._id,
              prevStatusId: order.statusId,
              statusId: orderNextStatus._id,
              variant: ORDER_LOG_VARIANT_CANCEL,
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

            // Update order products
            const updatedOrderProductsResult = await orderProductsCollection.updateMany(
              {
                orderId: order._id,
              },
              {
                $set: {
                  statusId: orderNextStatus._id,
                  isCanceled: true,
                },
              },
            );
            if (!updatedOrderProductsResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('orders.updateOrder.error'),
              };
              await session.abortTransaction();
              return;
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
      },
    });
  },
});
