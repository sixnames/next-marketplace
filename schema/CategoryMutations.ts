import { deleteAlgoliaObjects } from 'lib/algoliaUtils';
import { deleteUpload } from 'lib/assetUtils/assetUtils';
import { castAttributeForRubric } from 'lib/optionsUtils';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  AttributeModel,
  AttributesGroupModel,
  ProductAssetsModel,
  ProductAttributeModel,
  ProductCardContentModel,
  ProductModel,
  RubricAttributeModel,
  CategoryModel,
  CategoryPayloadModel,
  ShopProductModel,
  RubricModel,
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
  COL_PRODUCT_CARD_CONTENTS,
  COL_PRODUCTS,
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRICS,
  COL_CATEGORIES,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import { DEFAULT_COUNTERS_OBJECT } from 'config/common';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import {
  addAttributesGroupToCategorySchema,
  createCategorySchema,
  deleteAttributesGroupFromCategorySchema,
  deleteProductFromCategorySchema,
  updateAttributesGroupInCategorySchema,
  updateCategorySchema,
} from 'validation/categorySchema';

export const CategoryPayload = objectType({
  name: 'CategoryPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Category',
    });
  },
});

export const CreateCategoryInput = inputObjectType({
  name: 'CreateCategoryInput',
  definition(t) {
    t.nonNull.json('nameI18n');
    t.objectId('parentId');
    t.boolean('capitalise');
    t.nonNull.json('descriptionI18n');
    t.nonNull.json('shortDescriptionI18n');
    t.nonNull.objectId('variantId');
    t.nonNull.objectId('rubricId');
    t.nonNull.field('catalogueTitle', {
      type: 'RubricCatalogueTitleInput',
    });
  },
});

