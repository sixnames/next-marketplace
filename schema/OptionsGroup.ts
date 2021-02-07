import { ObjectId } from 'mongodb';
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
import { COL_ATTRIBUTES, COL_OPTIONS_GROUPS } from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import {
  addOptionToGroupSchema,
  addOptionToOptionSchema,
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
    t.nonNull.list.nonNull.field('options', {
      type: 'Option',
    });
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

export const AddOptionToOptionInput = inputObjectType({
  name: 'AddOptionToOptionInput',
  definition(t) {
    t.nonNull.objectId('optionsGroupId');
    t.nonNull.objectId('optionId');
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
            options: [],
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
          const exist = optionsGroup.options.find(({ nameI18n }) => {
            const inputNameKeys = Object.keys(values.nameI18n);
            return inputNameKeys.some((key) => {
              return nameI18n[key] === values.nameI18n[key];
            });
          });

          if (exist) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.duplicate'),
            };
          }

          // Create option slug
          const slug = generateDefaultLangSlug(values.nameI18n);

          // Add option id to the options group
          const updatedOptionsGroupResult = await optionsGroupsCollection.findOneAndUpdate(
            { _id: optionsGroupId },
            {
              $push: {
                options: {
                  ...values,
                  _id: new ObjectId(),
                  slug,
                  options: [],
                },
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

          // Add option to the connected attributes
          const updatedAttributesResult = await attributesCollection.updateMany(
            { optionsGroupId },
            {
              $push: {
                options: {
                  ...values,
                  slug,
                  options: [],
                },
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

    // Should add option to the option
    t.nonNull.field('addOptionToOption', {
      type: 'OptionsGroupPayload',
      description: 'Should add option to the option',
      args: {
        input: nonNull(
          arg({
            type: 'AddOptionToOptionInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OptionsGroupPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: addOptionToOptionSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const { input } = args;
          const { optionsGroupId, optionId, ...values } = input;

          // Check options group availability
          const optionsGroup = await optionsGroupsCollection.findOne({ _id: optionsGroupId });
          if (!optionsGroup) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.groupError'),
            };
          }

          // Check option availability
          const option = optionsGroup.options.find(({ _id }) => optionId.equal(_id));
          if (!option) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.optionError'),
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
          const exist = option.options.find(({ nameI18n }) => {
            const inputNameKeys = Object.keys(values.nameI18n);
            return inputNameKeys.some((key) => {
              return nameI18n[key] === values.nameI18n[key];
            });
          });

          if (exist) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.duplicate'),
            };
          }

          // Create option slug
          const slug = generateDefaultLangSlug(values.nameI18n);

          const updatedGroupOptions = optionsGroup.options.reduce(
            (acc: OptionModel[], groupOption) => {
              if (groupOption._id.equals(optionId)) {
                groupOption.options.push({
                  ...values,
                  _id: new ObjectId(),
                  slug: `${groupOption.slug}__${slug}`,
                  options: [],
                });
                return [...acc, groupOption];
              }
              return [...acc, groupOption];
            },
            [],
          );

          // Add option id to the options group
          const updatedOptionsGroupResult = await optionsGroupsCollection.findOneAndUpdate(
            { _id: optionsGroupId },
            {
              $set: {
                options: updatedGroupOptions,
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

          // Add option to the connected attributes
          const updatedAttributesResult = await attributesCollection.updateMany(
            { optionsGroupId },
            {
              $push: {
                options: {
                  ...values,
                  slug,
                  options: [],
                },
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
          const exist = optionsGroup.options.find(({ nameI18n }) => {
            const inputNameKeys = Object.keys(values.nameI18n);
            return inputNameKeys.some((key) => {
              return nameI18n[key] === values.nameI18n[key];
            });
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.updateOption.duplicate'),
            };
          }

          // Update option
          const updatedOptionsGroupResult = await optionsGroupsCollection.findOneAndUpdate(
            { _id: optionsGroupId },
            {
              $set: {
                'options.$[option]': values,
              },
            },
            {
              arrayFilters: [{ 'option._id': { $eq: optionId } }],
              returnOriginal: false,
            },
          );
          const updatedOptionsGroup = updatedOptionsGroupResult.value;
          if (!updatedOptionsGroupResult.ok || !updatedOptionsGroup) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.updateOption.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('optionsGroups.updateOption.success'),
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
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
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

          // Update options group options list
          const updatedOptionsGroupResult = await optionsGroupsCollection.findOneAndUpdate(
            {
              _id: optionsGroupId,
            },
            {
              $pull: {
                options: { _id: optionId },
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
