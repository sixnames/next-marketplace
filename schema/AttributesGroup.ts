import { DEFAULT_LOCALE, SORT_ASC } from 'config/common';
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
  ProductAttributeModel,
  ProductConnectionModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTIONS,
} from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
import {
  createAttributesGroupSchema,
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
                [`nameI18n.${DEFAULT_LOCALE}`]: SORT_ASC,
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
          if (!createdAttributesGroup.acknowledged) {
            return {
              success: false,
              message: await getApiMessage('attributesGroups.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('attributesGroups.create.success'),
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

            // Delete all nested attributes
            const removedAttributes = await attributesCollection.deleteMany({
              _id: { $in: group.attributesIds },
            });
            if (!removedAttributes.acknowledged) {
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
  },
});
