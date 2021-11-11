import { DEFAULT_COMPANY_SLUG, SORT_ASC } from 'config/common';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { RubricModel, RubricVariantModel, RubricVariantPayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_RUBRIC_VARIANTS, COL_RUBRICS } from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
import {
  createRubricVariantSchema,
  updateRubricVariantSchema,
} from 'validation/rubricVariantSchema';

export const RubricVariant = objectType({
  name: 'RubricVariant',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.string('slug');
    t.nonNull.string('companySlug');

    // layouts
    t.string('cardLayout');
    t.string('gridSnippetLayout');
    t.string('rowSnippetLayout');
    t.string('catalogueFilterLayout');
    t.string('catalogueHeadLayout');
    t.string('catalogueNavLayout');

    // booleans
    t.boolean('showSnippetConnections');
    t.boolean('showSnippetBackground');
    t.boolean('showSnippetArticle');
    t.boolean('showSnippetRating');
    t.boolean('showSnippetButtonsOnHover');
    t.boolean('showCardButtonsBackground');
    t.boolean('showCardImagesSlider');
    t.boolean('showCardBrands');
    t.boolean('showCatalogueFilterBrands');
    t.boolean('showCategoriesInFilter');
    t.boolean('showCategoriesInNav');

    // numbers
    t.int('gridCatalogueColumns');

    // RubricVariant name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });
  },
});

// RubricVariant Queries
export const RubricVariantQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return rubric variant by given id
    t.nonNull.field('getRubricVariant', {
      type: 'RubricVariant',
      description: 'Should return rubric variant by given id',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args): Promise<RubricVariantModel> => {
        const { db } = await getDatabase();
        const rubricVariantsCollection = db.collection<RubricVariantModel>(COL_RUBRIC_VARIANTS);
        const rubricVariant = await rubricVariantsCollection.findOne({ _id: args._id });
        if (!rubricVariant) {
          throw Error('Rubric variant not found by given id');
        }
        return rubricVariant;
      },
    });

    // Should return rubric variants list
    t.nonNull.list.nonNull.field('getAllRubricVariants', {
      type: 'RubricVariant',
      description: 'Should return rubric variants list',
      resolve: async (): Promise<RubricVariantModel[]> => {
        const { db } = await getDatabase();
        const rubricVariantsCollection = db.collection<RubricVariantModel>(COL_RUBRIC_VARIANTS);
        const rubricVariants = await rubricVariantsCollection
          .aggregate<RubricVariantModel>([
            {
              $addFields: {
                index: {
                  $cond: {
                    if: {
                      $eq: ['$slug', DEFAULT_COMPANY_SLUG],
                    },
                    then: 0,
                    else: 1,
                  },
                },
              },
            },
            {
              $sort: {
                index: SORT_ASC,
              },
            },
          ])
          .toArray();
        return rubricVariants;
      },
    });
  },
});

export const RubricVariantPayload = objectType({
  name: 'RubricVariantPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'RubricVariant',
    });
  },
});

export const CreateRubricVariantInput = inputObjectType({
  name: 'CreateRubricVariantInput',
  definition(t) {
    t.nonNull.json('nameI18n');
    t.nonNull.string('companySlug');
  },
});

export const UpdateRubricVariantInput = inputObjectType({
  name: 'UpdateRubricVariantInput',
  definition(t) {
    t.nonNull.objectId('rubricVariantId');
    t.nonNull.json('nameI18n');

    // layouts
    t.string('cardLayout');
    t.string('gridSnippetLayout');
    t.string('rowSnippetLayout');
    t.string('catalogueFilterLayout');
    t.string('catalogueHeadLayout');
    t.string('catalogueNavLayout');

    // booleans
    t.boolean('showSnippetConnections');
    t.boolean('showSnippetBackground');
    t.boolean('showSnippetArticle');
    t.boolean('showCardArticle');
    t.boolean('showSnippetRating');
    t.boolean('showSnippetButtonsOnHover');
    t.boolean('showCardButtonsBackground');
    t.boolean('showCardImagesSlider');
    t.boolean('showCardBrands');
    t.boolean('showCatalogueFilterBrands');
    t.boolean('showCategoriesInFilter');
    t.boolean('showCategoriesInNav');

    // numbers
    t.int('gridCatalogueColumns');

    // strings
    t.json('cardBrandsLabelI18n');
  },
});

