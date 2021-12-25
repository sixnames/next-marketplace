import { arg, enumType, extendType, inputObjectType, list, nonNull, objectType } from 'nexus';
import {
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
  FILTER_SEPARATOR,
  OPTIONS_GROUP_VARIANT_COLOR,
  OPTIONS_GROUP_VARIANT_ENUMS,
  SORT_ASC,
} from '../config/common';
import {
  COL_ATTRIBUTES,
  COL_OPTIONS,
  COL_OPTIONS_GROUPS,
  COL_PRODUCT_FACETS,
  COL_SHOP_PRODUCTS,
  COL_PRODUCT_SUMMARIES,
} from '../db/collectionNames';
import { findDocumentByI18nField } from '../db/dao/findDocumentByI18nField';
import {
  AttributeModel,
  OptionModel,
  OptionsGroupModel,
  OptionsGroupPayloadModel,
  ProductFacetModel,
  ShopProductModel,
  ProductSummaryModel,
} from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';
import { getFieldStringLocale } from '../lib/i18n';
import { getNextNumberItemId } from '../lib/itemIdUtils';
import { trimOptionNames } from '../lib/optionUtils';
import { updateProductTitles } from '../lib/productUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../lib/sessionHelpers';
import { deleteDocumentsTree, getChildrenTreeIds } from '../lib/treeUtils';
import {
  addOptionToGroupSchema,
  createOptionsGroupSchema,
  deleteOptionFromGroupSchema,
  updateOptionInGroupSchema,
  updateOptionsGroupSchema,
} from '../validation/optionsGroupSchema';

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
        const options = await optionsCollection
          .aggregate<OptionModel>([
            {
              $match: {
                optionsGroupId: source._id,
                parentId: null,
              },
            },
            {
              $sort: {
                [`nameI18n.${DEFAULT_LOCALE}`]: SORT_ASC,
              },
            },
          ])
          .toArray();
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
      args: {
        excludedIds: arg({
          type: list(nonNull('ObjectId')),
          default: [],
        }),
      },
      description: 'Should return options groups list',
      resolve: async (_root, args, context): Promise<OptionsGroupModel[]> => {
        const { locale } = await getRequestParams(context);
        const { db } = await getDatabase();
        const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
        const optionsGroups = await optionsGroupsCollection
          .find(
            { _id: { $nin: args.excludedIds || [] } },
            {
              sort: {
                [`nameI18n.${locale}`]: SORT_ASC,
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

export const MoveOptionInput = inputObjectType({
  name: 'MoveOptionInput',
  definition(t) {
    t.nonNull.objectId('optionsGroupId');
    t.nonNull.objectId('optionId');
  },
});

export const AddOptionToGroupInput = inputObjectType({
  name: 'AddOptionToGroupInput',
  definition(t) {
    t.nonNull.objectId('optionsGroupId');
    t.objectId('parentId');
    t.nonNull.json('nameI18n');
    t.string('color');
    t.nonNull.json('variants');
    t.field('gender', {
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
          if (!createdOptionsGroupResult.acknowledged) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('optionsGroups.create.success'),
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
        const { getApiMessage, locale } = await getRequestParams(context);
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
            const used = await attributesCollection.find({ optionsGroupId: _id }).toArray();
            if (used.length > 0) {
              const message = await getApiMessage('optionsGroups.delete.used');
              const attributesNames = used.reduce((acc: string, attribute) => {
                const name = getFieldStringLocale(attribute.nameI18n, locale);
                if (name) {
                  return `${acc}, ${name}`;
                }
                return acc;
              }, '');
              mutationPayload = {
                success: false,
                message: `${message}. Атрибуты: ${attributesNames}`,
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
            if (!removedOptionsResult.acknowledged) {
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
                  optionsGroupId,
                }
              : {
                  optionsGroupId,
                },
          });

          if (exist) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.duplicate'),
            };
          }

          // Create new option slug
          const newOptionSlug = await getNextNumberItemId(COL_OPTIONS);

          // Add option
          const { nameI18n, variants } = trimOptionNames({
            nameI18n: values.nameI18n,
            variants: values.variants,
          });
          const createdOptionResult = await optionsCollection.insertOne({
            ...values,
            nameI18n,
            variants,
            slug: newOptionSlug,
            parentId,
            optionsGroupId,
            ...DEFAULT_COUNTERS_OBJECT,
          });
          if (!createdOptionResult.acknowledged) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.addOption.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('optionsGroups.addOption.success'),
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
          const productSummariesCollection =
            db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
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
              ? { _id: { $ne: optionId }, optionsGroupId }
              : { _id: { $ne: optionId }, parentId, optionsGroupId },
          });

          if (exist) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.updateOption.duplicate'),
            };
          }

          // Update option
          const { nameI18n, variants } = trimOptionNames({
            nameI18n: values.nameI18n,
            variants: values.variants,
          });
          const updatedOptionResult = await optionsCollection.findOneAndUpdate(
            { _id: optionId },
            {
              $set: {
                ...values,
                nameI18n,
                variants,
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

          // update product algolia indexes
          const productSummaries = await productSummariesCollection
            .aggregate<ProductFacetModel>([
              {
                $match: {
                  'attributes.optionIds': updatedOption._id,
                },
              },
              {
                $project: {
                  _id: true,
                },
              },
            ])
            .toArray();
          const productIds = productSummaries.map(({ _id }) => _id);
          await updateProductTitles({
            _id: {
              $in: productIds,
            },
          });

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

    // Should move option to another options group
    t.nonNull.field('moveOption', {
      type: 'OptionsGroupPayload',
      description: 'Should move option to another options group',
      args: {
        input: nonNull(
          arg({
            type: 'MoveOptionInput',
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

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const productSummariesCollection =
            db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
          const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const { input } = args;
          const { optionsGroupId, optionId } = input;

          // get new options group
          const newOptionsGroup = await optionsGroupsCollection.findOne({ _id: optionsGroupId });
          if (!newOptionsGroup) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.updateOption.error'),
            };
          }

          // get option
          const option = await optionsCollection.findOne({ _id: optionId });
          if (!option) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.updateOption.error'),
            };
          }
          const optionsTreeIds = await getChildrenTreeIds({
            _id: option._id,
            collectionName: COL_OPTIONS,
            acc: [],
          });
          const treeOptions = await optionsCollection
            .find({
              _id: {
                $in: optionsTreeIds,
              },
            })
            .toArray();

          // update product attributes
          const oldAttributes = await attributesCollection
            .find({
              optionsGroupId: option.optionsGroupId,
            })
            .toArray();
          const oldAttributeIds = oldAttributes.map(({ _id }) => _id);
          const summaries = await productSummariesCollection
            .find({
              'attributes.attributeId': {
                $in: oldAttributeIds,
              },
            })
            .toArray();
          const summaryIds = summaries.map(({ _id }) => _id);

          // remove option form products
          for await (const oldAttribute of oldAttributes) {
            const filterSlugs = treeOptions.map((option) => {
              return `${oldAttribute.slug}${FILTER_SEPARATOR}${option.slug}`;
            });
            await productSummariesCollection.updateMany(
              {
                _id: {
                  $in: summaryIds,
                },
              },
              {
                $pullAll: {
                  'attributes.$[oldAttribute].optionIds': optionsTreeIds,
                  'attributes.$[oldAttribute].filterSlugs': filterSlugs,
                  filterSlugs: filterSlugs,
                },
              },
              {
                arrayFilters: [{ 'oldAttribute.attributeId': { $eq: oldAttribute._id } }],
              },
            );
            await shopProductsCollection.updateMany(
              {
                productId: {
                  $in: summaryIds,
                },
              },
              {
                $pullAll: {
                  filterSlugs,
                },
              },
            );
            await productFacetsCollection.updateMany(
              {
                _id: {
                  $in: summaryIds,
                },
              },
              {
                $pullAll: {
                  filterSlugs,
                },
              },
            );
          }

          // move option
          const updatedOptionResult = await optionsCollection.updateMany(
            {
              _id: {
                $in: optionsTreeIds,
              },
            },
            {
              $set: {
                optionsGroupId: newOptionsGroup._id,
              },
            },
          );
          if (!updatedOptionResult.acknowledged) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.updateOption.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('optionsGroups.updateOption.success'),
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
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const productSummariesCollection =
            db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
          const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
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

          // get option
          const option = await optionsCollection.findOne({ _id: optionId });
          if (!option) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.deleteOption.error'),
            };
          }
          const optionsTreeIds = await getChildrenTreeIds({
            _id: option._id,
            collectionName: COL_OPTIONS,
            acc: [],
          });
          const treeOptions = await optionsCollection
            .find({
              _id: {
                $in: optionsTreeIds,
              },
            })
            .toArray();

          // update product attributes
          const oldAttributes = await attributesCollection
            .find({
              optionsGroupId: option.optionsGroupId,
            })
            .toArray();
          const oldAttributeIds = oldAttributes.map(({ _id }) => _id);
          const summaries = await productSummariesCollection
            .find({
              'attributes.attributeId': {
                $in: oldAttributeIds,
              },
            })
            .toArray();
          const summaryIds = summaries.map(({ _id }) => _id);

          // remove option form products
          for await (const oldAttribute of oldAttributes) {
            const filterSlugs = treeOptions.map((option) => {
              return `${oldAttribute.slug}${FILTER_SEPARATOR}${option.slug}`;
            });
            await productSummariesCollection.updateMany(
              {
                _id: {
                  $in: summaryIds,
                },
              },
              {
                $pullAll: {
                  'attributes.$[oldAttribute].optionIds': optionsTreeIds,
                  'attributes.$[oldAttribute].filterSlugs': filterSlugs,
                  filterSlugs: filterSlugs,
                },
              },
              {
                arrayFilters: [{ 'oldAttribute.attributeId': { $eq: oldAttribute._id } }],
              },
            );
            await shopProductsCollection.updateMany(
              {
                productId: {
                  $in: summaryIds,
                },
              },
              {
                $pullAll: {
                  filterSlugs,
                },
              },
            );
            await productFacetsCollection.updateMany(
              {
                _id: {
                  $in: summaryIds,
                },
              },
              {
                $pullAll: {
                  filterSlugs,
                },
              },
            );
          }

          // Update options group options list
          const removedOptionResult = await deleteDocumentsTree({
            _id: optionId,
            collectionName: COL_OPTIONS,
          });
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
