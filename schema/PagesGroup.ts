import { COL_PAGES, COL_PAGES_GROUP } from 'db/collectionNames';
import { PageModel, PagesGroupModel, PagesGroupPayloadModel } from 'db/dbModels';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import { getDatabase } from 'db/mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { createPagesGroupSchema, updatePagesGroupSchema } from 'validation/pagesSchema';

export const PagesGroup = objectType({
  name: 'PagesGroup',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.int('index');
    t.nonNull.string('companySlug');
    t.nonNull.boolean('showInFooter');
    t.nonNull.boolean('showInHeader');

    // PagesGroup name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });
  },
});

export const CreatePagesGroupInput = inputObjectType({
  name: 'CreatePagesGroupInput',
  definition(t) {
    t.nonNull.json('nameI18n');
    t.nonNull.int('index');
    t.nonNull.string('companySlug');
    t.nonNull.boolean('showInFooter');
    t.nonNull.boolean('showInHeader');
  },
});

export const UpdatePagesGroupInput = inputObjectType({
  name: 'UpdatePagesGroupInput',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.int('index');
    t.nonNull.boolean('showInFooter');
    t.nonNull.boolean('showInHeader');
  },
});

export const PagesGroupPayload = objectType({
  name: 'PagesGroupPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'PagesGroup',
    });
  },
});

export const PagesGroupMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create pages group
    t.nonNull.field('createPagesGroup', {
      type: 'PagesGroupPayload',
      description: 'Should create pages group',
      args: {
        input: nonNull(
          arg({
            type: 'CreatePagesGroupInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<PagesGroupPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createPagesGroup',
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
            schema: createPagesGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const pagesGroupsCollection = db.collection<PagesGroupModel>(COL_PAGES_GROUP);
          const { input } = args;

          // Check if pages group already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_PAGES_GROUP,
            fieldName: 'nameI18n',
            fieldArg: input.nameI18n,
            additionalQuery: {
              companySlug: input.companySlug,
            },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('pageGroups.create.duplicate'),
            };
          }

          const createdPagesGroupResult = await pagesGroupsCollection.insertOne({
            ...input,
          });
          const createdPagesGroup = createdPagesGroupResult.ops[0];
          if (!createdPagesGroupResult.result.ok || !createdPagesGroup) {
            return {
              success: false,
              message: await getApiMessage('pageGroups.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('pageGroups.create.success'),
            payload: createdPagesGroup,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update pages group
    t.nonNull.field('updatePagesGroup', {
      type: 'PagesGroupPayload',
      description: 'Should update pages group',
      args: {
        input: nonNull(
          arg({
            type: 'UpdatePagesGroupInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<PagesGroupPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updatePagesGroup',
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
            schema: updatePagesGroupSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const pagesGroupsCollection = db.collection<PagesGroupModel>(COL_PAGES_GROUP);
          const { input } = args;
          const { _id, ...values } = input;

          // Check pages group availability
          const pagesGroup = await pagesGroupsCollection.findOne({ _id });
          if (!pagesGroup) {
            return {
              success: false,
              message: await getApiMessage('pageGroups.update.notFound'),
            };
          }

          // Check if pages group already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_PAGES_GROUP,
            fieldName: 'nameI18n',
            fieldArg: input.nameI18n,
            additionalQuery: {
              companySlug: pagesGroup.companySlug,
              _id: {
                $ne: _id,
              },
            },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('pageGroups.update.duplicate'),
            };
          }

          const updatedPagesGroupResult = await pagesGroupsCollection.findOneAndUpdate(
            {
              _id,
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
          const updatedPagesGroup = updatedPagesGroupResult.value;
          if (!updatedPagesGroupResult.ok || !updatedPagesGroup) {
            return {
              success: false,
              message: await getApiMessage('pageGroups.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('pageGroups.update.success'),
            payload: updatedPagesGroup,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete pages group
    t.nonNull.field('deletePagesGroup', {
      type: 'PagesGroupPayload',
      description: 'Should delete pages group',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<PagesGroupPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const pagesGroupsCollection = db.collection<PagesGroupModel>(COL_PAGES_GROUP);
        const pagesCollection = db.collection<PageModel>(COL_PAGES);

        const session = client.startSession();

        let mutationPayload: PagesGroupPayloadModel = {
          success: false,
          message: await getApiMessage('pageGroups.delete.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'deletePagesGroup',
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

            // Delete pages
            const removedPagesResult = await pagesCollection.deleteMany({
              pagesGroupId: _id,
            });
            if (!removedPagesResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('pageGroups.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete pages group
            const removedPagesGroupResult = await pagesGroupsCollection.findOneAndDelete({
              _id,
            });
            if (!removedPagesGroupResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('pageGroups.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('pageGroups.delete.success'),
            };
          });

          return mutationPayload;
        } catch (e) {
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