// RubricVariant Mutations
export const RubricVariantMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create rubric variant
    t.nonNull.field('createRubricVariant', {
      type: 'RubricVariantPayload',
      description: 'Should create rubric variant',
      args: {
        input: nonNull(
          arg({
            type: 'CreateRubricVariantInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricVariantPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createRubricVariant',
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
            schema: createRubricVariantSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const rubricVariantsCollection = db.collection<RubricVariantModel>(COL_RUBRIC_VARIANTS);
          const { input } = args;

          // Check if rubric variant already exist
          const exist = await findDocumentByI18nField<RubricVariantModel>({
            collectionName: COL_RUBRIC_VARIANTS,
            fieldName: 'nameI18n',
            fieldArg: input.nameI18n,
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('rubricVariants.create.duplicate'),
            };
          }

          // Create rubric variant
          const slug = generateDefaultLangSlug(input.nameI18n);
          const createdRubricVariantResult = await rubricVariantsCollection.insertOne({
            ...input,
            slug,
          });
          if (!createdRubricVariantResult.acknowledged) {
            return {
              success: false,
              message: await getApiMessage('rubricVariants.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('rubricVariants.create.success'),
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update rubric variant
    t.nonNull.field('updateRubricVariant', {
      type: 'RubricVariantPayload',
      description: 'Should update rubric variant',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateRubricVariantInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricVariantPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateRubricVariant',
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
            schema: updateRubricVariantSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const rubricVariantsCollection = db.collection<RubricVariantModel>(COL_RUBRIC_VARIANTS);
          const { input } = args;
          const { rubricVariantId, ...values } = input;

          // Check if rubric variant already exist
          const exist = await findDocumentByI18nField<RubricVariantModel>({
            collectionName: COL_RUBRIC_VARIANTS,
            fieldName: 'nameI18n',
            fieldArg: input.nameI18n,
            additionalQuery: { _id: { $ne: rubricVariantId } },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('rubricVariants.update.duplicate'),
            };
          }

          // Update rubric variant
          const updatedRubricVariantResult = await rubricVariantsCollection.findOneAndUpdate(
            { _id: rubricVariantId },
            {
              $set: {
                ...values,
              },
            },
            {
              returnDocument: 'after',
            },
          );
          const updatedRubricVariant = updatedRubricVariantResult.value;
          if (!updatedRubricVariantResult.ok || !updatedRubricVariant) {
            return {
              success: false,
              message: await getApiMessage('rubricVariants.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('rubricVariants.update.success'),
            payload: updatedRubricVariant,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete rubric variant
    t.nonNull.field('deleteRubricVariant', {
      type: 'RubricVariantPayload',
      description: 'Should delete rubric variant',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RubricVariantPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deleteRubricVariant',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const rubricVariantsCollection = db.collection<RubricVariantModel>(COL_RUBRIC_VARIANTS);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const { _id } = args;

          // Check if rubric variant is used in rubrics
          const used = await rubricsCollection.findOne({ variantId: _id });
          if (used) {
            return {
              success: false,
              message: await getApiMessage('rubricVariants.delete.used'),
            };
          }

          // Delete rubric variant
          const updatedRubricVariantResult = await rubricVariantsCollection.findOneAndDelete({
            _id,
          });
          const updatedRubricVariant = updatedRubricVariantResult.value;
          if (!updatedRubricVariantResult.ok || !updatedRubricVariant) {
            return {
              success: false,
              message: await getApiMessage('rubricVariants.delete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('rubricVariants.delete.success'),
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
