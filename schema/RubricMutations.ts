import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_CATEGORIES,
  COL_PRODUCT_ATTRIBUTES,
  COL_RUBRICS,
} from 'db/collectionNames';
import {
  AttributeModel,
  AttributesGroupModel,
  CategoryModel,
  ProductSummaryAttributeModel,
  RubricModel,
  RubricPayloadModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import {
  addAttributesGroupToRubricSchema,
  deleteAttributesGroupFromRubricSchema,
} from 'validation/rubricSchema';

export const RubricPayload = objectType({
  name: 'RubricPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Rubric',
    });
  },
});

export const AddAttributesGroupToRubricInput = inputObjectType({
  name: 'AddAttributesGroupToRubricInput',
  definition(t) {
    t.nonNull.objectId('rubricId');
    t.nonNull.objectId('attributesGroupId');
  },
});

export const DeleteAttributesGroupFromRubricInput = inputObjectType({
  name: 'DeleteAttributesGroupFromRubricInput',
  definition(t) {
    t.nonNull.objectId('rubricId');
    t.nonNull.objectId('attributesGroupId');
  },
});

export const UpdateAttributeInRubricInput = inputObjectType({
  name: 'UpdateAttributeInRubricInput',
  definition(t) {
    t.nonNull.objectId('rubricId');
    t.nonNull.objectId('attributesGroupId');
    t.nonNull.list.nonNull.objectId('attributeIds');
  },
});

