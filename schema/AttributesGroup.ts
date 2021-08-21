import { SORT_ASC } from 'config/common';
import { castAttributeForRubric } from 'lib/optionsUtils';
import { arg, extendType, inputObjectType, list, nonNull, objectType } from 'nexus';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import {
  AttributeModel,
  AttributesGroupModel,
  AttributesGroupPayloadModel,
  CategoryModel,
  MetricModel,
  ProductAttributeModel,
  ProductConnectionModel,
  RubricAttributeModel,
  RubricModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_CATEGORIES,
  COL_METRICS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTIONS,
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRICS,
} from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import {
  addAttributeToGroupSchema,
  createAttributesGroupSchema,
  deleteAttributeFromGroupSchema,
  updateAttributeInGroupSchema,
  updateAttributesGroupSchema,
} from 'validation/attributesGroupSchema';

export const AttributesGroup = objectType({
  name: 'AttributesGroup',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.list.nonNull.objectId('attributesIds');

    // AttributesGroup name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // AttributesGroup attributes list field resolver
    t.nonNull.list.nonNull.field('attributes', {
      type: 'Attribute',
      resolve: async (source): Promise<AttributeModel[]> => {
        const { db } = await getDatabase();
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
        const attributes = await attributesCollection
          .find({ _id: { $in: source.attributesIds } })
          .toArray();
        return attributes;
      },
    });
  },
});

// AttributesGroup queries
export const AttributesGroupQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return attributes group by given _id
    t.nonNull.field('getAttributesGroup', {
      type: 'AttributesGroup',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args): Promise<AttributesGroupModel> => {
        const { db } = await getDatabase();
        const attributesGroupCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
        const attributesGroup = await attributesGroupCollection.findOne({ _id: args._id });

        if (!attributesGroup) {
          throw Error('AttributesGroup not found in getAttributesGroup');
        }

        return attributesGroup;
      },
    });

    // Should return attributes groups list
    t.nonNull.list.nonNull.field('getAllAttributesGroups', {
      type: 'AttributesGroup',
      args: {
        excludedIds: arg({
          type: list(nonNull('ObjectId')),
          default: [],
        }),
      },
      resolve: async (_root, args): Promise<AttributesGroupModel[]> => {
        const { db } = await getDatabase();
        const attributesGroupCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
        const attributesGroup = await attributesGroupCollection
          .find(
            { _id: { $nin: args.excludedIds || [] } },
            {
              sort: {
                itemId: SORT_ASC,
              },
            },
          )
          .toArray();
        return attributesGroup;
      },
    });
  },
});

export const AttributesGroupPayload = objectType({
  name: 'AttributesGroupPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'AttributesGroup',
    });
  },
});

export const CreateAttributesGroupInput = inputObjectType({
  name: 'CreateAttributesGroupInput',
  definition(t) {
    t.nonNull.json('nameI18n');
  },
});

export const UpdateAttributesGroupInput = inputObjectType({
  name: 'UpdateAttributesGroupInput',
  definition(t) {
    t.nonNull.objectId('attributesGroupId');
    t.nonNull.json('nameI18n');
  },
});

export const AddAttributeToGroupInput = inputObjectType({
  name: 'AddAttributeToGroupInput',
  definition(t) {
    t.nonNull.objectId('attributesGroupId');
    t.nonNull.json('nameI18n');
    t.objectId('optionsGroupId');
    t.objectId('metricId');
    t.boolean('capitalise');
    t.boolean('notShowAsAlphabet');
    t.boolean('showNameInTitle');
    t.boolean('showNameInSelectedAttributes');
    t.boolean('showNameInSnippetTitle');
    t.nonNull.boolean('showAsBreadcrumb');
    t.nonNull.boolean('showAsCatalogueBreadcrumb');
    t.nonNull.boolean('showInSnippet');
    t.nonNull.boolean('showInCard');
    t.json('positioningInTitle');
    t.nonNull.field('variant', {
      type: 'AttributeVariant',
    });
    t.nonNull.field('viewVariant', {
      type: 'AttributeViewVariant',
    });
  },
});

