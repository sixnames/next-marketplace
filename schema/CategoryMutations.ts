import { deleteUpload } from 'lib/assetUtils/assetUtils';
import { getNextItemId } from 'lib/itemIdUtils';
import { deleteDocumentsTree, getParentTreeIds } from 'lib/optionsUtils';
import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  AttributesGroupModel,
  ProductAttributeModel,
  CategoryModel,
  CategoryPayloadModel,
  RubricModel,
  ObjectIdModel,
  CategoryDescriptionModel,
  CompanyModel,
  ConfigModel,
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
  COL_RUBRICS,
  COL_CATEGORIES,
  COL_CATEGORY_DESCRIPTIONS,
  COL_COMPANIES,
  COL_CONFIGS,
} from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
import {
  CATEGORY_SLUG_PREFIX,
  CONFIG_VARIANT_CATEGORIES_TREE,
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
  FILTER_SEPARATOR,
} from 'config/common';
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
    t.nonNull.string('companySlug');
    t.nonNull.objectId('categoryId');
    t.nonNull.json('nameI18n');
    t.json('textTop');
    t.json('textBottom');
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
          const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
          const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
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
          if (!createdCategory) {
            return {
              success: false,
              message: await getApiMessage('categories.create.error'),
            };
          }

          // update company configs with new category
          const companies = await companiesCollection
            .find(
              {},
              {
                projection: {
                  slug: true,
                },
              },
            )
            .toArray();
          const companySlugs = companies.reduce(
            (acc: string[], { slug }) => {
              return [...acc, slug];
            },
            [DEFAULT_COMPANY_SLUG],
          );
          for await (const companySlug of companySlugs) {
            const configSlug = 'visibleCategoriesInNavDropdown';
            const configValue = `${rubric._id}${FILTER_SEPARATOR}${createdCategory._id}`;

            const config = await configsCollection.findOne({
              slug: configSlug,
              companySlug,
            });

            if (!config) {
              const newConfig = {
                companySlug,
                group: 'ui',
                variant: CONFIG_VARIANT_CATEGORIES_TREE,
                slug: configSlug,
                name: 'Видимые категории в выпадающем меню и шапке каталога',
                multi: false,
                acceptedFormats: [],
                cities: {
                  [DEFAULT_CITY]: {
                    [DEFAULT_LOCALE]: [configValue],
                  },
                },
              };
              await configsCollection.insertOne(newConfig);
              continue;
            }

            await configsCollection.findOneAndUpdate(
              {
                _id: config._id,
              },
              {
                $push: {
                  [`cities.${DEFAULT_CITY}.${DEFAULT_LOCALE}`]: configValue,
                },
              },
            );
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
          const categoryDescriptionsCollection =
            db.collection<CategoryDescriptionModel>(COL_CATEGORY_DESCRIPTIONS);
          const { input } = args;
          const { categoryId, rubricId, companySlug, textTop, textBottom, ...values } = input;

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

          // update category
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

          // update seo text
          if (textTop) {
            const topText = await categoryDescriptionsCollection.findOne({
              companySlug,
              position: 'top',
              categoryId: updatedCategory._id,
            });

            if (!topText) {
              await categoryDescriptionsCollection.insertOne({
                companySlug,
                position: 'top',
                categoryId: updatedCategory._id,
                categorySlug: updatedCategory.slug,
                content: textTop || {},
                assetKeys: [],
              });
            } else {
              await categoryDescriptionsCollection.findOneAndUpdate(
                {
                  _id: topText._id,
                },
                {
                  $set: {
                    content: textTop || {},
                  },
                },
              );
            }
          }
          if (textBottom) {
            const topBottom = await categoryDescriptionsCollection.findOne({
              companySlug,
              position: 'bottom',
              categoryId: updatedCategory._id,
            });

            if (!topBottom) {
              await categoryDescriptionsCollection.insertOne({
                companySlug,
                position: 'bottom',
                categoryId: updatedCategory._id,
                categorySlug: updatedCategory.slug,
                content: textBottom || {},
                assetKeys: [],
              });
            } else {
              await categoryDescriptionsCollection.findOneAndUpdate(
                {
                  _id: topBottom._id,
                },
                {
                  $set: {
                    content: textBottom || {},
                  },
                },
              );
            }
          }

          // update seo text
          if (textTop) {
            await categoryDescriptionsCollection.findOneAndUpdate(
              {
                companySlug,
                position: 'top',
                categoryId: updatedCategory._id,
              },
              {
                $set: {
                  companySlug,
                  position: 'top',
                  categoryId: updatedCategory._id,
                  categorySlug: updatedCategory.slug,
                  textI18n: textTop || {},
                },
              },
              {
                upsert: true,
              },
            );
          }
          if (textBottom) {
            await categoryDescriptionsCollection.findOneAndUpdate(
              {
                companySlug,
                position: 'bottom',
                categoryId: updatedCategory._id,
              },
              {
                $set: {
                  companySlug,
                  position: 'bottom',
                  categoryId: updatedCategory._id,
                  categorySlug: updatedCategory.slug,
                  textI18n: textBottom || {},
                },
              },
              {
                upsert: true,
              },
            );
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
        const categoryDescriptionsCollection =
          db.collection<CategoryDescriptionModel>(COL_CATEGORY_DESCRIPTIONS);

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

            // Delete descriptions
            const descriptions = await categoryDescriptionsCollection
              .find({
                categoryId: category._id,
              })
              .toArray();
            for await (const description of descriptions) {
              for await (const filePath of description.assetKeys) {
                await deleteUpload(filePath);
              }
            }
            await categoryDescriptionsCollection.deleteMany({
              categoryId: category._id,
            });

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
