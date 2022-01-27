import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  CATEGORY_SLUG_PREFIX,
  CONFIG_VARIANT_CATEGORIES_TREE,
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
  FILTER_SEPARATOR,
} from '../config/common';
import {
  COL_ATTRIBUTES,
  COL_CATEGORIES,
  COL_COMPANIES,
  COL_CONFIGS,
  COL_RUBRICS,
} from '../db/collectionNames';
import { findDocumentByI18nField } from '../db/dao/findDocumentByI18nField';
import {
  AttributeModel,
  CategoryModel,
  CategoryPayloadModel,
  CompanyModel,
  ConfigModel,
  ObjectIdModel,
  RubricModel,
} from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';
import { getNextItemId } from '../lib/itemIdUtils';
import { updateCitiesSeoContent } from '../lib/seoContentUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../lib/sessionHelpers';
import { deleteDocumentsTree, getChildrenTreeIds, getParentTreeIds } from '../lib/treeUtils';
import { execUpdateProductTitles } from '../lib/updateProductTitles';
import { createCategorySchema, updateCategorySchema } from '../validation/categorySchema';

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

export const UpdateAttributesGroupInCategoryInput = inputObjectType({
  name: 'UpdateAttributeInCategoryInput',
  definition(t) {
    t.nonNull.objectId('categoryId');
    t.nonNull.objectId('attributesGroupId');
    t.nonNull.list.nonNull.objectId('attributeIds');
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
            _id: createdCategoryId,
            parentTreeIds: [...parentTreeIds, createdCategoryId],
            slug: `${CATEGORY_SLUG_PREFIX}${slug}`,
            cmsCardAttributeIds: [],
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
              const newConfig: ConfigModel = {
                _id: new ObjectId(),
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
          const { input } = args;
          const { categoryId, rubricId, textBottom, textTop, companySlug, ...values } = input;

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
            await updateCitiesSeoContent({
              seoContentsList: textTop,
              companySlug,
            });
          }
          if (textBottom) {
            await updateCitiesSeoContent({
              seoContentsList: textBottom,
              companySlug,
            });
          }

          // update product algolia indexes
          execUpdateProductTitles(`filterSlugs=${updatedCategory.slug}`);

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

    // Should toggle cms card attribute visibility
    t.nonNull.field('toggleCmsCardAttributeInCategory', {
      type: 'CategoryPayload',
      description: 'Should toggle cms card attribute visibility',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateAttributeInCategoryInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CategoryPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

        const session = client.startSession();

        let mutationPayload: CategoryPayloadModel = {
          success: false,
          message: await getApiMessage('categories.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // permission
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

            const { input } = args;
            const { categoryId, attributeIds, attributesGroupId } = input;

            // get category
            const category = await categoriesCollection.findOne({ _id: categoryId });
            if (!category) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('categories.update.notFound'),
              };
              await session.abortTransaction();
              return;
            }
            const categoryIds = await getChildrenTreeIds({
              _id: category._id,
              collectionName: COL_CATEGORIES,
              acc: [],
            });

            // get group attributes
            const groupAttributes = await attributesCollection
              .find({
                attributesGroupId,
              })
              .toArray();
            const groupAttributeIds = groupAttributes.map(({ _id }) => _id);

            // uncheck all
            if (attributeIds.length < 1) {
              const updatedCategoriesResult = await categoriesCollection.updateMany(
                {
                  _id: {
                    $in: categoryIds,
                  },
                },
                {
                  $pullAll: {
                    cmsCardAttributeIds: groupAttributeIds,
                  },
                },
              );
              if (!updatedCategoriesResult.acknowledged) {
                mutationPayload = {
                  success: false,
                  message: await getApiMessage('rubrics.update.error'),
                };
                await session.abortTransaction();
                return;
              }
              mutationPayload = {
                success: true,
                message: await getApiMessage('rubrics.update.success'),
              };
              await session.abortTransaction();
              return;
            }

            // check all
            if (attributeIds.length === groupAttributeIds.length && attributeIds.length !== 1) {
              const updatedCategoriesResult = await categoriesCollection.updateMany(
                {
                  _id: {
                    $in: categoryIds,
                  },
                },
                {
                  $addToSet: {
                    cmsCardAttributeIds: {
                      $each: groupAttributeIds,
                    },
                  },
                },
              );
              if (!updatedCategoriesResult.acknowledged) {
                mutationPayload = {
                  success: false,
                  message: await getApiMessage('rubrics.update.error'),
                };
                await session.abortTransaction();
                return;
              }
              mutationPayload = {
                success: true,
                message: await getApiMessage('rubrics.update.success'),
              };
              await session.abortTransaction();
              return;
            }

            // get attributes
            const categoryAttributes = groupAttributes.filter((attribute) => {
              return attributeIds.some((_id) => attribute._id.equals(_id));
            });
            let cmsCardAttributeIds = [...(category.cmsCardAttributeIds || [])];
            for await (const categoryAttribute of categoryAttributes) {
              const attributeId = categoryAttribute._id;
              const attributeExist = category.cmsCardAttributeIds?.some((_id) => {
                return _id.equals(attributeId);
              });
              if (attributeExist) {
                cmsCardAttributeIds = cmsCardAttributeIds.filter((_id) => {
                  return !_id.equals(attributeId);
                });
              } else {
                cmsCardAttributeIds.push(attributeId);
              }
            }
            const updatedCategoriesResult = await categoriesCollection.updateMany(
              {
                _id: {
                  $in: categoryIds,
                },
              },
              {
                $set: {
                  cmsCardAttributeIds,
                },
              },
            );
            // if (!updatedCategoryResult.ok) {
            if (!updatedCategoriesResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('categories.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            const updatedCategory = await categoriesCollection.findOne({
              _id: category._id,
            });

            mutationPayload = {
              success: true,
              message: await getApiMessage('categories.update.success'),
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
