import { RoleRulePayloadModel } from 'db/dbModels';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';

export const RoleRule = objectType({
  name: 'RoleRule',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('slug');
    t.nonNull.boolean('allow');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');
    t.nonNull.objectId('roleId');

    // RoleRule description field resolver
    t.nonNull.field('description', {
      type: 'String',
      resolve: async (source, _args, context): Promise<string> => {
        const { getFieldLocale } = await getRequestParams(context);
        return getFieldLocale(source.descriptionI18n);
      },
    });

    // RoleRule name field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context): Promise<string> => {
        const { getFieldLocale } = await getRequestParams(context);
        return getFieldLocale(source.nameI18n);
      },
    });
  },
});

export const RoleRulePayload = objectType({
  name: 'RoleRulePayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'RoleRule',
    });
  },
});

export const UpdateRoleRuleInput = inputObjectType({
  name: 'UpdateRoleRuleInput',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('slug');
    t.nonNull.boolean('allow');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');
    t.nonNull.objectId('roleId');
  },
});

export const RoleRuleMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should update role rule
    t.nonNull.field('updateRoleRule', {
      type: 'RoleRulePayload',
      description: 'Should update role rule',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateRoleRuleInput',
          }),
        ),
      },
      resolve: async (): Promise<RoleRulePayloadModel> => {
        return {
          success: false,
          message: '',
        };
      },
    });
  },
});
