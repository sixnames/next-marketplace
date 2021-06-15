import { PagesGroupPayloadModel } from 'db/dbModels';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { createPagesGroupSchema } from 'validation/pagesSchema';

export const PagesGroup = objectType({
  name: 'PagesGroup',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.int('index');

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
  },
});

export const UpdatePagesGroupInput = inputObjectType({
  name: 'UpdatePagesGroupInput',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.int('index');
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

export const NavItemMutations = extendType({
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

          return {
            success: true,
            message: '',
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
