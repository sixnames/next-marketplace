import { ROLE_SLUG_GUEST } from 'config/common';
import { COL_NAV_ITEMS, COL_ROLES, COL_USERS } from 'db/collectionNames';
import { NavItemModel, RoleModel, RolePayloadModel, UserModel } from 'db/dbModels';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import { getDatabase } from 'db/mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams, getResolverValidationSchema } from 'lib/sessionHelpers';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { createRoleSchema, updateRoleSchema } from 'validation/roleSchema';

export const RolePayload = objectType({
  name: 'RolePayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Role',
    });
  },
});

export const CreateRoleInput = inputObjectType({
  name: 'CreateRoleInput',
  definition(t) {
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');
    t.nonNull.boolean('isStaff');
    t.nonNull.boolean('isCompanyStaff');
  },
});

export const UpdateRoleInput = inputObjectType({
  name: 'UpdateRoleInput',
  definition(t) {
    t.nonNull.objectId('roleId');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');
    t.nonNull.boolean('isStaff');
    t.nonNull.boolean('isCompanyStaff');
  },
});

export const UpdateRoleNavInput = inputObjectType({
  name: 'UpdateRoleNavInput',
  definition(t) {
    t.nonNull.objectId('roleId');
    t.nonNull.objectId('navItemId');
    t.nonNull.boolean('checked');
  },
});

export const RoleMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create role
    t.nonNull.field('createRole', {
      type: 'RolePayload',
      description: 'Should create role',
      args: {
        input: nonNull(
          arg({
            type: 'CreateRoleInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RolePayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createRoleSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const rolesCollection = db.collection<RoleModel>(COL_ROLES);

          // Check if role already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_ROLES,
            fieldName: 'nameI18n',
            fieldArg: args.input.nameI18n,
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('roles.create.duplicate'),
            };
          }

          // Create role
          const slug = await generateDefaultLangSlug(args.input.nameI18n);
          const createdRoleResult = await rolesCollection.insertOne({
            ...args.input,
            isCompanyStaff: Boolean(args.input.isCompanyStaff),
            isStaff: Boolean(args.input.isStaff),
            slug,
            allowedAppNavigation: [],
            updatedAt: new Date(),
            createdAt: new Date(),
          });
          const createdRole = createdRoleResult.ops[0];
          if (!createdRoleResult.result.ok || !createdRole) {
            return {
              success: false,
              message: await getApiMessage('roles.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('roles.create.success'),
            payload: createdRole,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update role
    t.nonNull.field('updateRole', {
      type: 'RolePayload',
      description: 'Should update role',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateRoleInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RolePayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateRoleSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const rolesCollection = db.collection<RoleModel>(COL_ROLES);
          const { input } = args;
          const { roleId, ...values } = input;

          // Check role availability
          const role = await rolesCollection.findOne({ _id: roleId });
          if (!role) {
            return {
              success: false,
              message: await getApiMessage('roles.update.error'),
            };
          }

          // Check if role already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_ROLES,
            fieldName: 'nameI18n',
            fieldArg: args.input.nameI18n,
            additionalQuery: {
              _id: { $ne: roleId },
            },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('roles.update.duplicate'),
            };
          }

          // Create role
          const updatedRoleResult = await rolesCollection.findOneAndUpdate(
            { _id: roleId },
            {
              $set: {
                ...values,
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedRole = updatedRoleResult.value;
          if (!updatedRoleResult.ok || !updatedRole) {
            return {
              success: false,
              message: await getApiMessage('roles.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('roles.update.success'),
            payload: updatedRole,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete role
    t.nonNull.field('deleteRole', {
      type: 'RolePayload',
      description: 'Should delete role',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RolePayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const rolesCollection = db.collection<RoleModel>(COL_ROLES);
          const usersCollection = db.collection<UserModel>(COL_USERS);
          const { _id } = args;

          // Check role availability
          const role = await rolesCollection.findOne({ _id });
          if (!role) {
            return {
              success: false,
              message: await getApiMessage('roles.delete.notFound'),
            };
          }

          // Update users with guest role
          const guestRole = await rolesCollection.findOne({ slug: ROLE_SLUG_GUEST });
          if (!guestRole) {
            return {
              success: false,
              message: await getApiMessage('roles.delete.guestRoleNotFound'),
            };
          }
          const updatedUsers = await usersCollection.updateMany(
            { roleId: _id },
            { $set: { roleId: guestRole._id } },
          );
          if (!updatedUsers.result.ok) {
            return {
              success: false,
              message: await getApiMessage('roles.delete.usersUpdateError'),
            };
          }

          // Delete role
          const removedRoleResult = await rolesCollection.findOneAndDelete({ _id });
          if (!removedRoleResult.ok) {
            return {
              success: false,
              message: await getApiMessage('roles.delete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('roles.delete.success'),
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update role nav
    t.nonNull.field('updateRoleNav', {
      type: 'RolePayload',
      description: 'Should update role nav',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateRoleNavInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<RolePayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const rolesCollection = db.collection<RoleModel>(COL_ROLES);
          const navItemsCollection = db.collection<NavItemModel>(COL_NAV_ITEMS);
          const {
            input: { roleId, navItemId, checked },
          } = args;

          // Check role availability
          const role = await rolesCollection.findOne({ _id: roleId });
          if (!role) {
            return {
              success: false,
              message: await getApiMessage('roles.update.error'),
            };
          }

          // Check nav item availability
          const navItem = await navItemsCollection.findOne({ _id: navItemId });
          if (!navItem) {
            return {
              success: false,
              message: await getApiMessage('roles.update.error'),
            };
          }

          if (checked) {
            const updatedRoleResult = await rolesCollection.findOneAndUpdate(
              {
                _id: roleId,
              },
              {
                $addToSet: {
                  allowedAppNavigation: navItem.path,
                },
              },
              {
                returnOriginal: false,
              },
            );
            const updatedRole = updatedRoleResult.value;
            if (!updatedRoleResult.ok || !updatedRole) {
              return {
                success: false,
                message: await getApiMessage('roles.update.error'),
              };
            }

            return {
              success: true,
              message: await getApiMessage('roles.update.success'),
            };
          }

          const updatedRoleResult = await rolesCollection.findOneAndUpdate(
            {
              _id: roleId,
            },
            {
              $pull: {
                allowedAppNavigation: navItem.path,
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedRole = updatedRoleResult.value;
          if (!updatedRoleResult.ok || !updatedRole) {
            return {
              success: false,
              message: await getApiMessage('roles.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('roles.update.success'),
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
