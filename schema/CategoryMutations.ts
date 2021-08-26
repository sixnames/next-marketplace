import { getNextItemId } from 'lib/itemIdUtils';
import { castAttributeForRubric, deleteDocumentsTree, getParentTreeIds } from 'lib/optionsUtils';
import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  AttributeModel,
  AttributesGroupModel,
  ProductAttributeModel,
  ProductModel,
  RubricAttributeModel,
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
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCTS,
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRICS,
  COL_CATEGORIES,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import { CATEGORY_SLUG_PREFIX, DEFAULT_COUNTERS_OBJECT } from 'config/common';
import {
  addAttributesGroupToCategorySchema,
  createCategorySchema,
  deleteAttributesGroupFromCategorySchema,
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
    t.nonNull.objectId('rubricId');
    t.nonNull.json('variants');
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
    t.nonNull.objectId('rubricId');
    t.nonNull.json('variants');
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
            rubricSlug: rubric.slug,
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
        const rubricAttributesCollection =
          db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);

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

            // Delete rubric attributes
            const removedRubricAttributes = await rubricAttributesCollection.deleteMany({
              categoryId: category._id,
            });
            if (!removedRubricAttributes.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('categories.delete.error'),
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
          const categoryAttributesCollection =
            db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
          const { input } = args;
          const { categoryId, attributeId } = input;

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
          const categoryAttributesCollection =
            db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
          const { input } = args;
          const { categoryId, attributeId } = input;

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
          const categoryAttributesCollection =
            db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
          const { input } = args;
          const { categoryId, attributeId } = input;

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
        const attributesGroupsCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
        const rubricAttributesCollection =
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
            const removedCategoryAttributesResult = await rubricAttributesCollection.deleteMany({
              attributesGroupId,
              categoryId,
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
  },
});