export const UpdateCategoryInput = inputObjectType({
  name: 'UpdateCategoryInput',
  definition(t) {
    t.nonNull.objectId('rubricId');
    t.nonNull.objectId('categoryId');
    t.boolean('capitalise');
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

export const AddAttributesGroupToCategoryInput = inputObjectType({
  name: 'AddAttributesGroupToCategoryInput',
  definition(t) {
    t.nonNull.objectId('rubricId');
    t.nonNull.objectId('categoryId');
    t.nonNull.objectId('attributesGroupId');
  },
});

export const DeleteAttributesGroupFromCategoryInput = inputObjectType({
  name: 'DeleteAttributesGroupFromCategoryInput',
  definition(t) {
    t.nonNull.objectId('rubricId');
    t.nonNull.objectId('categoryId');
    t.nonNull.objectId('attributesGroupId');
  },
});

export const UpdateAttributesGroupInCategoryInput = inputObjectType({
  name: 'UpdateAttributeInCategoryInput',
  definition(t) {
    t.nonNull.objectId('rubricId');
    t.nonNull.objectId('categoryId');
    t.nonNull.objectId('attributeId');
  },
});

export const DeleteProductFromCategoryInput = inputObjectType({
  name: 'DeleteProductFromCategoryInput',
  definition(t) {
    t.nonNull.objectId('rubricId');
    t.nonNull.objectId('categoryId');
    t.nonNull.objectId('productId');
  },
});

export const CategoryMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create category
    t.nonNull.field('createCategory', {
      type: 'CategoryPayload',
      description: 'Should create category',
      args: {
        input: nonNull(
          arg({
            type: 'CreateCategoryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CategoryPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createCategory',
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
            schema: createCategorySchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const { input } = args;

          // Check rubric availability
          const rubric = await rubricsCollection.findOne({
            _id: input.rubricId,
          });
          if (!rubric) {
            return {
              success: false,
              message: await getApiMessage('categories.create.error'),
            };
          }

          // Check if category already exist
          const exist = await findDocumentByI18nField<CategoryModel>({
            collectionName: COL_CATEGORIES,
            fieldArg: input.nameI18n,
            fieldName: 'nameI18n',
            additionalQuery: {
              rubricId: input.rubricId,
            },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('categories.create.duplicate'),
            };
          }

          // Create category
          const slug = generateDefaultLangSlug(input.nameI18n);
          const createdCategoryResult = await categoriesCollection.insertOne({
            ...input,
            slug,
            rubricSlug: rubric.slug,
            active: true,
            ...DEFAULT_COUNTERS_OBJECT,
          });
          const createdCategory = createdCategoryResult.ops[0];
          if (!createdCategoryResult.result.ok || !createdCategory) {
            return {
              success: false,
              message: await getApiMessage('categories.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('categories.create.success'),
            payload: createdCategory,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update category
    t.nonNull.field('updateCategory', {
      type: 'CategoryPayload',
      description: 'Should update category',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateCategoryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CategoryPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateCategory',
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
            schema: updateCategorySchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const { input } = args;
          const { categoryId, rubricId, ...values } = input;

          // Check rubric availability
          const rubric = await rubricsCollection.findOne({
            _id: rubricId,
          });
          if (!rubric) {
            return {
              success: false,
              message: await getApiMessage('categories.update.error'),
            };
          }

          // Check category availability
          const category = await categoriesCollection.findOne({ _id: categoryId });
          if (!category) {
            return {
              success: false,
              message: await getApiMessage('categories.update.notFound'),
            };
          }

          // Check if category already exist
          const exist = await findDocumentByI18nField<CategoryModel>({
            collectionName: COL_CATEGORIES,
            fieldArg: input.nameI18n,
            fieldName: 'nameI18n',
            additionalQuery: {
              _id: { $ne: categoryId },
              rubricId,
            },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('categories.update.duplicate'),
            };
          }

          // Create category
          const updatedCategoryResult = await categoriesCollection.findOneAndUpdate(
            { _id: categoryId },
            {
              $set: {
                ...values,
              },
            },
            {
              returnDocument: 'after',
            },
          );
          const updatedCategory = updatedCategoryResult.value;
          if (!updatedCategoryResult.ok || !updatedCategory) {
            return {
              success: false,
              message: await getApiMessage('categories.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('categories.update.success'),
            payload: updatedCategory,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete category
    t.nonNull.field('deleteCategory', {
      type: 'CategoryPayload',
      description: 'Should delete category',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CategoryPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

        const session = client.startSession();

        let mutationPayload: CategoryPayloadModel = {
          success: false,
          message: await getApiMessage('categories.delete.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'deleteCategory',
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

            // Check category availability
            const category = await categoriesCollection.findOne({ _id });
            if (!category) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('categories.delete.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete category products
            const removedShopProductsResult = await shopProductsCollection.deleteMany({
              categoryId: _id,
            });
            const removedProductsResult = await productsCollection.deleteMany({
              categoryId: _id,
            });
            if (!removedProductsResult.result.ok || !removedShopProductsResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('categories.deleteProduct.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete category
            const removedCategorysResult = await categoriesCollection.deleteOne({
              _id,
            });
            if (!removedCategorysResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('categories.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('categories.delete.success'),
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

    // Should add attributes group to the category
    t.nonNull.field('addAttributesGroupToCategory', {
      type: 'CategoryPayload',
      description: 'Should add attributes group to the category',
      args: {
        input: nonNull(
          arg({
            type: 'AddAttributesGroupToCategoryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CategoryPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const categoryAttributesCollection =
          db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
        const attributesGroupsCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

        const session = client.startSession();

        let mutationPayload: CategoryPayloadModel = {
          success: false,
          message: await getApiMessage('categories.addAttributesGroup.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateCategory',
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
              schema: addAttributesGroupToCategorySchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { categoryId, attributesGroupId } = input;

            // Check rubric availability
            const rubric = await rubricsCollection.findOne({
              _id: input.rubricId,
            });
            if (!rubric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.update.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Check category and attributes group availability
            const attributesGroup = await attributesGroupsCollection.findOne({
              _id: attributesGroupId,
            });
            const category = await categoriesCollection.findOne({ _id: categoryId });
            if (!category || !attributesGroup) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('categories.addAttributesGroup.notFound'),
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
                message: await getApiMessage('categories.addAttributesGroup.noAttributes'),
              };
              await session.abortTransaction();
              return;
            }

            const categoryAttributes: RubricAttributeModel[] = [];
            for await (const attribute of groupAttributes) {
              const categoryAttribute = await castAttributeForRubric({
                attribute,
                rubricSlug: rubric.slug,
                rubricId: rubric._id,
                categoryId: category._id,
                categorySlug: category.slug,
              });
              categoryAttributes.push(categoryAttribute);
            }

            const createdAttributesResult = await categoryAttributesCollection.insertMany(
              categoryAttributes,
            );
            if (!createdAttributesResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('categories.addAttributesGroup.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('categories.addAttributesGroup.success'),
              payload: category,
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

    // Should toggle attribute in the category attribute showInCatalogueFilter field
    t.nonNull.field('toggleAttributeInCategoryCatalogue', {
      type: 'CategoryPayload',
      description: 'Should toggle attribute in the category attribute showInCatalogueFilter field',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateAttributeInCategoryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CategoryPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateCategory',
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
            schema: updateAttributesGroupInCategorySchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const categoryAttributesCollection =
            db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
          const { input } = args;
          const { categoryId, attributeId } = input;

          // Check rubric availability
          const rubric = await rubricsCollection.findOne({
            _id: input.rubricId,
          });
          if (!rubric) {
            return {
              success: false,
              message: await getApiMessage('rubrics.update.notFound'),
            };
          }

          // Check category and attribute availability
          const category = await categoriesCollection.findOne({ _id: categoryId });
          if (!category) {
            return {
              success: false,
              message: await getApiMessage('categories.updateAttributesGroup.notFound'),
            };
          }
          const categoryAttribute = await categoryAttributesCollection.findOne({
            _id: attributeId,
          });
          if (!categoryAttribute) {
            return {
              success: false,
              message: await getApiMessage('categories.updateAttributesGroup.notFound'),
            };
          }

          // Update category attribute
          const updatedCategoryAttributeResult =
            await categoryAttributesCollection.findOneAndUpdate(
              { _id: attributeId },
              {
                $set: {
                  showInCatalogueFilter: !categoryAttribute.showInCatalogueFilter,
                },
              },
            );
          if (!updatedCategoryAttributeResult.ok) {
            return {
              success: false,
              message: await getApiMessage('categories.updateAttributesGroup.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('categories.updateAttributesGroup.success'),
            payload: category,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should toggle attribute in the category attribute showInCatalogueNav field
    t.nonNull.field('toggleAttributeInCategoryNav', {
      type: 'CategoryPayload',
      description: 'Should toggle attribute in the category attribute showInCatalogueNav field',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateAttributeInCategoryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CategoryPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateCategory',
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
            schema: updateAttributesGroupInCategorySchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const categoryAttributesCollection =
            db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
          const { input } = args;
          const { categoryId, attributeId } = input;

          // Check rubric availability
          const rubric = await rubricsCollection.findOne({
            _id: input.rubricId,
          });
          if (!rubric) {
            return {
              success: false,
              message: await getApiMessage('rubrics.update.notFound'),
            };
          }

          // Check category and attribute availability
          const category = await categoriesCollection.findOne({ _id: categoryId });
          if (!category) {
            return {
              success: false,
              message: await getApiMessage('categories.updateAttributesGroup.notFound'),
            };
          }
          const categoryAttribute = await categoryAttributesCollection.findOne({
            _id: attributeId,
          });
          if (!categoryAttribute) {
            return {
              success: false,
              message: await getApiMessage('categories.updateAttributesGroup.notFound'),
            };
          }

          // Update category attribute
          const updatedCategoryAttributeResult =
            await categoryAttributesCollection.findOneAndUpdate(
              { _id: attributeId },
              {
                $set: {
                  showInCatalogueNav: !categoryAttribute.showInCatalogueNav,
                },
              },
            );
          if (!updatedCategoryAttributeResult.ok) {
            return {
              success: false,
              message: await getApiMessage('categories.updateAttributesGroup.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('categories.updateAttributesGroup.success'),
            payload: category,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should toggle attribute in the category attribute showInProductAttributes field
    t.nonNull.field('toggleAttributeInCategoryProductAttributes', {
      type: 'CategoryPayload',
      description:
        'Should toggle attribute in the category attribute showInProductAttributes field',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateAttributeInCategoryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CategoryPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateCategory',
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
            schema: updateAttributesGroupInCategorySchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const categoryAttributesCollection =
            db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
          const { input } = args;
          const { categoryId, attributeId } = input;

          // Check rubric availability
          const rubric = await rubricsCollection.findOne({
            _id: input.rubricId,
          });
          if (!rubric) {
            return {
              success: false,
              message: await getApiMessage('rubrics.update.notFound'),
            };
          }

          // Check category and attribute availability
          const category = await categoriesCollection.findOne({ _id: categoryId });
          if (!category) {
            return {
              success: false,
              message: await getApiMessage('categories.updateAttributesGroup.notFound'),
            };
          }
          const categoryAttribute = await categoryAttributesCollection.findOne({
            _id: attributeId,
          });
          if (!categoryAttribute) {
            return {
              success: false,
              message: await getApiMessage('categories.updateAttributesGroup.notFound'),
            };
          }

          // Update category attribute
          const updatedCategoryAttributeResult =
            await categoryAttributesCollection.findOneAndUpdate(
              { _id: attributeId },
              {
                $set: {
                  showInProductAttributes: !categoryAttribute.showInProductAttributes,
                },
              },
            );
          if (!updatedCategoryAttributeResult.ok) {
            return {
              success: false,
              message: await getApiMessage('categories.updateAttributesGroup.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('categories.updateAttributesGroup.success'),
            payload: category,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete attributes group from category
    t.nonNull.field('deleteAttributesGroupFromCategory', {
      type: 'CategoryPayload',
      description: 'Should delete attributes group from category',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteAttributesGroupFromCategoryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CategoryPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const attributesGroupsCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
        const categoryAttributesCollection =
          db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
        const productAttributesCollection =
          db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);

        const session = client.startSession();

        let mutationPayload: CategoryPayloadModel = {
          success: false,
          message: await getApiMessage('categories.deleteAttributesGroup.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateCategory',
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
              schema: deleteAttributesGroupFromCategorySchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { categoryId, attributesGroupId } = input;

            // Check rubric availability
            const rubric = await rubricsCollection.findOne({
              _id: input.rubricId,
            });
            if (!rubric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.update.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Check category and attributes group availability
            const attributesGroup = await attributesGroupsCollection.findOne({
              _id: attributesGroupId,
            });
            const category = await categoriesCollection.findOne({ _id: categoryId });
            if (!category || !attributesGroup) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('categories.deleteAttributesGroup.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete category attributes
            const removedCategoryAttributesResult = await categoryAttributesCollection.deleteMany({
              attributesGroupId,
            });
            if (!removedCategoryAttributesResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('categories.deleteAttributesGroup.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete product attributes
            const removedProductAttributesResult = await productAttributesCollection.deleteMany({
              attributesGroupId,
              categoryId: category._id,
            });
            if (!removedProductAttributesResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('categories.deleteAttributesGroup.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('categories.deleteAttributesGroup.success'),
              payload: category,
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

    // Should remove product from the category
    t.nonNull.field('deleteProductFromCategory', {
      type: 'CategoryPayload',
      description: 'Should remove product from category',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteProductFromCategoryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CategoryPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
        const productAttributesCollection =
          db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const productCardContentsCollection =
          db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);

        const session = client.startSession();

        let mutationPayload: CategoryPayloadModel = {
          success: false,
          message: await getApiMessage(`categories.deleteProduct.error`),
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
              schema: deleteProductFromCategorySchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { categoryId, productId } = input;

            // Check rubric availability
            const rubric = await rubricsCollection.findOne({
              _id: input.rubricId,
            });
            if (!rubric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.update.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Check category and product availability
            const product = await productsCollection.findOne({
              _id: productId,
            });
            const category = await categoriesCollection.findOne({ _id: categoryId });
            if (!category || !product) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('categories.deleteProduct.notFound'),
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
                message: await getApiMessage(`categories.deleteProduct.error`),
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
                message: await getApiMessage(`categories.deleteProduct.error`),
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
                message: await getApiMessage(`categories.deleteProduct.error`),
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
                message: await getApiMessage(`categories.deleteProduct.error`),
              };
              await session.abortTransaction();
              return;
            }

            // Delete product card content assets from cloud
            const productCardContents = await productCardContentsCollection
              .find({
                productId,
              })
              .toArray();
            for await (const productCardContent of productCardContents) {
              for await (const filePath of productCardContent.assetKeys) {
                await deleteUpload({
                  filePath,
                });
              }
            }

            // Delete product card content
            const removedProductCardContents = await productCardContentsCollection.deleteMany({
              productId,
            });
            if (!removedProductCardContents.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`categories.deleteProduct.error`),
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
                message: await getApiMessage(`categories.deleteProduct.error`),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('categories.deleteProduct.success'),
              payload: category,
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
