import { COL_ORDER_STATUSES } from 'db/collectionNames';
import { OrderStatusModel, OrderStatusPayloadModel } from 'db/dbModels';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
import { getDatabase } from 'db/mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { createOrderStatusSchema, updateOrderStatusSchema } from 'validation/orderStatusSchema';

export const OrderStatus = objectType({
  name: 'OrderStatus',
  definition(t) {
    t.nonNull.objectId('_id');
    t.implements('Timestamp');
    t.nonNull.string('slug');
    t.nonNull.json('nameI18n');
    t.nonNull.string('color');
    t.nonNull.int('index');

    // OrderStatus name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });
  },
});

export const OrderStatusPayload = objectType({
  name: 'OrderStatusPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'OrderStatus',
    });
  },
});

export const CreateOrderStatusInput = inputObjectType({
  name: 'CreateOrderStatusInput',
  definition(t) {
    t.nonNull.json('nameI18n');
    t.nonNull.string('color');
    t.nonNull.int('index');
    t.nonNull.boolean('isNew');
    t.nonNull.boolean('isConfirmed');
    t.nonNull.boolean('isPayed');
    t.nonNull.boolean('isDone');
    t.nonNull.boolean('isCanceled');
  },
});

export const UpdateOrderStatusInput = inputObjectType({
  name: 'UpdateOrderStatusInput',
  definition(t) {
    t.nonNull.objectId('orderStatusId');
    t.nonNull.json('nameI18n');
    t.nonNull.string('color');
    t.nonNull.int('index');
    t.nonNull.boolean('isNew');
    t.nonNull.boolean('isConfirmed');
    t.nonNull.boolean('isPayed');
    t.nonNull.boolean('isDone');
    t.nonNull.boolean('isCanceled');
  },
});

// OrderStatus Mutations
export const OrderStatusMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create order status
    t.nonNull.field('createOrderStatus', {
      description: 'Should create order status',
      type: 'OrderStatusPayload',
      args: {
        input: nonNull(
          arg({
            type: 'CreateOrderStatusInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OrderStatusPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createOrderStatus',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createOrderStatusSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);
          const { input } = args;

          // Check if order status is already exist
          const exist = await findDocumentByI18nField({
            fieldName: 'nameI18n',
            collectionName: COL_ORDER_STATUSES,
            fieldArg: input.nameI18n,
            additionalOrQuery: [
              {
                index: input.index,
              },
            ],
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('orderStatuses.create.duplicate'),
            };
          }

          // Create order status
          const slug = generateDefaultLangSlug(input.nameI18n);
          const createdOrderStatusResult = await orderStatusesCollection.insertOne({
            ...input,
            slug,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          const createdOrderStatus = createdOrderStatusResult.ops[0];
          if (!createdOrderStatusResult.result.ok || !createdOrderStatus) {
            return {
              success: false,
              message: await getApiMessage('orderStatuses.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('orderStatuses.create.success'),
            payload: createdOrderStatus,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update order status
    t.nonNull.field('updateOrderStatus', {
      description: 'Should update order status',
      type: 'OrderStatusPayload',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateOrderStatusInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OrderStatusPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);

        const session = client.startSession();

        let mutationPayload: OrderStatusPayloadModel = {
          success: false,
          message: await getApiMessage('orderStatuses.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateOrderStatus',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            // Validate
            const validationSchema = await getResolverValidationSchema({
              context,
              schema: updateOrderStatusSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { orderStatusId, ...values } = input;

            // Check order status availability
            const orderStatus = await orderStatusesCollection.findOne({ _id: orderStatusId });
            if (!orderStatus) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('orderStatuses.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Check if order status is already exist
            const exist = await findDocumentByI18nField({
              fieldName: 'nameI18n',
              collectionName: COL_ORDER_STATUSES,
              fieldArg: input.nameI18n,
              additionalQuery: { _id: { $ne: orderStatusId } },
              additionalOrQuery: [
                {
                  index: input.index,
                },
              ],
            });
            if (exist) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('orderStatuses.update.duplicate'),
              };
              await session.abortTransaction();
              return;
            }

            // Update order status
            const updatedOrderStatusResult = await orderStatusesCollection.findOneAndUpdate(
              { _id: orderStatusId },
              {
                $set: {
                  ...values,
                  updatedAt: new Date(),
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedOrderStatus = updatedOrderStatusResult.value;
            if (!updatedOrderStatusResult.ok || !updatedOrderStatus) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('orderStatuses.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('orderStatuses.update.success'),
              payload: updatedOrderStatus,
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

    // Should delete order status
    t.nonNull.field('deleteOrderStatus', {
      description: 'Should delete order status',
      type: 'OrderStatusPayload',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OrderStatusPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deleteOrderStatus',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);
          const { _id } = args;

          // Check order status availability
          const orderStatus = await orderStatusesCollection.findOne({ _id });
          if (!orderStatus) {
            return {
              success: false,
              message: await getApiMessage('orderStatuses.delete.error'),
            };
          }

          // Delete order status
          const removedOrderStatusResult = await orderStatusesCollection.findOneAndDelete({ _id });
          if (!removedOrderStatusResult.ok) {
            return {
              success: false,
              message: await getApiMessage('orderStatuses.delete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('orderStatuses.delete.success'),
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });
  },
});
