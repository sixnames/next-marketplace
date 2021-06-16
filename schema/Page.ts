import { PAGE_EDITOR_DEFAULT_VALUE, PAGE_STATE_DRAFT, PAGE_STATE_ENUMS } from 'config/common';
import { COL_PAGES } from 'db/collectionNames';
import { PageModel, PagePayloadModel } from 'db/dbModels';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import { getDatabase } from 'db/mongodb';
import { deleteUpload } from 'lib/assets';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { arg, enumType, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { createPageSchema, updatePageSchema } from 'validation/pagesSchema';

export const PageState = enumType({
  name: 'PageState',
  members: PAGE_STATE_ENUMS,
  description: 'Page state enum.',
});

export const Page = objectType({
  name: 'Page',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.int('index');
    t.nonNull.string('slug');
    t.nonNull.string('citySlug');
    t.nonNull.string('content');
    t.nonNull.objectId('pagesGroupId');
    t.nonNull.list.nonNull.string('assetKeys');
    t.nonNull.field('state', {
      type: 'PageState',
    });

    // Page name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });
  },
});

export const CreatePageInput = inputObjectType({
  name: 'CreatePageInput',
  definition(t) {
    t.nonNull.json('nameI18n');
    t.nonNull.int('index');
    t.nonNull.objectId('pagesGroupId');
    t.nonNull.string('citySlug');
  },
});

export const UpdatePageInput = inputObjectType({
  name: 'UpdatePageInput',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.int('index');
    t.nonNull.objectId('pagesGroupId');
    t.nonNull.string('citySlug');
    t.nonNull.string('content');
    t.nonNull.field('state', {
      type: 'PageState',
    });
  },
});

export const PagePayload = objectType({
  name: 'PagePayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Page',
    });
  },
});

export const PageMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should crate page
    t.nonNull.field('createPage', {
      type: 'PagePayload',
      description: 'Should crate page',
      args: {
        input: nonNull(
          arg({
            type: 'CreatePageInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<PagePayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createPage',
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
            schema: createPageSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const pagesCollection = db.collection<PageModel>(COL_PAGES);
          const { input } = args;

          // Check if page already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_PAGES,
            fieldName: 'nameI18n',
            fieldArg: input.nameI18n,
            additionalQuery: {
              pagesGroupId: input.pagesGroupId,
              citySlug: input.citySlug,
            },
            additionalOrQuery: [
              {
                index: input.index,
              },
            ],
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('pages.create.duplicate'),
            };
          }

          // Create page
          const createdPageResult = await pagesCollection.insertOne({
            ...input,
            slug: generateDefaultLangSlug(input.nameI18n),
            content: JSON.stringify(PAGE_EDITOR_DEFAULT_VALUE),
            assetKeys: [],
            state: PAGE_STATE_DRAFT,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          const createdPage = createdPageResult.ops[0];
          if (!createdPageResult.result.ok || !createdPage) {
            return {
              success: false,
              message: await getApiMessage('pages.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('pages.create.success'),
            payload: createdPage,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update page
    t.nonNull.field('updatePage', {
      type: 'PagePayload',
      description: 'Should update page',
      args: {
        input: nonNull(
          arg({
            type: 'UpdatePageInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<PagePayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updatePage',
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
            schema: updatePageSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const pagesCollection = db.collection<PageModel>(COL_PAGES);
          const { input } = args;
          const { _id, ...values } = input;

          // Check page availability
          const page = await pagesCollection.findOne({ _id });
          if (!page) {
            return {
              success: false,
              message: await getApiMessage('pages.update.notFound'),
            };
          }

          // Check if page already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_PAGES,
            fieldName: 'nameI18n',
            fieldArg: input.nameI18n,
            additionalQuery: {
              citySlug: page.citySlug,
              pagesGroupId: values.pagesGroupId,
              _id: {
                $ne: _id,
              },
            },
            additionalOrQuery: [
              {
                index: input.index,
              },
            ],
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('pages.update.duplicate'),
            };
          }

          // Update page
          const updatedPageResult = await pagesCollection.findOneAndUpdate(
            { _id },
            {
              $set: {
                ...values,
                updatedAt: new Date(),
              },
            },
            {
              returnDocument: 'after',
            },
          );
          const updatedPage = updatedPageResult.value;
          if (!updatedPageResult.ok || !updatedPage) {
            return {
              success: false,
              message: await getApiMessage('pages.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('pages.update.success'),
            payload: updatedPage,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete page
    t.nonNull.field('deletePage', {
      type: 'PagePayload',
      description: 'Should delete page',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<PagePayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'deletePage',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const pagesCollection = db.collection<PageModel>(COL_PAGES);
          const { _id } = args;

          // Check page availability
          const page = await pagesCollection.findOne({ _id });
          if (!page) {
            return {
              success: false,
              message: await getApiMessage('pages.delete.notFound'),
            };
          }

          // Delete page assets from cloud
          for await (const filePath of page.assetKeys) {
            await deleteUpload({
              filePath,
            });
          }

          // Delete page
          const removedPageResult = await pagesCollection.findOneAndDelete({ _id });
          if (!removedPageResult.ok) {
            return {
              success: false,
              message: await getApiMessage('pages.delete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('pages.delete.success'),
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
