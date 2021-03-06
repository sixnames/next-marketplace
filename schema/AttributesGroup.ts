import { COL_ATTRIBUTES_GROUPS } from 'db/collectionNames';
import { AttributesGroupModel, AttributesGroupPayloadModel } from 'db/dbModels';

import { getDbCollections } from 'db/mongodb';
import { findDocumentByI18nField } from 'db/utils/findDocumentByI18nField';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  createAttributesGroupSchema,
  updateAttributesGroupSchema,
} from 'validation/attributesGroupSchema';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';

export const AttributesGroup = objectType({
  name: 'AttributesGroup',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.list.nonNull.objectId('attributesIds');
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
          const collections = await getDbCollections();
          const attributesGroupCollection = collections.attributesGroupsCollection();

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
            _id: new ObjectId(),
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
          const collections = await getDbCollections();
          const attributesGroupCollection = collections.attributesGroupsCollection();

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
        const collections = await getDbCollections();
        const attributesGroupCollection = collections.attributesGroupsCollection();
        const attributesCollection = collections.attributesCollection();

        const session = collections.client.startSession();

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
