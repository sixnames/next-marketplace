import { getNextItemId } from 'lib/itemIdUtils';
import { deleteOptionsTree } from 'lib/optionsUtils';
import { arg, enumType, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import {
  OPTIONS_GROUP_VARIANT_COLOR,
  OPTIONS_GROUP_VARIANT_ENUMS,
  OPTIONS_GROUP_VARIANT_ICON,
  SORT_DESC,
} from 'config/common';
import {
  AttributeModel,
  OptionModel,
  OptionsGroupModel,
  OptionsGroupPayloadModel,
  ProductAttributeModel,
  ProductConnectionItemModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES,
  COL_OPTIONS,
  COL_OPTIONS_GROUPS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTION_ITEMS,
} from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import {
  addOptionToGroupSchema,
  createOptionsGroupSchema,
  deleteOptionFromGroupSchema,
  updateOptionInGroupSchema,
  updateOptionsGroupSchema,
} from 'validation/optionsGroupSchema';

export const OptionsGroupVariant = enumType({
  name: 'OptionsGroupVariant',
  members: OPTIONS_GROUP_VARIANT_ENUMS,
  description: 'Options group variant enum.',
});

export const OptionsGroup = objectType({
  name: 'OptionsGroup',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.field('variant', {
      type: 'OptionsGroupVariant',
    });

    // OptionsGroup name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // OptionsGroup options field resolver
    t.nonNull.list.nonNull.field('options', {
      type: 'Option',
      resolve: async (source): Promise<OptionModel[]> => {
        const { db } = await getDatabase();
        const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
        const options = optionsCollection.find({ optionsGroupId: source._id }).toArray();
        return options;
      },
    });
  },
});

// OptionsGroup Queries
export const OptionsGroupQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return options group by given id
    t.nonNull.field('getOptionsGroup', {
      type: 'OptionsGroup',
      description: 'Should return options group by given id',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args): Promise<OptionsGroupModel> => {
        const { db } = await getDatabase();
        const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
        const optionsGroup = await optionsGroupsCollection.findOne({ _id: args._id });
        if (!optionsGroup) {
          throw Error('Options group not found by given id');
        }
        return optionsGroup;
      },
    });

    // Should return options groups list
    t.nonNull.list.nonNull.field('getAllOptionsGroups', {
      type: 'OptionsGroup',
      description: 'Should return options groups list',
      resolve: async (): Promise<OptionsGroupModel[]> => {
        const { db } = await getDatabase();
        const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
        const optionsGroups = await optionsGroupsCollection
          .find(
            {},
            {
              sort: {
                _id: SORT_DESC,
              },
            },
          )
          .toArray();
        return optionsGroups;
      },
    });
  },
});

export const OptionsGroupPayload = objectType({
  name: 'OptionsGroupPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'OptionsGroup',
    });
  },
});

export const CreateOptionsGroupInput = inputObjectType({
  name: 'CreateOptionsGroupInput',
  definition(t) {
    t.nonNull.json('nameI18n');
    t.nonNull.field('variant', {
      type: 'OptionsGroupVariant',
    });
  },
});

export const UpdateOptionsGroupInput = inputObjectType({
  name: 'UpdateOptionsGroupInput',
  definition(t) {
    t.nonNull.objectId('optionsGroupId');
    t.nonNull.json('nameI18n');
    t.nonNull.field('variant', {
      type: 'OptionsGroupVariant',
    });
  },
});

export const OptionVariantInput = inputObjectType({
  name: 'OptionVariantInput',
  definition(t) {
    t.nonNull.json('value');
    t.nonNull.field('gender', {
      type: 'Gender',
    });
  },
});

export const AddOptionToGroupInput = inputObjectType({
  name: 'AddOptionToGroupInput',
  definition(t) {
    t.nonNull.objectId('optionsGroupId');
    t.objectId('parentId');
    t.nonNull.json('nameI18n');
    t.string('color');
    t.string('icon');
    t.nonNull.json('variants');
    t.nonNull.field('gender', {
      type: 'Gender',
    });
  },
});

export const UpdateOptionInGroupInput = inputObjectType({
  name: 'UpdateOptionInGroupInput',
  definition(t) {
    t.nonNull.objectId('optionId');
    t.objectId('parentId');
    t.nonNull.objectId('optionsGroupId');
    t.nonNull.json('nameI18n');
    t.string('color');
    t.string('icon');
    t.nonNull.json('variants');
    t.field('gender', {
      type: 'Gender',
    });
  },
});

