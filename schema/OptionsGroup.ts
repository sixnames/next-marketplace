import { arg, enumType, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { getRequestParams, getResolverValidationSchema } from 'lib/sessionHelpers';
import {
  OPTIONS_GROUP_VARIANT_COLOR,
  OPTIONS_GROUP_VARIANT_ENUMS,
  OPTIONS_GROUP_VARIANT_ICON,
  SORT_ASC,
} from 'config/common';
import {
  AttributeModel,
  OptionModel,
  OptionsGroupModel,
  OptionsGroupPayloadModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_ATTRIBUTES, COL_OPTIONS, COL_OPTIONS_GROUPS } from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import { generateDefaultLangSlug } from 'lib/slugUtils';
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
    t.nonNull.list.nonNull.objectId('optionsIds');
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

    // OptionsGroup options list field resolver
    t.nonNull.list.nonNull.field('options', {
      type: 'Option',
      resolve: async (source): Promise<OptionModel[]> => {
        const db = await getDatabase();
        const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
        const options = await optionsCollection.find({ _id: { $in: source.optionsIds } }).toArray();
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
        const db = await getDatabase();
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
        const db = await getDatabase();
        const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
        const optionsGroups = await optionsGroupsCollection
          .find(
            {},
            {
              sort: {
                itemId: SORT_ASC,
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
    t.nonNull.json('nameI18n');
    t.string('color');
    t.string('icon');
    t.nonNull.field('gender', {
      type: 'Gender',
    });
    t.nonNull.list.nonNull.field('variants', {
      type: 'OptionVariantInput',
    });
  },
});

export const UpdateOptionInGroupInput = inputObjectType({
  name: 'UpdateOptionInGroupInput',
  definition(t) {
    t.nonNull.objectId('optionId');
    t.nonNull.objectId('optionsGroupId');
    t.nonNull.json('nameI18n');
    t.string('color');
    t.string('icon');
    t.field('gender', {
      type: 'Gender',
    });
    t.nonNull.list.nonNull.field('variants', {
      type: 'OptionVariantInput',
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
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createOptionsGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
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
          const createdOptionsGroupResult = await optionsGroupsCollection.insertOne({
            ...input,
            optionsIds: [],
          });
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
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateOptionsGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
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
              returnOriginal: false,
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
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const { _id } = args;

          // Check options group availability
          const optionsGroup = await optionsGroupsCollection.findOne({ _id });
          if (!optionsGroup) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.delete.notFound'),
            };
          }

          // Check if options group is used in attributes
          const used = await attributesCollection.findOne({ optionsGroupId: _id });
          if (used) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.delete.used'),
            };
          }

          // Delete all group options
          const removedGroupOptionsResult = await optionsCollection.deleteMany({
            _id: { $in: optionsGroup.optionsIds },
          });
          if (!removedGroupOptionsResult.result.ok) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.delete.optionsError'),
            };
          }

          // Delete options group
          const updatedOptionsGroupResult = await optionsGroupsCollection.findOneAndDelete({ _id });
          if (!updatedOptionsGroupResult.ok) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.delete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('optionsGroups.delete.success'),
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
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
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: addOptionToGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const { input } = args;
          const { optionsGroupId, ...values } = input;

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
            collectionName: COL_OPTIONS,
            fieldArg: values.nameI18n,
            fieldName: 'nameI18n',
            additionalQuery: { _id: { $in: optionsGroup.optionsIds } },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.duplicate'),
            };
          }

          // Create option
          const slug = generateDefaultLangSlug(values.nameI18n);
          const createdOptionResult = await optionsCollection.insertOne({
            ...values,
            slug,
            views: {},
            priorities: {},
          });
          const createdOption = createdOptionResult.ops[0];
          if (!createdOptionResult.result.ok || !createdOption) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.error'),
            };
          }

          // Add option id to the options group
          const updatedOptionsGroupResult = await optionsGroupsCollection.findOneAndUpdate(
            { _id: optionsGroupId },
            {
              $push: {
                optionsIds: createdOption._id,
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedOptionsGroup = updatedOptionsGroupResult.value;
          if (!updatedOptionsGroupResult.ok || !updatedOptionsGroup) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.error'),
            };
          }

          // Add option id to the connected attributes
          const updatedAttributesResult = await attributesCollection.updateMany(
            { optionsGroupId },
            {
              $push: {
                optionsIds: createdOption._id,
              },
            },
          );
          if (!updatedAttributesResult.result.ok) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('optionsGroups.addOption.success'),
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
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateOptionInGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const { input } = args;
          const { optionsGroupId, optionId, ...values } = input;

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
            collectionName: COL_OPTIONS,
            fieldArg: values.nameI18n,
            fieldName: 'nameI18n',
            additionalQuery: {
              $and: [{ _id: { $in: optionsGroup.optionsIds } }, { _id: { $ne: optionId } }],
            },
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
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: deleteOptionFromGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const { input } = args;
          const { optionsGroupId, optionId } = input;

          // Check option availability
          const option = await optionsCollection.findOne({ _id: optionId });
          if (!option) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.deleteOption.notFound'),
            };
          }

          // Check options group availability
          const optionsGroup = await optionsGroupsCollection.findOne({ _id: optionsGroupId });
          if (!optionsGroup) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.deleteOption.groupError'),
            };
          }

          // Delete option
          const updatedOptionResult = await optionsCollection.findOneAndDelete({ _id: optionId });
          if (!updatedOptionResult.ok) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.deleteOption.error'),
            };
          }

          // Update options group options list
          const updatedOptionsGroupResult = await optionsGroupsCollection.findOneAndUpdate(
            {
              _id: optionsGroupId,
            },
            {
              $pull: {
                optionsIds: optionId,
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedOptionsGroup = updatedOptionsGroupResult.value;
          if (!updatedOptionsGroupResult.ok || !updatedOptionsGroup) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.deleteOption.error'),
            };
          }

          // Update attributes options list
          const updatedAttributesResult = await attributesCollection.updateMany(
            { optionsGroupId },
            {
              $pull: {
                optionsIds: optionId,
              },
            },
          );
          if (!updatedAttributesResult.result.ok) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.deleteOption.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('optionsGroups.deleteOption.success'),
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
  },
});
