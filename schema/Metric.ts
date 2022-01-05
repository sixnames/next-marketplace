import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { SORT_ASC } from '../config/common';
import { COL_ATTRIBUTES, COL_METRICS, COL_PRODUCT_ATTRIBUTES } from '../db/collectionNames';
import { findDocumentByI18nField } from '../db/dao/findDocumentByI18nField';
import {
  AttributeModel,
  MetricModel,
  MetricPayloadModel,
  ProductSummaryAttributeModel,
} from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../lib/sessionHelpers';
import { createMetricSchema, updateMetricSchema } from '../validation/metricSchema';

export const Metric = objectType({
  name: 'Metric',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');

    // Metric name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });
  },
});

// Metric Queries
export const MetricQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return all metrics list
    t.nonNull.list.nonNull.field('getAllMetricsOptions', {
      type: 'Metric',
      description: 'Should return all metrics list',
      resolve: async (): Promise<MetricModel[]> => {
        const { db } = await getDatabase();
        const metricsCollection = db.collection<MetricModel>(COL_METRICS);
        const metrics = await metricsCollection.find({}, { sort: { itemId: SORT_ASC } }).toArray();
        return metrics;
      },
    });
  },
});

export const MetricPayload = objectType({
  name: 'MetricPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Metric',
    });
  },
});

export const CreateMetricInput = inputObjectType({
  name: 'CreateMetricInput',
  definition(t) {
    t.nonNull.json('nameI18n');
  },
});

export const UpdateMetricInput = inputObjectType({
  name: 'UpdateMetricInput',
  definition(t) {
    t.nonNull.objectId('metricId');
    t.nonNull.json('nameI18n');
  },
});

// Metric Mutations
export const MetricMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create metric
    t.nonNull.field('createMetric', {
      description: 'Should create metric',
      type: 'MetricPayload',
      args: {
        input: nonNull(
          arg({
            type: 'CreateMetricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<MetricPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createMetric',
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
            schema: createMetricSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const metricsCollection = db.collection<MetricModel>(COL_METRICS);
          const { input } = args;

          // Check if metric is already exist
          const exist = await findDocumentByI18nField({
            fieldName: 'nameI18n',
            collectionName: COL_METRICS,
            fieldArg: input.nameI18n,
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('metrics.create.duplicate'),
            };
          }

          // Create metric
          const createdMetricResult = await metricsCollection.insertOne({
            ...input,
          });
          if (!createdMetricResult.acknowledged) {
            return {
              success: false,
              message: await getApiMessage('metrics.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('metrics.create.success'),
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update metric
    t.nonNull.field('updateMetric', {
      description: 'Should update metric',
      type: 'MetricPayload',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateMetricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<MetricPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const metricsCollection = db.collection<MetricModel>(COL_METRICS);
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
        const productAttributesCollection =
          db.collection<ProductSummaryAttributeModel>(COL_PRODUCT_ATTRIBUTES);

        const session = client.startSession();

        let mutationPayload: MetricPayloadModel = {
          success: false,
          message: await getApiMessage('metrics.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateMetric',
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
              schema: updateMetricSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { metricId, ...values } = input;

            // Check metric availability
            const metric = await metricsCollection.findOne({ _id: metricId });
            if (!metric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('metrics.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Check if metric is already exist
            const exist = await findDocumentByI18nField({
              fieldName: 'nameI18n',
              collectionName: COL_METRICS,
              fieldArg: input.nameI18n,
              additionalQuery: { _id: { $ne: metricId } },
            });
            if (exist) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('metrics.update.duplicate'),
              };
              await session.abortTransaction();
              return;
            }

            // Update metric
            const updatedMetricResult = await metricsCollection.findOneAndUpdate(
              { _id: metricId },
              {
                $set: {
                  ...values,
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedMetric = updatedMetricResult.value;
            if (!updatedMetricResult.ok || !updatedMetric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('metrics.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Update attributes metric
            const updatedAttributesResult = await attributesCollection.updateMany(
              { 'metric._id': metricId },
              {
                $set: {
                  metric: updatedMetric,
                },
              },
            );

            // Update product attributes metric
            const updatedProductAttributesResult = await productAttributesCollection.updateMany(
              { 'metric._id': metricId },
              {
                $set: {
                  metric: updatedMetric,
                },
              },
            );
            if (
              !updatedAttributesResult.acknowledged ||
              !updatedProductAttributesResult.acknowledged
            ) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('metrics.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('metrics.update.success'),
              payload: updatedMetric,
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

    // Should delete metric
    t.nonNull.field('deleteMetric', {
      description: 'Should delete metric',
      type: 'MetricPayload',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<MetricPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deleteMetric',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const metricsCollection = db.collection<MetricModel>(COL_METRICS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const { _id } = args;

          // Check metric availability
          const metric = await metricsCollection.findOne({ _id });
          if (!metric) {
            return {
              success: false,
              message: await getApiMessage('metrics.delete.error'),
            };
          }

          // Check if metric is used in attributes
          const used = await attributesCollection.findOne({ 'metric._id': _id });
          if (used) {
            return {
              success: false,
              message: await getApiMessage('metrics.delete.used'),
            };
          }

          // Delete metric
          const updatedMetricResult = await metricsCollection.findOneAndDelete({ _id });
          if (!updatedMetricResult.ok) {
            return {
              success: false,
              message: await getApiMessage('metrics.delete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('metrics.delete.success'),
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