export const UpdateAttributeInGroupInput = inputObjectType({
  name: 'UpdateAttributeInGroupInput',
  definition(t) {
    t.nonNull.objectId('attributesGroupId');
    t.nonNull.objectId('attributeId');
    t.nonNull.json('nameI18n');
    t.objectId('optionsGroupId');
    t.objectId('metricId');
    t.boolean('capitalise');
    t.boolean('notShowAsAlphabet');
    t.boolean('showNameInTitle');
    t.boolean('showNameInSelectedAttributes');
    t.boolean('showNameInSnippetTitle');
    t.nonNull.boolean('showAsBreadcrumb');
    t.nonNull.boolean('showAsCatalogueBreadcrumb');
    t.nonNull.boolean('showInSnippet');
    t.nonNull.boolean('showInCard');
    t.json('positioningInTitle');
    t.nonNull.field('variant', {
      type: 'AttributeVariant',
    });
    t.nonNull.field('viewVariant', {
      type: 'AttributeViewVariant',
    });
  },
});

export const DeleteAttributeFromGroupInput = inputObjectType({
  name: 'DeleteAttributeFromGroupInput',
  definition(t) {
    t.nonNull.objectId('attributesGroupId');
    t.nonNull.objectId('attributeId');
  },
});

// AttributesGroup mutations
export const attributesGroupMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create attributes group
    t.nonNull.field('createAttributesGroup', {
      type: 'AttributesGroupPayload',
      description: 'Should create attributes group',
      args: {
        input: nonNull(
          arg({
            type: 'CreateAttributesGroupInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<AttributesGroupPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createAttributesGroup',
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
            schema: createAttributesGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const attributesGroupCollection =
            db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);

          // Check if attributes group exist
          const exist = await findDocumentByI18nField<AttributesGroupModel>({
            collectionName: COL_ATTRIBUTES_GROUPS,
            fieldName: 'nameI18n',
            fieldArg: args.input.nameI18n,
          });

          if (exist) {
            return {
              success: false,
              message: await getApiMessage('attributesGroups.create.duplicate'),
            };
          }

          // Create attributes group
          const createdAttributesGroup = await attributesGroupCollection.insertOne({
            ...args.input,
            attributesIds: [],
          });

          const attributesGroup = createdAttributesGroup.ops[0];
          if (!createdAttributesGroup.result.ok || !attributesGroup) {
            return {
              success: false,
              message: await getApiMessage('attributesGroups.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('attributesGroups.create.success'),
            payload: attributesGroup,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update attributes group
    t.nonNull.field('updateAttributesGroup', {
      type: 'AttributesGroupPayload',
      description: 'Should update attributes group',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateAttributesGroupInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<AttributesGroupPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateAttributesGroup',
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
            schema: updateAttributesGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const attributesGroupCollection =
            db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);

          // Check if attributes group exist
          const exist = await findDocumentByI18nField<AttributesGroupModel>({
            collectionName: COL_ATTRIBUTES_GROUPS,
            fieldName: 'nameI18n',
            fieldArg: args.input.nameI18n,
            additionalQuery: {
              _id: { $ne: args.input.attributesGroupId },
            },
          });

          if (exist) {
            return {
              success: false,
              message: await getApiMessage('attributesGroups.update.duplicate'),
            };
          }

          // Update attributes group
          const updatedAttributesGroupResult = await attributesGroupCollection.findOneAndUpdate(
            {
              _id: args.input.attributesGroupId,
            },
            {
              $set: {
                nameI18n: args.input.nameI18n,
              },
            },
            {
              returnDocument: 'after',
            },
          );

          const updatedAttributesGroup = updatedAttributesGroupResult.value;
          if (!updatedAttributesGroupResult.ok || !updatedAttributesGroup) {
            return {
              success: false,
              message: await getApiMessage('attributesGroups.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('attributesGroups.update.success'),
            payload: updatedAttributesGroup,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete attributes group
    t.nonNull.field('deleteAttributesGroup', {
      type: 'AttributesGroupPayload',
      description: 'Should delete attributes group',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<AttributesGroupPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const attributesGroupCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
        const rubricAttributesCollection =
          db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
        const productAttributesCollection =
          db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
        const productConnectionsCollection =
          db.collection<ProductConnectionModel>(COL_PRODUCT_CONNECTIONS);

        const session = client.startSession();

        let mutationPayload: AttributesGroupPayloadModel | null = {
          success: false,
          message: await getApiMessage(`attributesGroups.delete.error`),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'deleteAttributesGroup',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            // Check if attributes group exist
            const group = await attributesGroupCollection.findOne({ _id: args._id });
            if (!group) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.delete.notFound`),
              };
              await session.abortTransaction();
              return;
            }

            // Check if group attributes is used in product connections and in product attributes
            const usedInProductAttributes = await productAttributesCollection.findOne({
              attributeId: {
                $in: group.attributesIds,
              },
            });
            const usedInProductCollections = await productConnectionsCollection.findOne({
              attributeId: {
                $in: group.attributesIds,
              },
            });
            if (usedInProductAttributes || usedInProductCollections) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.delete.used`),
              };
              await session.abortTransaction();
              return;
            }

            // Check if used in rubrics
            const usedInRubricAttributes = await rubricAttributesCollection.findOne({
              _id: {
                $in: group.attributesIds,
              },
            });
            if (usedInRubricAttributes) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.delete.used`),
              };
              await session.abortTransaction();
              return;
            }

            // Delete all nested attributes
            const removedAttributes = await attributesCollection.deleteMany({
              _id: { $in: group.attributesIds },
            });
            if (!removedAttributes.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.delete.attributesError`),
              };
              await session.abortTransaction();
              return;
            }

            // Delete attributes group
            const removedGroup = await attributesGroupCollection.findOneAndDelete({
              _id: group._id,
            });
            if (!removedGroup.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.delete.error`),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('attributesGroups.delete.success'),
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

    // Should create attribute and add it to the attributes group
    t.nonNull.field('addAttributeToGroup', {
      type: 'AttributesGroupPayload',
      description: 'Should create attribute and add it to the attributes group',
      args: {
        input: nonNull(
          arg({
            type: 'AddAttributeToGroupInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<AttributesGroupPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const attributesGroupCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
        const metricsCollection = db.collection<MetricModel>(COL_METRICS);
        const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const rubricAttributesCollection =
          db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);

        const session = client.startSession();

        let mutationPayload: AttributesGroupPayloadModel = {
          success: false,
          message: await getApiMessage('attributesGroups.addAttribute.success'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'createAttribute',
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
              schema: addAttributeToGroupSchema,
            });
            await validationSchema.validate(args.input);

            const {
              input: { attributesGroupId, metricId, ...values },
            } = args;

            // Check if attributes group exist
            const attributesGroup = await attributesGroupCollection.findOne({
              _id: attributesGroupId,
            });
            if (!attributesGroup) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.addAttribute.groupError`),
              };
              await session.abortTransaction();
              return;
            }

            // Check if attribute already exist in the group
            const exist = await findDocumentByI18nField({
              fieldArg: values.nameI18n,
              collectionName: COL_ATTRIBUTES,
              fieldName: 'nameI18n',
              additionalQuery: {
                _id: { $in: attributesGroup.attributesIds },
              },
            });
            if (exist) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.addAttribute.duplicate`),
              };
              await session.abortTransaction();
              return;
            }

            // Get metric
            let metric = null;
            if (metricId) {
              metric = await metricsCollection.findOne({ _id: metricId });
            }

            // Create attribute
            const slug = generateDefaultLangSlug(values.nameI18n);
            const createdAttributeResult = await attributesCollection.insertOne({
              ...values,
              slug,
              metric,
              showAsBreadcrumb: false,
              showInCard: true,
              attributesGroupId,
            });
            const createdAttribute = createdAttributeResult.ops[0];
            if (!createdAttributeResult.result.ok || !createdAttribute) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.addAttribute.attributeError`),
              };
              await session.abortTransaction();
              return;
            }

            // Add attribute _id to the attributes group
            const updatedGroupResult = await attributesGroupCollection.findOneAndUpdate(
              { _id: attributesGroup._id },
              {
                $push: {
                  attributesIds: createdAttribute._id,
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedGroup = updatedGroupResult.value;
            if (!updatedGroupResult.ok || !updatedGroup) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.addAttribute.groupError`),
              };
              await session.abortTransaction();
              return;
            }

            // Add new attribute to the rubrics
            const rubrics = await rubricsCollection
              .find({
                attributesGroupsIds: attributesGroupId,
              })
              .toArray();
            if (rubrics.length > 0) {
              const rubricAttributes: RubricAttributeModel[] = [];
              for await (const rubric of rubrics) {
                const rubricAttribute = await castAttributeForRubric({
                  attribute: createdAttribute,
                  rubricSlug: rubric.slug,
                  rubricId: rubric._id,
                });
                rubricAttributes.push(rubricAttribute);
              }

              const createdAttributesResult = await rubricAttributesCollection.insertMany(
                rubricAttributes,
              );
              if (!createdAttributesResult.result.ok) {
                mutationPayload = {
                  success: false,
                  message: await getApiMessage('attributesGroups.addAttribute.attributeError'),
                };
                await session.abortTransaction();
                return;
              }
            }

            // Add new attribute to the categories
            const categories = await categoriesCollection
              .find({
                attributesGroupsIds: attributesGroupId,
              })
              .toArray();
            if (categories.length > 0) {
              const rubricAttributes: RubricAttributeModel[] = [];
              for await (const category of categories) {
                const categoryAttribute = await castAttributeForRubric({
                  attribute: createdAttribute,
                  rubricSlug: category.rubricSlug,
                  rubricId: category.rubricId,
                  categorySlug: category.slug,
                  categoryId: category._id,
                });
                rubricAttributes.push(categoryAttribute);
              }

              const createdAttributesResult = await rubricAttributesCollection.insertMany(
                rubricAttributes,
              );
              if (!createdAttributesResult.result.ok) {
                mutationPayload = {
                  success: false,
                  message: await getApiMessage('attributesGroups.addAttribute.attributeError'),
                };
                await session.abortTransaction();
                return;
              }
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('attributesGroups.addAttribute.success'),
              payload: updatedGroup,
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

    // Should update attribute in the attributes group
    t.nonNull.field('updateAttributeInGroup', {
      type: 'AttributesGroupPayload',
      description: 'Should update attribute in the attributes group',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateAttributeInGroupInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<AttributesGroupPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const attributesGroupCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
        const metricsCollection = db.collection<MetricModel>(COL_METRICS);
        const rubricAttributesCollection =
          db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
        const productAttributesCollection =
          db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);

        const session = client.startSession();

        let mutationPayload: AttributesGroupPayloadModel = {
          success: false,
          message: await getApiMessage(`attributesGroups.updateAttribute.updateError`),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateAttribute',
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
              schema: updateAttributeInGroupSchema,
            });
            await validationSchema.validate(args.input);

            const {
              input: { attributesGroupId, attributeId, metricId, ...values },
            } = args;

            // Check attributes group availability
            const group = await attributesGroupCollection.findOne({
              _id: attributesGroupId,
            });
            if (!group) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.updateAttribute.groupError`),
              };
              await session.abortTransaction();
              return;
            }

            // Check attribute availability
            const attribute = await attributesCollection.findOne({
              _id: attributeId,
            });
            if (!attribute) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.updateAttribute.groupError`),
              };
              await session.abortTransaction();
              return;
            }

            // Check if attribute exist
            const exist = await findDocumentByI18nField({
              fieldArg: values.nameI18n,
              collectionName: COL_ATTRIBUTES,
              fieldName: 'nameI18n',
              additionalQuery: {
                $and: [{ _id: { $in: group.attributesIds } }, { _id: { $ne: attributeId } }],
              },
            });
            if (exist) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.updateAttribute.duplicate`),
              };
              await session.abortTransaction();
              return;
            }

            // Get metric
            let metric = null;
            if (metricId) {
              metric = await metricsCollection.findOne({ _id: metricId });
            }

            // Update attribute
            const updatedAttributeResult = await attributesCollection.findOneAndUpdate(
              { _id: attributeId },
              {
                $set: {
                  ...values,
                  metric,
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedAttribute = updatedAttributeResult.value;
            if (!updatedAttributeResult.ok || !updatedAttribute) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.updateAttribute.updateError`),
              };
              await session.abortTransaction();
              return;
            }

            // Update rubric attribute
            const updatedRubricAttributeResult = await rubricAttributesCollection.updateMany(
              { attributeId },
              {
                $set: {
                  ...values,
                  metric,
                },
              },
            );
            if (!updatedRubricAttributeResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.updateAttribute.updateError`),
              };
              await session.abortTransaction();
              return;
            }

            // Update product attribute
            const updatedProductAttributeResult = await productAttributesCollection.updateMany(
              { attributeId },
              {
                $set: {
                  ...values,
                  metric,
                },
              },
            );
            if (!updatedProductAttributeResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.updateAttribute.updateError`),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('attributesGroups.updateAttribute.success'),
              payload: group,
            };
          });

          return mutationPayload;
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        } finally {
          session.endSession();
        }
      },
    });

    // Should delete attribute from the attributes group
    t.nonNull.field('deleteAttributeFromGroup', {
      type: 'AttributesGroupPayload',
      description: 'Should delete attribute from the attributes group',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteAttributeFromGroupInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<AttributesGroupPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const rubricAttributesCollection =
          db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
        const productAttributesCollection =
          db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
        const attributesGroupCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

        const session = client.startSession();

        let mutationPayload: AttributesGroupPayloadModel = {
          success: false,
          message: await getApiMessage(`attributesGroups.deleteAttribute.deleteError`),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'deleteAttribute',
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
              schema: deleteAttributeFromGroupSchema,
            });
            await validationSchema.validate(args.input);

            const {
              input: { attributesGroupId, attributeId },
            } = args;

            // Check if attributes group exist
            const attributesGroup = await attributesGroupCollection.findOne({
              _id: attributesGroupId,
            });
            if (!attributesGroup) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.updateAttribute.groupError`),
              };
              await session.abortTransaction();
              return;
            }

            // Delete attribute form rubrics and products
            const removedRubricAttributes = await rubricAttributesCollection.deleteMany({
              attributeId,
            });
            const removedProductAttributes = await productAttributesCollection.deleteMany({
              attributeId,
            });
            if (!removedRubricAttributes.result.ok || !removedProductAttributes.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.deleteAttribute.deleteError`),
              };
              await session.abortTransaction();
              return;
            }

            // Remove attribute
            const removedAttributeResult = await attributesCollection.findOneAndDelete({
              _id: attributeId,
            });
            if (!removedAttributeResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.deleteAttribute.deleteError`),
              };
              await session.abortTransaction();
              return;
            }

            // Remove attribute _id from attributes group
            const updatedGroupResult = await attributesGroupCollection.findOneAndUpdate(
              { _id: attributesGroup._id },
              {
                $pull: {
                  attributesIds: attributeId,
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedGroup = updatedGroupResult.value;
            if (!updatedGroupResult.ok || !updatedGroup) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`attributesGroups.deleteAttribute.deleteError`),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('attributesGroups.deleteAttribute.success'),
              payload: updatedGroup,
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
