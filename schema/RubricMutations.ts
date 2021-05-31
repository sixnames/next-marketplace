import { castAttributeForRubric } from 'lib/optionsUtils';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  AttributeModel,
  AttributesGroupModel,
  ProductModel,
  RubricAttributeModel,
  RubricModel,
  RubricPayloadModel,
  ShopProductModel,
} from 'db/dbModels';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_PRODUCTS,
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import { DEFAULT_COUNTERS_OBJECT } from 'config/common';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import {
  addAttributesGroupToRubricSchema,
  createRubricSchema,
  deleteAttributesGroupFromRubricSchema,
  deleteProductFromRubricSchema,
  updateAttributesGroupInRubricSchema,
  updateRubricSchema,
} from 'validation/rubricSchema';

export const RubricPayload = objectType({
  name: 'RubricPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Rubric',
    });
  },
});

export const RubricCatalogueTitleInput = inputObjectType({
  name: 'RubricCatalogueTitleInput',
  definition(t) {
    t.nonNull.json('defaultTitleI18n');
    t.json('prefixI18n');
    t.nonNull.json('keywordI18n');
    t.nonNull.field('gender', {
      type: 'Gender',
    });
  },
});

export const CreateRubricInput = inputObjectType({
  name: 'CreateRubricInput',
  definition(t) {
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
    t.nonNull.json('shortDescriptionI18n');
    t.nonNull.objectId('variantId');
    t.nonNull.field('catalogueTitle', {
      type: 'RubricCatalogueTitleInput',
    });
  },
});

export const UpdateRubricInput = inputObjectType({
  name: 'UpdateRubricInput',
  definition(t) {
    t.nonNull.objectId('rubricId');
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
    t.nonNull.json('shortDescriptionI18n');
    t.nonNull.objectId('variantId');
    t.nonNull.boolean('active');
    t.nonNull.field('catalogueTitle', {
      type: 'RubricCatalogueTitleInput',
    });
  },
});

export const AddAttributesGroupToRubricInput = inputObjectType({
  name: 'AddAttributesGroupToRubricInput',
  definition(t) {
    t.nonNull.objectId('rubricId');
    t.nonNull.objectId('attributesGroupId');
  },
});

export const DeleteAttributesGroupFromRubricInput = inputObjectType({
  name: 'DeleteAttributesGroupFromRubricInput',
  definition(t) {
    t.nonNull.objectId('rubricId');
    t.nonNull.objectId('attributesGroupId');
  },
});

export const UpdateAttributesGroupInRubricInput = inputObjectType({
  name: 'UpdateAttributeInRubricInput',
  definition(t) {
    t.nonNull.objectId('rubricId');
    t.nonNull.objectId('attributeId');
  },
});

export const DeleteProductFromRubricInput = inputObjectType({
  name: 'DeleteProductFromRubricInput',
  definition(t) {
    t.nonNull.objectId('rubricId');
    t.nonNull.objectId('productId');
  },
});

