import { PagesGroupPayloadModel } from 'db/dbModels';
import { createPagesGroup, deletePagesGroup, updatePagesGroup } from 'lib/pagesGroupUtils';
import { getRequestParams } from 'lib/sessionHelpers';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';

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
        return createPagesGroup({ input: args.input, context });
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
        return updatePagesGroup({ input: args.input, context });
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
        return deletePagesGroup({ _id: args._id, context });
      },
    });
  },
});
