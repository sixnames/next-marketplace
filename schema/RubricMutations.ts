import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { DEFAULT_COUNTERS_OBJECT } from '../config/common';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_CATEGORIES,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_FACETS,
  COL_PRODUCT_SUMMARIES,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from '../db/collectionNames';
import { findDocumentByI18nField } from '../db/dao/findDocumentByI18nField';
import {
  AttributeModel,
  AttributesGroupModel,
  CategoryModel,
  ProductSummaryAttributeModel,
  ProductFacetModel,
  ProductSummaryModel,
  RubricModel,
  RubricPayloadModel,
  ShopProductModel,
} from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';
import { updateCitiesSeoContent } from '../lib/seoContentUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../lib/sessionHelpers';
import { generateDefaultLangSlug } from '../lib/slugUtils';
import { execUpdateProductTitles } from '../lib/updateProductTitles';
import {
  addAttributesGroupToRubricSchema,
  createRubricSchema,
  deleteAttributesGroupFromRubricSchema,
  updateRubricSchema,
} from '../validation/rubricSchema';

export const RubricPayload = objectType({
  name: 'RubricPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Rubric',
    });
  },
});

export const CreateRubricInput = inputObjectType({
  name: 'CreateRubricInput',
  definition(t) {
    t.nonNull.json('nameI18n');
    t.boolean('capitalise');
    t.boolean('showRubricNameInProductTitle');
    t.boolean('showCategoryInProductTitle');
    t.boolean('showBrandInNav');
    t.boolean('showBrandInFilter');
    t.boolean('showBrandAsAlphabet');
    t.nonNull.json('descriptionI18n');
    t.nonNull.json('shortDescriptionI18n');
    t.nonNull.objectId('variantId');
    t.nonNull.json('defaultTitleI18n');
    t.json('prefixI18n');
    t.nonNull.json('keywordI18n');
    t.nonNull.field('gender', {
      type: 'Gender',
    });
  },
});