export const RubricMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should add attributes group to the rubric
    t.nonNull.field('addAttributesGroupToRubric', {
      type: 'RubricPayload',
      description: 'Should add attributes group to the rubric',
      args: {
        input: nonNull(
          arg({
            type: 'AddAttributesGroupToRubricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const attributesGroupsCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);

        const session = client.startSession();

        let mutationPayload: RubricPayloadModel = {
          success: false,
          message: await getApiMessage('rubrics.addAttributesGroup.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateRubric',
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
              schema: addAttributesGroupToRubricSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { rubricId, attributesGroupId } = input;

            // Check rubric and attributes group availability
            const attributesGroup = await attributesGroupsCollection.findOne({
              _id: attributesGroupId,
            });
            const rubric = await rubricsCollection.findOne({ _id: rubricId });
            if (!rubric || !attributesGroup) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.addAttributesGroup.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // update rubric
            const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
              { _id: rubricId },
              {
                $addToSet: {
                  attributesGroupIds: attributesGroup._id,
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedRubric = updatedRubricResult.value;
            if (!updatedRubricResult.ok || !updatedRubric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.addAttributesGroup.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('rubrics.addAttributesGroup.success'),
              payload: rubric,
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

    // Should delete attributes group from rubric
    t.nonNull.field('deleteAttributesGroupFromRubric', {
      type: 'RubricPayload',
      description: 'Should delete attributes group from rubric',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteAttributesGroupFromRubricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const attributesGroupsCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
        const productAttributesCollection =
          db.collection<ProductSummaryAttributeModel>(COL_PRODUCT_ATTRIBUTES);

        const session = client.startSession();

        let mutationPayload: RubricPayloadModel = {
          success: false,
          message: await getApiMessage('rubrics.deleteAttributesGroup.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateRubric',
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
              schema: deleteAttributesGroupFromRubricSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { rubricId, attributesGroupId } = input;

            // Check rubric and attributes group availability
            const attributesGroup = await attributesGroupsCollection.findOne({
              _id: attributesGroupId,
            });
            const rubric = await rubricsCollection.findOne({ _id: rubricId });
            if (!rubric || !attributesGroup) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.deleteAttributesGroup.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete product attributes
            const removedProductAttributesResult = await productAttributesCollection.deleteMany({
              attributesGroupId,
              rubricId: rubric._id,
            });
            if (!removedProductAttributesResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.deleteAttributesGroup.error'),
              };
              await session.abortTransaction();
              return;
            }

            // update rubric
            const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
              { _id: rubricId },
              {
                $pull: {
                  attributesGroupIds: attributesGroup._id,
                },
              },
            );
            const updatedRubric = updatedRubricResult.value;
            if (!updatedRubricResult.ok || !updatedRubric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.deleteAttributesGroup.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('rubrics.deleteAttributesGroup.success'),
              payload: updatedRubric,
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

    // Should update rubric attribute
    t.nonNull.field('updateAttributeInRubric', {
      type: 'RubricPayload',
      description: 'Should update rubric attribute',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateAttributeInRubricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const { input } = args;
          const { rubricId, attributeIds, attributesGroupId } = input;

          // permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateRubric',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          // get rubric
          const rubric = await rubricsCollection.findOne({ _id: rubricId });
          if (!rubric) {
            return {
              success: false,
              message: await getApiMessage('rubrics.update.notFound'),
            };
          }

          // get group attributes
          const groupAttributes = await attributesCollection
            .find({
              attributesGroupId,
            })
            .toArray();
          const groupAttributeIds = groupAttributes.map(({ _id }) => _id);

          // uncheck all
          if (attributeIds.length < 1) {
            const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
              { _id: rubricId },
              {
                $pullAll: {
                  filterVisibleAttributeIds: groupAttributeIds,
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedRubric = updatedRubricResult.value;
            if (!updatedRubricResult.ok || !updatedRubric) {
              return {
                success: false,
                message: await getApiMessage('rubrics.update.error'),
              };
            }
            return {
              success: true,
              message: await getApiMessage('rubrics.update.success'),
              payload: updatedRubric,
            };
          }

          // check all
          if (attributeIds.length === groupAttributeIds.length && attributeIds.length !== 1) {
            const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
              { _id: rubricId },
              {
                $addToSet: {
                  filterVisibleAttributeIds: {
                    $each: groupAttributeIds,
                  },
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedRubric = updatedRubricResult.value;
            if (!updatedRubricResult.ok || !updatedRubric) {
              return {
                success: false,
                message: await getApiMessage('rubrics.update.error'),
              };
            }
            return {
              success: true,
              message: await getApiMessage('rubrics.update.success'),
              payload: updatedRubric,
            };
          }

          // get attributes
          const rubricAttributes = groupAttributes.filter((attribute) => {
            return attributeIds.some((_id) => attribute._id.equals(_id));
          });

          let filterVisibleAttributeIds = [...(rubric.filterVisibleAttributeIds || [])];
          for await (const rubricAttribute of rubricAttributes) {
            const attributeId = rubricAttribute._id;
            const attributeExist = rubric.filterVisibleAttributeIds?.some((_id) => {
              return _id.equals(attributeId);
            });
            if (attributeExist) {
              filterVisibleAttributeIds = filterVisibleAttributeIds.filter((_id) => {
                return !_id.equals(attributeId);
              });
            } else {
              filterVisibleAttributeIds.push(attributeId);
            }
          }

          const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
            { _id: rubricId },
            {
              $set: {
                filterVisibleAttributeIds,
              },
            },
            {
              returnDocument: 'after',
            },
          );
          const updatedRubric = updatedRubricResult.value;
          if (!updatedRubricResult.ok || !updatedRubric) {
            return {
              success: false,
              message: await getApiMessage('rubrics.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('rubrics.update.success'),
            payload: updatedRubric,
          };
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should toggle cms card attribute visibility
    t.nonNull.field('toggleCmsCardAttributeInRubric', {
      type: 'RubricPayload',
      description: 'Should toggle cms card attribute visibility',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateAttributeInRubricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

        const session = client.startSession();

        let mutationPayload: RubricPayloadModel = {
          success: false,
          message: await getApiMessage('rubrics.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateRubric',
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
            const { rubricId, attributeIds, attributesGroupId } = input;

            // get rubric
            const rubric = await rubricsCollection.findOne({ _id: rubricId });
            if (!rubric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.update.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // get group attributes
            const groupAttributes = await attributesCollection
              .find({
                attributesGroupId,
              })
              .toArray();
            const groupAttributeIds = groupAttributes.map(({ _id }) => _id);

            // uncheck all
            if (attributeIds.length < 1) {
              const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
                { _id: rubricId },
                {
                  $pullAll: {
                    cmsCardAttributeIds: groupAttributeIds,
                  },
                },
                {
                  returnDocument: 'after',
                },
              );
              const updatedCategoriesResult = await categoriesCollection.updateMany(
                {
                  rubricId: rubric._id,
                },
                {
                  $pullAll: {
                    cmsCardAttributeIds: groupAttributeIds,
                  },
                },
              );
              const updatedRubric = updatedRubricResult.value;
              if (
                !updatedRubricResult.ok ||
                !updatedCategoriesResult.acknowledged ||
                !updatedRubric
              ) {
                mutationPayload = {
                  success: false,
                  message: await getApiMessage('rubrics.update.error'),
                };
                await session.abortTransaction();
                return;
              }
              mutationPayload = {
                success: true,
                message: await getApiMessage('rubrics.update.success'),
              };
              await session.abortTransaction();
              return;
            }

            // check all
            if (attributeIds.length === groupAttributeIds.length && attributeIds.length !== 1) {
              const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
                { _id: rubricId },
                {
                  $addToSet: {
                    cmsCardAttributeIds: {
                      $each: groupAttributeIds,
                    },
                  },
                },
                {
                  returnDocument: 'after',
                },
              );
              const updatedCategoriesResult = await categoriesCollection.updateMany(
                {
                  rubricId: rubric._id,
                },
                {
                  $addToSet: {
                    cmsCardAttributeIds: {
                      $each: groupAttributeIds,
                    },
                  },
                },
              );
              const updatedRubric = updatedRubricResult.value;
              if (
                !updatedRubricResult.ok ||
                !updatedCategoriesResult.acknowledged ||
                !updatedRubric
              ) {
                mutationPayload = {
                  success: false,
                  message: await getApiMessage('rubrics.update.error'),
                };
                await session.abortTransaction();
                return;
              }
              mutationPayload = {
                success: true,
                message: await getApiMessage('rubrics.update.success'),
              };
              await session.abortTransaction();
              return;
            }

            // get attributes
            const rubricAttributes = groupAttributes.filter((attribute) => {
              return attributeIds.some((_id) => attribute._id.equals(_id));
            });

            let cmsCardAttributeIds = [...(rubric.cmsCardAttributeIds || [])];
            for await (const rubricAttribute of rubricAttributes) {
              const attributeId = rubricAttribute._id;
              const attributeExist = rubric.cmsCardAttributeIds?.some((_id) => {
                return _id.equals(attributeId);
              });
              if (attributeExist) {
                cmsCardAttributeIds = cmsCardAttributeIds.filter((_id) => {
                  return !_id.equals(attributeId);
                });
              } else {
                cmsCardAttributeIds.push(attributeId);
              }
            }

            const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
              { _id: rubricId },
              {
                $set: {
                  cmsCardAttributeIds,
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedCategoriesResult = await categoriesCollection.updateMany(
              {
                rubricId: rubric._id,
              },
              {
                $set: {
                  cmsCardAttributeIds,
                },
              },
            );
            const updatedRubric = updatedRubricResult.value;
            if (
              !updatedRubricResult.ok ||
              !updatedRubric ||
              !updatedCategoriesResult.acknowledged
            ) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('rubrics.update.success'),
              payload: updatedRubric,
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
