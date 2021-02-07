import { arg, extendType, inputObjectType, list, nonNull, objectType } from 'nexus';
import { getRequestParams, getResolverValidationSchema } from 'lib/sessionHelpers';
import {
  AttributeModel,
  AttributesGroupModel,
  AttributesGroupPayloadModel,
  MetricModel,
  OptionModel,
  OptionsGroupModel,
  RubricModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_METRICS,
  COL_OPTIONS_GROUPS,
  COL_RUBRICS,
} from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { SORT_ASC } from 'config/common';
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
        const db = await getDatabase();
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
        const db = await getDatabase();
        const attributesGroupCollection = db.collection<AttributesGroupModel>(
          COL_ATTRIBUTES_GROUPS,
        );
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
        const db = await getDatabase();
        const attributesGroupCollection = db.collection<AttributesGroupModel>(
          COL_ATTRIBUTES_GROUPS,
        );
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
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createAttributesGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const attributesGroupCollection = db.collection<AttributesGroupModel>(
            COL_ATTRIBUTES_GROUPS,
          );

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
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateAttributesGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const attributesGroupCollection = db.collection<AttributesGroupModel>(
            COL_ATTRIBUTES_GROUPS,
          );

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
          const createdAttributesGroup = await attributesGroupCollection.findOneAndUpdate(
            {
              _id: args.input.attributesGroupId,
            },
            {
              $set: {
                nameI18n: args.input.nameI18n,
              },
            },
            {
              returnOriginal: false,
            },
          );

          if (!createdAttributesGroup.ok || !createdAttributesGroup.value) {
            return {
              success: false,
              message: await getApiMessage('attributesGroups.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('attributesGroups.update.success'),
            payload: createdAttributesGroup.value,
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
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const attributesGroupCollection = db.collection<AttributesGroupModel>(
            COL_ATTRIBUTES_GROUPS,
          );
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

          // Check if attributes group exist
          const group = await attributesGroupCollection.findOne({ _id: args._id });
          if (!group) {
            return {
              success: false,
              message: await getApiMessage(`attributesGroups.delete.notFound`),
            };
          }

          // Check if used in rubrics
          const connectedWithRubrics = await rubricsCollection.findOne({
            'attributesGroups.attributesGroupId': {
              $in: [group._id],
            },
          });
          if (connectedWithRubrics) {
            return {
              success: false,
              message: await getApiMessage(`attributesGroups.delete.used`),
            };
          }

          // Delete all nested attributes
          const removedAttributes = await attributesCollection.deleteMany({
            _id: { $in: group.attributesIds },
          });
          if (!removedAttributes.result.ok) {
            return {
              success: false,
              message: await getApiMessage(`attributesGroups.delete.attributesError`),
            };
          }

          // Delete attributes group
          const removedGroup = await attributesGroupCollection.findOneAndDelete({ _id: group._id });
          if (!removedGroup.ok) {
            return {
              success: false,
              message: await getApiMessage(`attributesGroups.delete.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('attributesGroups.delete.success'),
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
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
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: addAttributeToGroupSchema,
          });
          await validationSchema.validate(args.input);

          const {
            input: { attributesGroupId, metricId, ...values },
          } = args;
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const attributesGroupCollection = db.collection<AttributesGroupModel>(
            COL_ATTRIBUTES_GROUPS,
          );
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const metricsCollection = db.collection<MetricModel>(COL_METRICS);

          // Check if attributes group exist
          const attributesGroup = await attributesGroupCollection.findOne({
            _id: attributesGroupId,
          });
          if (!attributesGroup) {
            return {
              success: false,
              message: await getApiMessage(`attributesGroups.addAttribute.groupError`),
            };
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
            return {
              success: false,
              message: await getApiMessage(`attributesGroups.addAttribute.duplicate`),
            };
          }

          // Get options
          const slug = generateDefaultLangSlug(values.nameI18n);
          let options: OptionModel[] = [];
          if (values.optionsGroupId) {
            const optionsGroup = await optionsGroupsCollection.findOne({
              _id: values.optionsGroupId,
            });
            options = (optionsGroup?.options || []).map((option) => {
              return {
                ...option,
                slug: `${slug}-${option.slug}`,
              };
            });
          }

          // Get metric
          let metric = null;
          if (metricId) {
            metric = await metricsCollection.findOne({ _id: metricId });
          }

          // Create attribute
          const createdAttributeResult = await attributesCollection.insertOne({
            ...values,
            slug,
            options,
            metric,
          });
          const createdAttribute = createdAttributeResult.ops[0];
          if (!createdAttributeResult.result.ok || !createdAttribute) {
            return {
              success: false,
              message: await getApiMessage(`attributesGroups.addAttribute.attributeError`),
            };
          }

          // Add attribute _id to the attributes group
          const updatedGroup = await attributesGroupCollection.findOneAndUpdate(
            { _id: attributesGroup._id },
            {
              $push: {
                attributesIds: createdAttribute._id,
              },
            },
            {
              returnOriginal: false,
            },
          );
          if (!updatedGroup.ok || !updatedGroup.value) {
            return {
              success: false,
              message: await getApiMessage(`attributesGroups.addAttribute.groupError`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('attributesGroups.addAttribute.success'),
            payload: updatedGroup.value,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
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
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateAttributeInGroupSchema,
          });
          await validationSchema.validate(args.input);

          const {
            input: { attributesGroupId, attributeId, metricId, ...values },
          } = args;
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const attributesGroupCollection = db.collection<AttributesGroupModel>(
            COL_ATTRIBUTES_GROUPS,
          );
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const metricsCollection = db.collection<MetricModel>(COL_METRICS);

          // Check if attributes group exist
          const group = await attributesGroupCollection.findOne({
            _id: attributesGroupId,
          });
          if (!group) {
            return {
              success: false,
              message: await getApiMessage(`attributesGroups.updateAttribute.groupError`),
            };
          }

          // Check if attribute exist
          const attribute = await attributesCollection.findOne({
            _id: attributeId,
          });
          if (!attribute) {
            return {
              success: false,
              message: await getApiMessage(`attributesGroups.updateAttribute.groupError`),
            };
          }

          // Check attribute duplicate
          const exist = await findDocumentByI18nField({
            fieldArg: values.nameI18n,
            collectionName: COL_ATTRIBUTES,
            fieldName: 'nameI18n',
            additionalQuery: {
              $and: [{ _id: { $in: group.attributesIds } }, { _id: { $ne: attributeId } }],
            },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage(`attributesGroups.updateAttribute.duplicate`),
            };
          }

          // Get options
          let options: OptionModel[] = [];
          if (values.optionsGroupId) {
            const optionsGroup = await optionsGroupsCollection.findOne({
              _id: values.optionsGroupId,
            });
            options = (optionsGroup?.options || []).map((option) => {
              return {
                ...option,
                slug: `${attribute.slug}-${option.slug}`,
              };
            });
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
                options,
                metric,
              },
            },
          );
          if (!updatedAttributeResult.ok || !updatedAttributeResult.value) {
            return {
              success: false,
              message: await getApiMessage(`attributesGroups.updateAttribute.updateError`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('attributesGroups.updateAttribute.success'),
            payload: group,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
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
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: deleteAttributeFromGroupSchema,
          });
          await validationSchema.validate(args.input);

          const {
            input: { attributesGroupId, attributeId },
          } = args;
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const attributesGroupCollection = db.collection<AttributesGroupModel>(
            COL_ATTRIBUTES_GROUPS,
          );
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

          // Check if attributes group exist
          const updatedGroupResult = await attributesGroupCollection.findOneAndUpdate(
            {
              _id: attributesGroupId,
            },
            {
              $pull: {
                attributesIds: attributeId,
              },
            },
            {
              returnOriginal: false,
            },
          );
          if (!updatedGroupResult.ok || !updatedGroupResult.value) {
            return {
              success: false,
              message: await getApiMessage(`attributesGroups.deleteAttribute.groupError`),
            };
          }

          // Remove attribute
          const updatedAttributeResult = await attributesCollection.findOneAndDelete({
            _id: attributeId,
          });
          if (!updatedAttributeResult.ok) {
            return {
              success: false,
              message: await getApiMessage(`attributesGroups.deleteAttribute.deleteError`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('attributesGroups.deleteAttribute.success'),
            payload: updatedGroupResult.value,
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
