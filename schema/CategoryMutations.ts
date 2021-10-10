import { getNextItemId } from 'lib/itemIdUtils';
import { deleteDocumentsTree, getParentTreeIds } from 'lib/optionsUtils';
import { checkCategorySeoTextUniqueness } from 'lib/textUniquenessUtils';
import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  AttributesGroupModel,
  ProductAttributeModel,
  ProductModel,
  CategoryModel,
  CategoryPayloadModel,
  ShopProductModel,
  RubricModel,
  ObjectIdModel,
} from 'db/dbModels';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES_GROUPS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCTS,
  COL_RUBRICS,
  COL_CATEGORIES,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
import { CATEGORY_SLUG_PREFIX, DEFAULT_COUNTERS_OBJECT } from 'config/common';
import {
  addAttributesGroupToCategorySchema,
  createCategorySchema,
  deleteAttributesGroupFromCategorySchema,
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
    t.json('textTopI18n');
    t.json('textBottomI18n');
    t.objectId('parentId');
    t.nonNull.objectId('rubricId');
    t.nonNull.json('variants');
    t.boolean('replaceParentNameInCatalogueTitle');
    t.field('gender', {
      type: 'Gender',
    });
  },
});

export const UpdateCategoryInput = inputObjectType({
  name: 'UpdateCategoryInput',
  definition(t) {
    t.nonNull.objectId('categoryId');
    t.nonNull.json('nameI18n');
    t.json('textTopI18n');
    t.json('textBottomI18n');
    t.nonNull.objectId('rubricId');
    t.nonNull.json('variants');
    t.boolean('replaceParentNameInCatalogueTitle');
    t.field('gender', {
      type: 'Gender',
    });
  },
});

export const AddAttributesGroupToCategoryInput = inputObjectType({
  name: 'AddAttributesGroupToCategoryInput',
  definition(t) {
    t.nonNull.objectId('categoryId');
    t.nonNull.objectId('attributesGroupId');
  },
});

export const DeleteAttributesGroupFromCategoryInput = inputObjectType({
  name: 'DeleteAttributesGroupFromCategoryInput',
  definition(t) {
    t.nonNull.objectId('categoryId');
    t.nonNull.objectId('attributesGroupId');
  },
});

export const UpdateAttributesGroupInCategoryInput = inputObjectType({
  name: 'UpdateAttributeInCategoryInput',
  definition(t) {
    t.nonNull.objectId('categoryId');
    t.nonNull.objectId('attributeId');
  },
});

export const DeleteProductFromCategoryInput = inputObjectType({
  name: 'DeleteProductFromCategoryInput',
  definition(t) {
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
            additionalQuery: input.parentId
              ? {
                  parentId: input.parentId,
                  rubricId: input.rubricId,
                }
              : {
                  rubricId: input.rubricId,
                },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('categories.create.duplicate'),
            };
          }

          // Get parent tree ids
          let parentTreeIds: ObjectIdModel[] = [];

          if (input.parentId) {
            parentTreeIds = await getParentTreeIds({
              _id: input.parentId,
              collectionName: COL_CATEGORIES,
              acc: [],
            });
          }

          // Create category
          const slug = await getNextItemId(COL_CATEGORIES);
          const createdCategoryId = new ObjectId();
          const createdCategoryResult = await categoriesCollection.insertOne({
            ...input,
            parentTreeIds: [...parentTreeIds, createdCategoryId],
            slug: `${CATEGORY_SLUG_PREFIX}${slug}`,
            attributesGroupIds: [],
            rubricSlug: rubric.slug,
            ...DEFAULT_COUNTERS_OBJECT,
          });
          if (!createdCategoryResult.acknowledged) {
            return {
              success: false,
              message: await getApiMessage('categories.create.error'),
            };
          }

          // check text uniqueness
          const createdCategory = await categoriesCollection.findOne({
            _id: createdCategoryResult.insertedId,
          });
          if (createdCategory) {
            await checkCategorySeoTextUniqueness({
              category: createdCategory,
              textTopI18n: input.textTopI18n,
              textBottomI18n: input.textBottomI18n,
            });
          }

          return {
            success: true,
            message: await getApiMessage('categories.create.success'),
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

          // check text uniqueness
          await checkCategorySeoTextUniqueness({
            category,
            textTopI18n: input.textTopI18n,
            textBottomI18n: input.textBottomI18n,
          });

          // Check if category already exist
          const exist = await findDocumentByI18nField<CategoryModel>({
            collectionName: COL_CATEGORIES,
            fieldArg: input.nameI18n,
            fieldName: 'nameI18n',
            additionalQuery: category.parentId
              ? {
                  _id: { $ne: categoryId },
                  parentId: category.parentId,
                  rubricId: category.rubricId,
                }
              : {
                  _id: { $ne: categoryId },
                  rubricId: category.rubricId,
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
            if (!removedProductsResult.acknowledged || !removedShopProductsResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('categories.deleteProduct.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete category
            const removedCategoriesResult = await deleteDocumentsTree({
              _id,
              collectionName: COL_CATEGORIES,
            });
            if (!removedCategoriesResult) {
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
        const attributesGroupsCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);

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

            // Check rubric availability
            const rubric = await rubricsCollection.findOne({
              _id: category.rubricId,
            });
            if (!rubric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.update.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // update category
            const updatedCategoryResult = await categoriesCollection.findOneAndUpdate(
              { _id: categoryId },
              {
                $addToSet: {
                  attributesGroupIds: attributesGroup._id,
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedCategory = updatedCategoryResult.value;
            if (!updatedCategoryResult.ok || !updatedCategory) {
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
              payload: updatedCategory,
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
        const attributesGroupsCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
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

            // Delete product attributes
            const removedProductAttributesResult = await productAttributesCollection.deleteMany({
              attributesGroupId,
              categoryId: category._id,
            });
            if (!removedProductAttributesResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('categories.deleteAttributesGroup.error'),
              };
              await session.abortTransaction();
              return;
            }

            // update category
            const updatedCategoryResult = await categoriesCollection.findOneAndUpdate(
              { _id: categoryId },
              {
                $pull: {
                  attributesGroupIds: attributesGroup._id,
                },
              },
            );
            const updatedCategory = updatedCategoryResult.value;
            if (!updatedCategoryResult.ok || !updatedCategory) {
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
              payload: updatedCategory,
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
