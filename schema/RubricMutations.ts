import { deleteAlgoliaObjects } from 'lib/algoliaUtils';
import { deleteUpload } from 'lib/assetUtils/assetUtils';
import { castAttributeForRubric } from 'lib/optionsUtils';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  AttributeModel,
  AttributesGroupModel,
  ProductAssetsModel,
  ProductAttributeModel,
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
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_ATTRIBUTES,
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
          const { db } = await getDatabase();
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
          const { db } = await getDatabase();
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
          const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
            { _id: rubricId },
            {
              $set: {
                ...values,
              },
            },
            {
              returnDocument: 'after',
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
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

        const session = client.startSession();

        let mutationPayload: RubricPayloadModel = {
          success: false,
          message: await getApiMessage('rubrics.delete.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'deleteRubric',
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

            // Check rubric availability
            const rubric = await rubricsCollection.findOne({ _id });
            if (!rubric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.delete.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete rubric products
            const removedShopProductsResult = await shopProductsCollection.deleteMany({
              rubricId: _id,
            });
            const removedProductsResult = await productsCollection.deleteMany({
              rubricId: _id,
            });
            if (!removedProductsResult.result.ok || !removedShopProductsResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.deleteProduct.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete rubric
            const removedRubricsResult = await rubricsCollection.deleteOne({
              _id,
            });
            if (!removedRubricsResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('rubrics.delete.success'),
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
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const rubricAttributesCollection =
          db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
        const attributesGroupsCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

        const session = client.startSession();

        let mutationPayload: RubricPayloadModel = {
          success: false,
          message: await getApiMessage('rubrics.addAttributesGroup.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateRubric',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            // Validate
            const validationSchema = await getResolverValidationSchema({
              context,
              schema: addAttributesGroupToRubricSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { rubricId, attributesGroupId } = input;

            // Check rubric and attributes group availability
            const attributesGroup = await attributesGroupsCollection.findOne({
              _id: attributesGroupId,
            });
            const rubric = await rubricsCollection.findOne({ _id: rubricId });
            if (!rubric || !attributesGroup) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.addAttributesGroup.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Create attributes
            const groupAttributes = await attributesCollection
              .find({
                _id: { $in: attributesGroup.attributesIds },
              })
              .toArray();

            if (groupAttributes.length < 1) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.addAttributesGroup.noAttributes'),
              };
              await session.abortTransaction();
              return;
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
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.addAttributesGroup.error'),
              };
              await session.abortTransaction();
              return;
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
              { returnDocument: 'after' },
            );

            const updatedRubric = updatedRubricResult.value;
            if (!updatedRubricResult.ok || !updatedRubric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.addAttributesGroup.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('rubrics.addAttributesGroup.success'),
              payload: updatedRubric,
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
          const { db } = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const rubricAttributesCollection =
            db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
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
          const { db } = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const rubricAttributesCollection =
            db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
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

    // Should toggle attribute in the rubric attribute showInProductAttributes field
    t.nonNull.field('toggleAttributeInProductAttributes', {
      type: 'RubricPayload',
      description: 'Should toggle attribute in the rubric attribute showInProductAttributes field',
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
          const { db } = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const rubricAttributesCollection =
            db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
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
                showInProductAttributes: !rubricAttribute.showInProductAttributes,
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
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const attributesGroupsCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
        const rubricAttributesCollection =
          db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
        const productAttributesCollection =
          db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);

        const session = client.startSession();

        let mutationPayload: RubricPayloadModel = {
          success: false,
          message: await getApiMessage('rubrics.deleteAttributesGroup.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateRubric',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            // Validate
            const validationSchema = await getResolverValidationSchema({
              context,
              schema: deleteAttributesGroupFromRubricSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { rubricId, attributesGroupId } = input;

            // Check rubric and attributes group availability
            const attributesGroup = await attributesGroupsCollection.findOne({
              _id: attributesGroupId,
            });
            const rubric = await rubricsCollection.findOne({ _id: rubricId });
            if (!rubric || !attributesGroup) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.deleteAttributesGroup.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete rubric attributes
            const removedRubricAttributesResult = await rubricAttributesCollection.deleteMany({
              attributesGroupId,
            });
            if (!removedRubricAttributesResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.deleteAttributesGroup.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete product attributes
            const removedProductAttributesResult = await productAttributesCollection.deleteMany({
              attributesGroupId,
              rubricId: rubric._id,
            });
            if (!removedProductAttributesResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.deleteAttributesGroup.error'),
              };
              await session.abortTransaction();
              return;
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
                returnDocument: 'after',
              },
            );
            const updatedRubric = updatedRubricResult.value;
            if (!updatedRubricResult.ok || !updatedRubric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.deleteAttributesGroup.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('rubrics.deleteAttributesGroup.success'),
              payload: updatedRubric,
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
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
        const productAttributesCollection =
          db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

        const session = client.startSession();

        let mutationPayload: RubricPayloadModel = {
          success: false,
          message: await getApiMessage(`rubrics.deleteProduct.error`),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'deleteProduct',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            // Validate
            const validationSchema = await getResolverValidationSchema({
              context,
              schema: deleteProductFromRubricSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { rubricId, productId } = input;

            // Check rubric and product availability
            const product = await productsCollection.findOne({
              _id: productId,
            });
            const rubric = await rubricsCollection.findOne({ _id: rubricId });
            if (!rubric || !product) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.deleteProduct.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete algolia product object
            const algoliaProductResult = await deleteAlgoliaObjects({
              indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
              objectIDs: [productId.toHexString()],
            });
            if (!algoliaProductResult) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`rubrics.deleteProduct.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Delete algolia shop product objects
            const shopProducts = await shopProductsCollection
              .find({
                productId,
              })
              .toArray();
            const shopProductIds: string[] = shopProducts.map(({ _id }) => _id.toHexString());
            const algoliaShopProductsResult = await deleteAlgoliaObjects({
              indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
              objectIDs: shopProductIds,
            });
            if (!algoliaShopProductsResult) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`rubrics.deleteProduct.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Delete product assets from cloud
            const productAssets = await productAssetsCollection
              .find({
                productId,
              })
              .toArray();
            for await (const productAsset of productAssets) {
              for await (const asset of productAsset.assets) {
                await deleteUpload({
                  filePath: asset.url,
                });
              }
            }
            // Delete product assets
            const removedProductAssetsResult = await productAssetsCollection.deleteMany({
              productId,
            });
            if (!removedProductAssetsResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`rubrics.deleteProduct.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Delete product attributes
            const removedProductAttributesResult = await productAttributesCollection.deleteMany({
              productId,
            });
            if (!removedProductAttributesResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`rubrics.deleteProduct.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Delete product
            const removedProductResult = await productsCollection.findOneAndDelete({
              _id: productId,
            });
            const removedShopProductResult = await shopProductsCollection.findOneAndDelete({
              productId,
            });
            if (!removedProductResult.ok || !removedShopProductResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`rubrics.deleteProduct.error`),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('rubrics.deleteProduct.success'),
              payload: rubric,
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
