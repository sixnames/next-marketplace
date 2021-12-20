import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { SORT_ASC } from '../config/common';
import { COL_LANGUAGES } from '../db/collectionNames';
import { LanguageModel, LanguagePayloadModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../lib/sessionHelpers';
import { createLanguageSchema, updateLanguageSchema } from '../validation/languageSchema';

export const Language = objectType({
  name: 'Language',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.string('nativeName');
  },
});

// Language Queries
export const LanguageQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should all languages list
    t.nonNull.list.nonNull.field('getAllLanguages', {
      type: 'Language',
      description: 'Should all languages list',
      resolve: async (): Promise<LanguageModel[]> => {
        const { db } = await getDatabase();
        const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
        const languages = await languagesCollection
          .find(
            {},
            {
              sort: {
                itemId: SORT_ASC,
              },
            },
          )
          .toArray();
        return languages;
      },
    });
  },
});

export const LanguagePayload = objectType({
  name: 'LanguagePayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Language',
    });
  },
});

export const CreateLanguageInput = inputObjectType({
  name: 'CreateLanguageInput',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.string('nativeName');
  },
});

export const UpdateLanguageInput = inputObjectType({
  name: 'UpdateLanguageInput',
  definition(t) {
    t.nonNull.objectId('languageId');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.string('nativeName');
  },
});

// Language Mutations
export const LanguageMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create language
    t.nonNull.field('createLanguage', {
      type: 'LanguagePayload',
      description: 'Should create language',
      args: {
        input: nonNull(
          arg({
            type: 'CreateLanguageInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<LanguagePayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createLanguage',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          // Validate input
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createLanguageSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
          const { input } = args;

          // Check if language already exist
          const exist = await languagesCollection.findOne({
            $or: [{ name: input.name }, { slug: input.slug }],
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('languages.create.duplicate'),
            };
          }

          // Create language
          const createdLanguageResult = await languagesCollection.insertOne({
            ...input,
          });
          if (!createdLanguageResult.acknowledged) {
            return {
              success: false,
              message: await getApiMessage('languages.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('languages.create.success'),
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update language
    t.nonNull.field('updateLanguage', {
      type: 'LanguagePayload',
      description: 'Should update language',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateLanguageInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<LanguagePayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateLanguage',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          // Validate input
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateLanguageSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
          const { input } = args;
          const { languageId, ...values } = input;

          // Check language availability
          const language = await languagesCollection.findOne({ _id: languageId });
          if (!language) {
            return {
              success: false,
              message: await getApiMessage('languages.update.error'),
            };
          }

          // Check if language already exist
          const exist = await languagesCollection.findOne({
            _id: { $ne: languageId },
            $or: [{ name: input.name }, { slug: input.slug }],
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('languages.update.duplicate'),
            };
          }

          // Update language
          const updatedLanguageResult = await languagesCollection.findOneAndUpdate(
            {
              _id: languageId,
            },
            {
              $set: {
                ...values,
              },
            },
            {
              returnDocument: 'after',
            },
          );
          const updatedLanguage = updatedLanguageResult.value;
          if (!updatedLanguageResult.ok || !updatedLanguage) {
            return {
              success: false,
              message: await getApiMessage('languages.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('languages.update.success'),
            payload: updatedLanguage,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete language
    t.nonNull.field('deleteLanguage', {
      type: 'LanguagePayload',
      description: 'Should delete language',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<LanguagePayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deleteLanguage',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
          const { _id } = args;

          // Check language availability
          const language = await languagesCollection.findOne({ _id });
          if (!language) {
            return {
              success: false,
              message: await getApiMessage('languages.delete.error'),
            };
          }

          // Delete language
          const removedLanguageResult = await languagesCollection.findOneAndDelete({
            _id,
          });
          if (!removedLanguageResult.ok) {
            return {
              success: false,
              message: await getApiMessage('languages.delete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('languages.delete.success'),
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
