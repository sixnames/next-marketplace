import { deleteOptionFromTree, findOptionInTree, updateOptionInTree } from 'lib/optionsUtils';
import { ObjectId } from 'mongodb';
import { arg, enumType, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { getRequestParams, getResolverValidationSchema } from 'lib/sessionHelpers';
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
  ProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_ATTRIBUTES, COL_OPTIONS, COL_OPTIONS_GROUPS, COL_PRODUCTS } from 'db/collectionNames';
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
        const db = await getDatabase();
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
    t.objectId('parentOptionId');
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
    t.objectId('parentOptionId');
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
    t.objectId('parentOptionId');
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
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const { input } = args;
          const { optionsGroupId, parentOptionId, ...values } = input;

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
          const inputNameKeys = Object.keys(values.nameI18n);
          const initialOptions = await optionsCollection
            .find({
              optionsGroupId,
            })
            .toArray();

          const exist = findOptionInTree({
            options: initialOptions,
            condition: ({ nameI18n }) => {
              return inputNameKeys.some((key) => {
                return nameI18n[key] === values.nameI18n[key];
              });
            },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.duplicate'),
            };
          }

          // Create new option slug
          const newOptionSlug = generateDefaultLangSlug(values.nameI18n);

          // Add option
          if (parentOptionId) {
            const parentOption = await optionsCollection.findOne({ _id: parentOptionId });
            if (!parentOption) {
              return {
                success: false,
                message: await getApiMessage('optionsGroups.addOption.error'),
              };
            }

            const updatedParentOptions = updateOptionInTree({
              options: parentOption.options,
              condition: (treeOption) => {
                return treeOption._id.equals(parentOptionId);
              },
              updater: (option) => {
                const slug = `${option.slug}__${newOptionSlug}`;
                return {
                  ...option,
                  options: [
                    ...option.options,
                    {
                      ...values,
                      _id: new ObjectId(),
                      slug,
                      options: [],
                      optionsGroupId,
                    },
                  ],
                };
              },
            });

            const updatedParentOption = await optionsCollection.findOneAndUpdate(
              { _id: parentOptionId },
              {
                $set: {
                  options: updatedParentOptions,
                },
              },
            );

            if (!updatedParentOption.ok) {
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
          }

          const createdOptionResult = await optionsCollection.insertOne({
            ...values,
            slug: newOptionSlug,
            options: [],
            variants: {},
            optionsGroupId,
          });
          if (!createdOptionResult.result.ok) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.error'),
            };
          }

          // TODO update options in rubrics

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
          const { optionsGroupId, optionId, parentOptionId, ...values } = input;

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
          const inputNameKeys = Object.keys(values.nameI18n);
          const initialOptions = await optionsCollection
            .find({
              optionsGroupId,
            })
            .toArray();

          const exist = findOptionInTree({
            options: initialOptions,
            condition: ({ nameI18n, _id }) => {
              return (
                inputNameKeys.some((key) => {
                  return nameI18n[key] === values.nameI18n[key];
                }) && !_id.equals(optionId)
              );
            },
          });

          if (exist) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.updateOption.duplicate'),
            };
          }

          // Create new option slug
          const newOptionSlug = generateDefaultLangSlug(values.nameI18n);

          // Update option
          if (parentOptionId) {
            const parentOption = await optionsCollection.findOne({ _id: parentOptionId });
            if (!parentOption) {
              return {
                success: false,
                message: await getApiMessage('optionsGroups.addOption.error'),
              };
            }

            const updatedParentOptions = updateOptionInTree({
              options: parentOption.options,
              condition: (treeOption) => {
                return treeOption._id.equals(optionId);
              },
              updater: (option) => {
                const optionSlugParts = option.slug.split('__');
                const slug = `${optionSlugParts[0]}__${newOptionSlug}`;
                return {
                  ...option,
                  ...values,
                  slug,
                };
              },
            });

            const updatedParentOption = await optionsCollection.findOneAndUpdate(
              { _id: parentOptionId },
              {
                $set: {
                  options: updatedParentOptions,
                },
              },
            );

            if (!updatedParentOption.ok) {
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
          }

          const updatedOption = await optionsCollection.findOneAndUpdate(
            { _id: optionId },
            {
              $set: {
                ...values,
                slug: newOptionSlug,
              },
            },
          );
          if (!updatedOption) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.updateOption.error'),
            };
          }

          // TODO update options in rubrics and products

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
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { optionsGroupId, optionId, parentOptionId } = input;

          // Check options group availability
          const optionsGroup = await optionsGroupsCollection.findOne({ _id: optionsGroupId });
          if (!optionsGroup) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.deleteOption.groupError'),
            };
          }

          // TODO Check if option is used in product connections and in product attributes
          const usedInProducts = await productsCollection.findOne({
            $or: [
              {
                'attributes.selectedOptions._id': optionId,
              },
              {
                'connections.connectionProducts.option._id': optionId,
              },
            ],
          });
          if (usedInProducts) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.deleteOption.used'),
            };
          }

          if (parentOptionId) {
            const parentOption = await optionsCollection.findOne({ _id: parentOptionId });
            if (!parentOption) {
              return {
                success: false,
                message: await getApiMessage('optionsGroups.deleteOption.error'),
              };
            }

            // Delete option
            const updatedParentOptions = deleteOptionFromTree({
              options: parentOption.options,
              condition: (treeOption) => {
                return treeOption._id.equals(optionId);
              },
            });

            const updatedParentOption = await optionsCollection.findOneAndUpdate(
              { _id: parentOptionId },
              {
                $set: {
                  options: updatedParentOptions,
                },
              },
            );

            if (!updatedParentOption.ok) {
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
          }

          // Update options group options list
          const updatedOptionsGroupResult = await optionsCollection.findOneAndDelete({
            _id: optionId,
          });
          if (!updatedOptionsGroupResult.ok) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.deleteOption.error'),
            };
          }

          // TODO Update attributes and rubrics options list

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