export const DeleteOptionFromGroupInput = inputObjectType({
  name: 'DeleteOptionFromGroupInput',
  definition(t) {
    t.nonNull.objectId('optionId');
    t.nonNull.objectId('optionsGroupId');
  },
});

// OptionsGroup Mutations
export const OptionsGroupMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create options group
    t.nonNull.field('createOptionsGroup', {
      type: 'OptionsGroupPayload',
      description: 'Should create options group',
      args: {
        input: nonNull(
          arg({
            type: 'CreateOptionsGroupInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OptionsGroupPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createOptionsGroup',
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
            schema: createOptionsGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const { input } = args;

          // Check if options group already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_OPTIONS_GROUPS,
            fieldArg: input.nameI18n,
            fieldName: 'nameI18n',
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.create.duplicate'),
            };
          }

          // Create options group
          const createdOptionsGroupResult = await optionsGroupsCollection.insertOne(input);
          const createdOptionsGroup = createdOptionsGroupResult.ops[0];
          if (!createdOptionsGroupResult.result.ok || !createdOptionsGroup) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('optionsGroups.create.success'),
            payload: createdOptionsGroup,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update options group
    t.nonNull.field('updateOptionsGroup', {
      type: 'OptionsGroupPayload',
      description: 'Should update options group',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateOptionsGroupInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OptionsGroupPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateOptionsGroup',
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
            schema: updateOptionsGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const { input } = args;
          const { optionsGroupId, ...values } = input;

          // Check if options group already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_OPTIONS_GROUPS,
            fieldArg: values.nameI18n,
            fieldName: 'nameI18n',
            additionalQuery: { _id: { $ne: optionsGroupId } },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.update.duplicate'),
            };
          }

          // Update options group
          const updatedOptionsGroupResult = await optionsGroupsCollection.findOneAndUpdate(
            { _id: optionsGroupId },
            {
              $set: {
                ...values,
              },
            },
            {
              returnDocument: 'after',
            },
          );
          const updatedOptionsGroup = updatedOptionsGroupResult.value;
          if (!updatedOptionsGroupResult.ok || !updatedOptionsGroup) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('optionsGroups.update.success'),
            payload: updatedOptionsGroup,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete options group
    t.nonNull.field('deleteOptionsGroup', {
      type: 'OptionsGroupPayload',
      description: 'Should delete options group',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OptionsGroupPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
        const optionsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS);
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

        const session = client.startSession();

        let mutationPayload: OptionsGroupPayloadModel = {
          success: false,
          message: await getApiMessage('optionsGroups.delete.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'deleteOptionsGroup',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            const { _id } = args;

            // Check options group availability
            const optionsGroup = await optionsGroupsCollection.findOne({ _id });
            if (!optionsGroup) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('optionsGroups.delete.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Check if options group is used in attributes
            const used = await attributesCollection.findOne({ optionsGroupId: _id });
            if (used) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('optionsGroups.delete.used'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete options group
            const removedOptionsGroupResult = await optionsGroupsCollection.findOneAndDelete({
              _id,
            });
            if (!removedOptionsGroupResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('optionsGroups.delete.error'),
              };
              await session.abortTransaction();
              return;
            }
            const removedOptionsResult = await optionsCollection.deleteMany({
              optionsGroupId: _id,
            });
            if (!removedOptionsResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('optionsGroups.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('optionsGroups.delete.success'),
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

    // Should add option to the group
    t.nonNull.field('addOptionToGroup', {
      type: 'OptionsGroupPayload',
      description: 'Should add option to the group',
      args: {
        input: nonNull(
          arg({
            type: 'AddOptionToGroupInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OptionsGroupPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createOption',
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
            schema: addOptionToGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const { input } = args;
          const { optionsGroupId, parentId, ...values } = input;

          // Check options group availability
          const optionsGroup = await optionsGroupsCollection.findOne({ _id: optionsGroupId });
          if (!optionsGroup) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.groupError'),
            };
          }

          // Check input fields based on options group variant
          if (optionsGroup.variant === OPTIONS_GROUP_VARIANT_ICON && !values.icon) {
            return {
              success: false,
              message: await getApiMessage(`optionsGroups.addOption.iconError`),
            };
          }
          if (optionsGroup.variant === OPTIONS_GROUP_VARIANT_COLOR && !values.color) {
            return {
              success: false,
              message: await getApiMessage(`optionsGroups.addOption.colorError`),
            };
          }

          // Check if option already exist in the group
          const exist = await findDocumentByI18nField({
            fieldArg: values.nameI18n,
            collectionName: COL_OPTIONS,
            fieldName: 'nameI18n',
            additionalQuery: parentId
              ? {
                  parentId,
                }
              : undefined,
          });

          if (exist) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.duplicate'),
            };
          }

          // Create new option slug
          const newOptionSlug = await getNextItemId(COL_OPTIONS);

          // Add option
          const createdOptionResult = await optionsCollection.insertOne({
            ...values,
            slug: newOptionSlug,
            parentId,
            variants: {},
            optionsGroupId,
          });
          const createdOption = createdOptionResult.ops[0];
          if (!createdOptionResult.result.ok || !createdOption) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('optionsGroups.addOption.success'),
            payload: optionsGroup,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update option in the group
    t.nonNull.field('updateOptionInGroup', {
      type: 'OptionsGroupPayload',
      description: 'Should update option in the group',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateOptionInGroupInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OptionsGroupPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateOption',
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
            schema: updateOptionInGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const { input } = args;
          const { optionsGroupId, optionId, parentId, ...values } = input;

          // Check options group availability
          const optionsGroup = await optionsGroupsCollection.findOne({ _id: optionsGroupId });
          if (!optionsGroup) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.updateOption.groupError'),
            };
          }

          // Check input fields based on options group variant
          if (optionsGroup.variant === OPTIONS_GROUP_VARIANT_ICON && !values.icon) {
            return {
              success: false,
              message: await getApiMessage(`optionsGroups.addOption.iconError`),
            };
          }
          if (optionsGroup.variant === OPTIONS_GROUP_VARIANT_COLOR && !values.color) {
            return {
              success: false,
              message: await getApiMessage(`optionsGroups.addOption.colorError`),
            };
          }

          // Check if option already exist in the group
          const exist = await findDocumentByI18nField({
            fieldArg: values.nameI18n,
            collectionName: COL_OPTIONS,
            fieldName: 'nameI18n',
            additionalQuery: parentId
              ? { _id: { $ne: optionId } }
              : { _id: { $ne: optionId }, parentId },
          });

          if (exist) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.updateOption.duplicate'),
            };
          }

          // Update option
          const updatedOptionResult = await optionsCollection.findOneAndUpdate(
            { _id: optionId },
            {
              $set: {
                ...values,
                parentId,
              },
            },
          );
          const updatedOption = updatedOptionResult.value;
          if (!updatedOptionResult.ok || !updatedOption) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.updateOption.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('optionsGroups.updateOption.success'),
            payload: optionsGroup,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete option from the group
    t.nonNull.field('deleteOptionFromGroup', {
      type: 'OptionsGroupPayload',
      description: 'Should delete option from the group',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteOptionFromGroupInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OptionsGroupPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deleteOption',
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
            schema: deleteOptionFromGroupSchema,
          });
          await validationSchema.validate(args.input);
          const { getApiMessage } = await getRequestParams(context);

          const { db } = await getDatabase();
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const productAttributesCollection =
            db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
          const productConnectionItemsCollection = db.collection<ProductConnectionItemModel>(
            COL_PRODUCT_CONNECTION_ITEMS,
          );
          const { input } = args;
          const { optionsGroupId, optionId } = input;

          // Check options group availability
          const optionsGroup = await optionsGroupsCollection.findOne({ _id: optionsGroupId });
          if (!optionsGroup) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.deleteOption.groupError'),
            };
          }

          // Check if option is used in product attributes
          const usedInProductAttributes = await productAttributesCollection.findOne({
            selectedOptionsIds: optionId,
          });
          if (usedInProductAttributes) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.deleteOption.used'),
            };
          }

          // Check if option is used in product connections
          const usedInProductConnections = await productConnectionItemsCollection.findOne({
            optionId,
          });
          if (usedInProductConnections) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.deleteOption.used'),
            };
          }

          // Update options group options list
          const removedOptionResult = await deleteOptionsTree(optionId);
          if (!removedOptionResult) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.deleteOption.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('optionsGroups.deleteOption.success'),
            payload: optionsGroup,
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
