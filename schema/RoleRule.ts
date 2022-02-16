import { COL_ROLE_RULES } from 'db/collectionNames';
import { RoleRulePayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { findDocumentByI18nField } from 'db/utils/findDocumentByI18nField';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { updateRoleRuleSchema } from 'validation/roleSchema';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';

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
      resolve: async (_root, args, context): Promise<RoleRulePayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateRole',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateRoleRuleSchema,
          });
          await validationSchema.validate(args.input);
          const { getApiMessage } = await getRequestParams(context);
          const collections = await getDbCollections();
          const roleRulesCollection = collections.roleRulesCollection();

          // Check if role already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_ROLE_RULES,
            fieldName: 'nameI18n',
            fieldArg: args.input.nameI18n,
            additionalQuery: {
              _id: {
                $ne: args.input._id,
              },
              roleId: args.input.roleId,
            },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('roleRules.update.duplicate'),
            };
          }

          const { _id, ...values } = args.input;

          const updatedRoleRuleResult = await roleRulesCollection.findOneAndUpdate(
            {
              _id,
            },
            {
              $set: values,
            },
            {
              returnDocument: 'after',
              upsert: true,
            },
          );
          const updatedRoleRule = updatedRoleRuleResult.value;
          if (!updatedRoleRuleResult.ok || !updatedRoleRule) {
            return {
              success: false,
              message: await getApiMessage('roleRules.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('roleRules.update.success'),
            payload: updatedRoleRule,
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