export const RubricMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create rubric
    t.nonNull.field('createRubric', {
      type: 'RubricPayload',
      description: 'Should create rubric',
      args: {
        input: nonNull(
          arg({
            type: 'CreateRubricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createRubric',
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
            schema: createRubricSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const { input } = args;

          // Check if rubric already exist
          const exist = await findDocumentByI18nField<RubricModel>({
            collectionName: COL_RUBRICS,
            fieldArg: input.nameI18n,
            fieldName: 'nameI18n',
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('rubrics.create.duplicate'),
            };
          }

          // Create rubric
          const slug = generateDefaultLangSlug(input.nameI18n);
          const createdRubricResult = await rubricsCollection.insertOne({
            ...input,
            slug,
            active: true,
            attributesGroupsIds: [],
            ...DEFAULT_COUNTERS_OBJECT,
          });
          const createdRubric = createdRubricResult.ops[0];
          if (!createdRubricResult.result.ok || !createdRubric) {
            return {
              success: false,
              message: await getApiMessage('rubrics.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('rubrics.create.success'),
            payload: createdRubric,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update rubric
    t.nonNull.field('updateRubric', {
      type: 'RubricPayload',
      description: 'Should update rubric',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateRubricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateRubric',
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
            schema: updateRubricSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const { input } = args;
          const { rubricId, ...values } = input;

          // Check rubric availability
          const rubric = await rubricsCollection.findOne({ _id: rubricId });
          if (!rubric) {
            return {
              success: false,
              message: await getApiMessage('rubrics.update.notFound'),
            };
          }

          // Check if rubric already exist
          const exist = await findDocumentByI18nField<RubricModel>({
            collectionName: COL_RUBRICS,
            fieldArg: input.nameI18n,
            fieldName: 'nameI18n',
            additionalQuery: {
              _id: { $ne: rubricId },
            },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('rubrics.update.duplicate'),
            };
          }

          // Create rubric
          const slug = generateDefaultLangSlug(values.nameI18n);
          const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
            { _id: rubricId },
            {
              $set: {
                ...values,
                slug,
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedRubric = updatedRubricResult.value;
          if (!updatedRubricResult.ok || !updatedRubric) {
            return {
              success: false,
              message: await getApiMessage('rubrics.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('rubrics.update.success'),
            payload: updatedRubric,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete rubric
    t.nonNull.field('deleteRubric', {
      type: 'RubricPayload',
      description: 'Should delete rubric',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deleteRubric',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const productsCollection = db.collection(COL_PRODUCTS);
          const { _id } = args;

          // Check rubric availability
          const rubric = await rubricsCollection.findOne({ _id });
          if (!rubric) {
            return {
              success: false,
              message: await getApiMessage('rubrics.delete.notFound'),
            };
          }

          // Remove rubric and child rubrics ids from all connected products
          const updatedProductsResult = await productsCollection.deleteMany({
            rubricId: _id,
          });
          if (!updatedProductsResult.result.ok) {
            return {
              success: false,
              message: await getApiMessage('rubrics.deleteProduct.error'),
            };
          }

          // Delete rubric
          const removedRubricsResult = await rubricsCollection.deleteOne({
            _id,
          });
          if (!removedRubricsResult.result.ok) {
            return {
              success: false,
              message: await getApiMessage('rubrics.delete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('rubrics.delete.success'),
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should add attributes group to the rubric
    t.nonNull.field('addAttributesGroupToRubric', {
      type: 'RubricPayload',
      description: 'Should add attributes group to the rubric',
      args: {
        input: nonNull(
          arg({
            type: 'AddAttributesGroupToRubricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateRubric',
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
            schema: addAttributesGroupToRubricSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const rubricAttributesCollection = db.collection<RubricAttributeModel>(
            COL_RUBRIC_ATTRIBUTES,
          );
          const attributesGroupsCollection = db.collection<AttributesGroupModel>(
            COL_ATTRIBUTES_GROUPS,
          );
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const { input } = args;
          const { rubricId, attributesGroupId } = input;

          // Check rubric and attributes group availability
          const attributesGroup = await attributesGroupsCollection.findOne({
            _id: attributesGroupId,
          });
          const rubric = await rubricsCollection.findOne({ _id: rubricId });
          if (!rubric || !attributesGroup) {
            return {
              success: false,
              message: await getApiMessage('rubrics.addAttributesGroup.notFound'),
            };
          }

          // Create attributes
          const groupAttributes = await attributesCollection
            .find({
              _id: { $in: attributesGroup.attributesIds },
            })
            .toArray();

          if (groupAttributes.length < 1) {
            return {
              success: false,
              message: await getApiMessage('rubrics.addAttributesGroup.noAttributes'),
            };
          }

          const rubricAttributes: RubricAttributeModel[] = [];
          for await (const attribute of groupAttributes) {
            const rubricAttribute = await castAttributeForRubric({
              attribute,
              rubricSlug: rubric.slug,
              rubricId,
            });
            rubricAttributes.push(rubricAttribute);
          }

          const createdAttributesResult = await rubricAttributesCollection.insertMany(
            rubricAttributes,
          );
          if (!createdAttributesResult.result.ok) {
            return {
              success: false,
              message: await getApiMessage('rubrics.addAttributesGroup.error'),
            };
          }

          // Update rubric
          const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
            {
              _id: rubricId,
            },
            {
              $push: {
                attributesGroupsIds: attributesGroup._id,
              },
            },
            { returnOriginal: false },
          );

          const updatedRubric = updatedRubricResult.value;
          if (!updatedRubricResult.ok || !updatedRubric) {
            return {
              success: false,
              message: await getApiMessage('rubrics.addAttributesGroup.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('rubrics.addAttributesGroup.success'),
            payload: updatedRubric,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should toggle attribute in the rubric attribute showInCatalogueFilter field
    t.nonNull.field('toggleAttributeInRubricCatalogue', {
      type: 'RubricPayload',
      description: 'Should toggle attribute in the rubric attribute showInCatalogueFilter field',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateAttributeInRubricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateRubric',
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
            schema: updateAttributesGroupInRubricSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const rubricAttributesCollection = db.collection<RubricAttributeModel>(
            COL_RUBRIC_ATTRIBUTES,
          );
          const { input } = args;
          const { rubricId, attributeId } = input;

          // Check rubric and attribute availability
          const rubric = await rubricsCollection.findOne({ _id: rubricId });
          if (!rubric) {
            return {
              success: false,
              message: await getApiMessage('rubrics.updateAttributesGroup.notFound'),
            };
          }
          const rubricAttribute = await rubricAttributesCollection.findOne({ _id: attributeId });
          if (!rubricAttribute) {
            return {
              success: false,
              message: await getApiMessage('rubrics.updateAttributesGroup.notFound'),
            };
          }

          // Update rubric attribute
          const updatedRubricAttributeResult = await rubricAttributesCollection.findOneAndUpdate(
            { _id: attributeId },
            {
              $set: {
                showInCatalogueFilter: !rubricAttribute.showInCatalogueFilter,
              },
            },
          );
          if (!updatedRubricAttributeResult.ok) {
            return {
              success: false,
              message: await getApiMessage('rubrics.updateAttributesGroup.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('rubrics.updateAttributesGroup.success'),
            payload: rubric,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should toggle attribute in the rubric attribute showInCatalogueNav field
    t.nonNull.field('toggleAttributeInRubricNav', {
      type: 'RubricPayload',
      description: 'Should toggle attribute in the rubric attribute showInCatalogueNav field',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateAttributeInRubricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateRubric',
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
            schema: updateAttributesGroupInRubricSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const rubricAttributesCollection = db.collection<RubricAttributeModel>(
            COL_RUBRIC_ATTRIBUTES,
          );
          const { input } = args;
          const { rubricId, attributeId } = input;

          // Check rubric and attribute availability
          const rubric = await rubricsCollection.findOne({ _id: rubricId });
          if (!rubric) {
            return {
              success: false,
              message: await getApiMessage('rubrics.updateAttributesGroup.notFound'),
            };
          }
          const rubricAttribute = await rubricAttributesCollection.findOne({ _id: attributeId });
          if (!rubricAttribute) {
            return {
              success: false,
              message: await getApiMessage('rubrics.updateAttributesGroup.notFound'),
            };
          }

          // Update rubric attribute
          const updatedRubricAttributeResult = await rubricAttributesCollection.findOneAndUpdate(
            { _id: attributeId },
            {
              $set: {
                showInCatalogueNav: !rubricAttribute.showInCatalogueNav,
              },
            },
          );
          if (!updatedRubricAttributeResult.ok) {
            return {
              success: false,
              message: await getApiMessage('rubrics.updateAttributesGroup.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('rubrics.updateAttributesGroup.success'),
            payload: rubric,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete attributes group from rubric
    t.nonNull.field('deleteAttributesGroupFromRubric', {
      type: 'RubricPayload',
      description: 'Should delete attributes group from rubric',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteAttributesGroupFromRubricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateRubric',
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
            schema: deleteAttributesGroupFromRubricSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const attributesGroupsCollection = db.collection<AttributesGroupModel>(
            COL_ATTRIBUTES_GROUPS,
          );
          const rubricAttributesCollection = db.collection<RubricAttributeModel>(
            COL_RUBRIC_ATTRIBUTES,
          );
          const { input } = args;
          const { rubricId, attributesGroupId } = input;

          // Check rubric and attributes group availability
          const attributesGroup = await attributesGroupsCollection.findOne({
            _id: attributesGroupId,
          });
          const rubric = await rubricsCollection.findOne({ _id: rubricId });
          if (!rubric || !attributesGroup) {
            return {
              success: false,
              message: await getApiMessage('rubrics.deleteAttributesGroup.notFound'),
            };
          }

          // Delete rubric attributes
          const removedRubricAttributesResult = await rubricAttributesCollection.deleteMany({
            attributesGroupId,
          });
          if (!removedRubricAttributesResult.result.ok) {
            return {
              success: false,
              message: await getApiMessage('rubrics.deleteAttributesGroup.error'),
            };
          }

          // Delete attributes group from rubric
          const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
            {
              _id: rubricId,
            },
            {
              $pull: {
                attributesGroupsIds: attributesGroupId,
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedRubric = updatedRubricResult.value;
          if (!updatedRubricResult.ok || !updatedRubric) {
            return {
              success: false,
              message: await getApiMessage('rubrics.deleteAttributesGroup.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('rubrics.deleteAttributesGroup.success'),
            payload: updatedRubric,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should remove product from the rubric
    t.nonNull.field('deleteProductFromRubric', {
      type: 'RubricPayload',
      description: 'Should remove product from rubric',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteProductFromRubricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deleteProduct',
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
            schema: deleteProductFromRubricSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const { input } = args;
          const { rubricId, productId } = input;

          // Check rubric and product availability
          const product = await productsCollection.findOne({
            _id: productId,
          });
          const rubric = await rubricsCollection.findOne({ _id: rubricId });
          if (!rubric || !product) {
            return {
              success: false,
              message: await getApiMessage('rubrics.deleteProduct.notFound'),
            };
          }

          // Delete product
          const removedProductResult = await productsCollection.findOneAndDelete({
            _id: productId,
          });
          const removedShopProductResult = await shopProductsCollection.findOneAndDelete({
            productId,
          });
          if (!removedProductResult.ok || !removedShopProductResult.ok) {
            return {
              success: false,
              message: await getApiMessage(`rubrics.deleteProduct.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('rubrics.deleteProduct.success'),
            payload: rubric,
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
