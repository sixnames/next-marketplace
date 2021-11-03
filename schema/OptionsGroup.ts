import { getFieldStringLocale } from 'lib/i18n';
import { getNextNumberItemId } from 'lib/itemIdUtils';
import { deleteDocumentsTree, trimOptionNames } from 'lib/optionsUtils';
import { arg, enumType, extendType, inputObjectType, list, nonNull, objectType } from 'nexus';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import {
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
  FILTER_SEPARATOR,
  OPTIONS_GROUP_VARIANT_COLOR,
  OPTIONS_GROUP_VARIANT_ENUMS,
  SORT_ASC,
} from 'config/common';
import {
  AttributeModel,
  CategoryModel,
  ObjectIdModel,
  OptionModel,
  OptionsGroupModel,
  OptionsGroupPayloadModel,
  ProductAttributeModel,
  ProductConnectionItemModel,
  ProductConnectionModel,
  ProductModel,
  RubricModel,
  ShopProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES,
  COL_CATEGORIES,
  COL_OPTIONS,
  COL_OPTIONS_GROUPS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_PRODUCT_CONNECTIONS,
  COL_PRODUCTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
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
        const productConnectionItemsCollection = db.collection<ProductConnectionItemModel>(
          COL_PRODUCT_CONNECTION_ITEMS,
        );
        const productConnectionsCollection =
          db.collection<ProductConnectionModel>(COL_PRODUCT_CONNECTIONS);

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

            // cleanup product connections
            const options = await optionsCollection
              .find({
                optionsGroupId: _id,
              })
              .toArray();
            for await (const option of options) {
              const optionId = option._id;
              const connectionItems = await productConnectionItemsCollection
                .find({
                  optionId,
                })
                .toArray();
              for await (const connectionItem of connectionItems) {
                await productConnectionsCollection.findOneAndUpdate(
                  {
                    _id: connectionItem.connectionId,
                  },
                  {
                    $pull: {
                      productsIds: connectionItem.productId,
                    },
                  },
                );
                await productConnectionItemsCollection.findOneAndDelete({
                  _id: connectionItem._id,
                });
              }
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
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const productAttributesCollection =
            db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
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
          const newAttributesCount = await attributesCollection.countDocuments({
            optionsGroupId: newOptionsGroup._id,
          });
          if (newAttributesCount < 1) {
            return {
              success: false,
              message: await getApiMessage('optionsGroups.updateOption.attributeNotFound'),
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

          // update product attributes
          const oldAttributes = await attributesCollection
            .find({
              optionsGroupId: option.optionsGroupId,
            })
            .toArray();
          for await (const attribute of oldAttributes) {
            const oldProductAttributes = await productAttributesCollection
              .find({
                attributeId: attribute._id,
              })
              .toArray();

            for await (const oldProductAttribute of oldProductAttributes) {
              const isOptionSelected = oldProductAttribute.selectedOptionsIds.some((_id) => {
                return _id.equals(option._id);
              });

              if (isOptionSelected) {
                const product = await productsCollection.findOne({
                  _id: oldProductAttribute.productId,
                });

                if (!product) {
                  continue;
                }
                const rubric = await rubricsCollection.findOne({ _id: product.rubricId });
                const categories = await categoriesCollection
                  .find({
                    slug: {
                      $in: product.selectedOptionsSlugs,
                    },
                  })
                  .toArray();
                if (!rubric) {
                  continue;
                }

                // remove option from old product attribute, product and shop product
                const updater = {
                  $pull: {
                    selectedOptionsIds: option._id,
                    selectedOptionsSlugs: `${attribute.slug}${FILTER_SEPARATOR}${option.slug}`,
                  },
                };
                await productAttributesCollection.findOneAndUpdate(
                  {
                    _id: oldProductAttribute._id,
                  },
                  updater,
                );
                await productsCollection.findOneAndUpdate(
                  {
                    _id: product._id,
                  },
                  updater,
                );
                await shopProductsCollection.findOneAndUpdate(
                  {
                    productId: product._id,
                  },
                  updater,
                );

                const categoryAttributesGroupIds = categories.reduce(
                  (acc: ObjectIdModel[], { attributesGroupIds }) => {
                    return [...acc, ...attributesGroupIds];
                  },
                  [],
                );
                const allAttributesGroupIds = [
                  ...categoryAttributesGroupIds,
                  ...rubric.attributesGroupIds,
                ];

                // get new attributes
                const newAttributes = await attributesCollection
                  .find({
                    optionsGroupId: newOptionsGroup._id,
                    attributesGroupId: {
                      $in: allAttributesGroupIds,
                    },
                  })
                  .toArray();

                // update or create product attributes
                for await (const newAttribute of newAttributes) {
                  const existingProductAttribute = await productAttributesCollection.findOne({
                    productId: product._id,
                    attributeId: newAttribute._id,
                  });
                  const selectedOptionSlug = `${newAttribute.slug}${FILTER_SEPARATOR}${option.slug}`;
                  if (existingProductAttribute) {
                    await productAttributesCollection.findOneAndUpdate(
                      {
                        _id: existingProductAttribute._id,
                      },
                      {
                        $push: {
                          selectedOptionsIds: option._id,
                          selectedOptionsSlugs: selectedOptionSlug,
                        },
                      },
                    );
                  } else {
                    await productAttributesCollection.insertOne({
                      rubricId: rubric._id,
                      rubricSlug: rubric.slug,
                      attributeId: newAttribute._id,
                      productId: product._id,
                      productSlug: product.slug,
                      selectedOptionsIds: [option._id],
                      selectedOptionsSlugs: [selectedOptionSlug],
                      number: undefined,
                      textI18n: {},
                    });
                  }
                }
              }
            }
          }

          // move option
          const updatedOptionResult = await optionsCollection.findOneAndUpdate(
            {
              _id: option._id,
            },
            {
              $set: {
                optionsGroupId: newOptionsGroup._id,
              },
            },
          );
          if (!updatedOptionResult.ok) {
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
          const productConnectionItemsCollection = db.collection<ProductConnectionItemModel>(
            COL_PRODUCT_CONNECTION_ITEMS,
          );
          const productConnectionsCollection =
            db.collection<ProductConnectionModel>(COL_PRODUCT_CONNECTIONS);
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

          // cleanup product connections
          const connectionItems = await productConnectionItemsCollection
            .find({
              optionId,
            })
            .toArray();
          for await (const connectionItem of connectionItems) {
            await productConnectionsCollection.findOneAndUpdate(
              {
                _id: connectionItem.connectionId,
              },
              {
                $pull: {
                  productsIds: connectionItem.productId,
                },
              },
            );
            await productConnectionItemsCollection.findOneAndDelete({
              _id: connectionItem._id,
            });
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