export const UpdateRubricInput = inputObjectType({
  name: 'UpdateRubricInput',
  definition(t) {
    t.nonNull.string('companySlug');
    t.nonNull.objectId('rubricId');
    t.boolean('capitalise');
    t.boolean('showRubricNameInProductTitle');
    t.boolean('showCategoryInProductTitle');
    t.boolean('showBrandInNav');
    t.boolean('showBrandInFilter');
    t.boolean('showBrandAsAlphabet');
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
    t.nonNull.json('shortDescriptionI18n');
    t.json('textTop');
    t.json('textBottom');
    t.nonNull.objectId('variantId');
    t.nonNull.boolean('active');
    t.nonNull.json('defaultTitleI18n');
    t.json('prefixI18n');
    t.nonNull.json('keywordI18n');
    t.nonNull.field('gender', {
      type: 'Gender',
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

export const UpdateAttributeInRubricInput = inputObjectType({
  name: 'UpdateAttributeInRubricInput',
  definition(t) {
    t.nonNull.objectId('rubricId');
    t.nonNull.objectId('attributesGroupId');
    t.nonNull.list.nonNull.objectId('attributeIds');
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
            attributesGroupIds: [],
            filterVisibleAttributeIds: [],
            cmsCardAttributeIds: [],
            ...DEFAULT_COUNTERS_OBJECT,
          });
          const createdRubric = await rubricsCollection.findOne({
            _id: createdRubricResult.insertedId,
          });
          if (!createdRubricResult.acknowledged || !createdRubric) {
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
          const { rubricId, textTop, textBottom, companySlug, ...values } = input;

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

          // update rubric
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

          // update product titles
          execUpdateProductTitles(`rubricSlug=${updatedRubric.slug}`);

          return {
            success: true,
            message: await getApiMessage('rubrics.update.success'),
            payload: updatedRubric,
          };
        } catch (e) {
          console.log(e);
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
        const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
        const productSummariesCollection =
          db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);

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
            const removedFacetsResult = await productFacetsCollection.deleteMany({
              rubricId: _id,
            });
            const removedSummariesResult = await productSummariesCollection.deleteMany({
              rubricId: _id,
            });
            if (
              !removedFacetsResult.acknowledged ||
              !removedSummariesResult.acknowledged ||
              !removedShopProductsResult.acknowledged
            ) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.deleteProduct.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete categories
            await categoriesCollection.deleteMany({
              rubricId: rubric._id,
            });

            // Delete rubric
            const removedRubricsResult = await rubricsCollection.deleteOne({
              _id,
            });
            if (!removedRubricsResult.acknowledged) {
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
        const attributesGroupsCollection =
          db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);

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

            // update rubric
            const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
              { _id: rubricId },
              {
                $addToSet: {
                  attributesGroupIds: attributesGroup._id,
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
                message: await getApiMessage('rubrics.addAttributesGroup.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('rubrics.addAttributesGroup.success'),
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
        const productAttributesCollection =
          db.collection<ProductSummaryAttributeModel>(COL_PRODUCT_ATTRIBUTES);

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

            // Delete product attributes
            const removedProductAttributesResult = await productAttributesCollection.deleteMany({
              attributesGroupId,
              rubricId: rubric._id,
            });
            if (!removedProductAttributesResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.deleteAttributesGroup.error'),
              };
              await session.abortTransaction();
              return;
            }

            // update rubric
            const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
              { _id: rubricId },
              {
                $pull: {
                  attributesGroupIds: attributesGroup._id,
                },
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

    // Should update rubric attribute
    t.nonNull.field('updateAttributeInRubric', {
      type: 'RubricPayload',
      description: 'Should update rubric attribute',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateAttributeInRubricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const { input } = args;
          const { rubricId, attributeIds, attributesGroupId } = input;

          // permission
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

          // get rubric
          const rubric = await rubricsCollection.findOne({ _id: rubricId });
          if (!rubric) {
            return {
              success: false,
              message: await getApiMessage('rubrics.update.notFound'),
            };
          }

          // get group attributes
          const groupAttributes = await attributesCollection
            .find({
              attributesGroupId,
            })
            .toArray();
          const groupAttributeIds = groupAttributes.map(({ _id }) => _id);

          // uncheck all
          if (attributeIds.length < 1) {
            const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
              { _id: rubricId },
              {
                $pullAll: {
                  filterVisibleAttributeIds: groupAttributeIds,
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
          }

          // check all
          if (attributeIds.length === groupAttributeIds.length && attributeIds.length !== 1) {
            const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
              { _id: rubricId },
              {
                $addToSet: {
                  filterVisibleAttributeIds: {
                    $each: groupAttributeIds,
                  },
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
          }

          // get attributes
          const rubricAttributes = groupAttributes.filter((attribute) => {
            return attributeIds.some((_id) => attribute._id.equals(_id));
          });

          let filterVisibleAttributeIds = [...(rubric.filterVisibleAttributeIds || [])];
          for await (const rubricAttribute of rubricAttributes) {
            const attributeId = rubricAttribute._id;
            const attributeExist = rubric.filterVisibleAttributeIds?.some((_id) => {
              return _id.equals(attributeId);
            });
            if (attributeExist) {
              filterVisibleAttributeIds = filterVisibleAttributeIds.filter((_id) => {
                return !_id.equals(attributeId);
              });
            } else {
              filterVisibleAttributeIds.push(attributeId);
            }
          }

          const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
            { _id: rubricId },
            {
              $set: {
                filterVisibleAttributeIds,
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
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should toggle cms card attribute visibility
    t.nonNull.field('toggleCmsCardAttributeInRubric', {
      type: 'RubricPayload',
      description: 'Should toggle cms card attribute visibility',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateAttributeInRubricInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

        const session = client.startSession();

        let mutationPayload: RubricPayloadModel = {
          success: false,
          message: await getApiMessage('rubrics.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // permission
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

            const { input } = args;
            const { rubricId, attributeIds, attributesGroupId } = input;

            // get rubric
            const rubric = await rubricsCollection.findOne({ _id: rubricId });
            if (!rubric) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('rubrics.update.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // get group attributes
            const groupAttributes = await attributesCollection
              .find({
                attributesGroupId,
              })
              .toArray();
            const groupAttributeIds = groupAttributes.map(({ _id }) => _id);

            // uncheck all
            if (attributeIds.length < 1) {
              const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
                { _id: rubricId },
                {
                  $pullAll: {
                    cmsCardAttributeIds: groupAttributeIds,
                  },
                },
                {
                  returnDocument: 'after',
                },
              );
              const updatedCategoriesResult = await categoriesCollection.updateMany(
                {
                  rubricId: rubric._id,
                },
                {
                  $pullAll: {
                    cmsCardAttributeIds: groupAttributeIds,
                  },
                },
              );
              const updatedRubric = updatedRubricResult.value;
              if (
                !updatedRubricResult.ok ||
                !updatedCategoriesResult.acknowledged ||
                !updatedRubric
              ) {
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
              const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
                { _id: rubricId },
                {
                  $addToSet: {
                    cmsCardAttributeIds: {
                      $each: groupAttributeIds,
                    },
                  },
                },
                {
                  returnDocument: 'after',
                },
              );
              const updatedCategoriesResult = await categoriesCollection.updateMany(
                {
                  rubricId: rubric._id,
                },
                {
                  $addToSet: {
                    cmsCardAttributeIds: {
                      $each: groupAttributeIds,
                    },
                  },
                },
              );
              const updatedRubric = updatedRubricResult.value;
              if (
                !updatedRubricResult.ok ||
                !updatedCategoriesResult.acknowledged ||
                !updatedRubric
              ) {
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
            const rubricAttributes = groupAttributes.filter((attribute) => {
              return attributeIds.some((_id) => attribute._id.equals(_id));
            });

            let cmsCardAttributeIds = [...(rubric.cmsCardAttributeIds || [])];
            for await (const rubricAttribute of rubricAttributes) {
              const attributeId = rubricAttribute._id;
              const attributeExist = rubric.cmsCardAttributeIds?.some((_id) => {
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

            const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
              { _id: rubricId },
              {
                $set: {
                  cmsCardAttributeIds,
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedCategoriesResult = await categoriesCollection.updateMany(
              {
                rubricId: rubric._id,
              },
              {
                $set: {
                  cmsCardAttributeIds,
                },
              },
            );
            const updatedRubric = updatedRubricResult.value;
            if (
              !updatedRubricResult.ok ||
              !updatedRubric ||
              !updatedCategoriesResult.acknowledged
            ) {
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
  },
});
