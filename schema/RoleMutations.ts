import { COL_ROLES } from 'db/collectionNames';
import { RolePayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { findDocumentByI18nField } from 'db/utils/findDocumentByI18nField';
import { ROLE_SLUG_GUEST } from 'lib/config/common';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { createRoleSchema, updateRoleSchema } from 'validation/roleSchema';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';

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
    t.nonNull.boolean('isModerator');
    t.nonNull.boolean('isContentManager');
    t.nonNull.boolean('isInspector');
    t.nonNull.boolean('showAdminUiInCatalogue');
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
    t.nonNull.boolean('isModerator');
    t.nonNull.boolean('isContentManager');
    t.nonNull.boolean('isInspector');
    t.nonNull.boolean('showAdminUiInCatalogue');
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
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'createRole',
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
            schema: createRoleSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const collections = await getDbCollections();
          const rolesCollection = collections.rolesCollection();

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
          const slug = generateDefaultLangSlug(args.input.nameI18n);
          const createdRoleResult = await rolesCollection.insertOne({
            ...args.input,
            isCompanyStaff: Boolean(args.input.isCompanyStaff),
            isStaff: Boolean(args.input.isStaff),
            slug,
            allowedAppNavigation: [],
            updatedAt: new Date(),
            createdAt: new Date(),
          });
          if (!createdRoleResult.acknowledged) {
            return {
              success: false,
              message: await getApiMessage('roles.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('roles.create.success'),
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

          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateRoleSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const collections = await getDbCollections();
          const rolesCollection = collections.rolesCollection();
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
              returnDocument: 'after',
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
        const { getApiMessage } = await getRequestParams(context);
        const collections = await getDbCollections();
        const rolesCollection = collections.rolesCollection();
        const usersCollection = collections.usersCollection();

        const session = collections.client.startSession();

        let mutationPayload: RolePayloadModel = {
          success: false,
          message: await getApiMessage('roles.delete.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'deleteRole',
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

            // Check role availability
            const role = await rolesCollection.findOne({ _id });
            if (!role) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('roles.delete.notFound'),
              };
              await session.abortTransaction();
              return;
            }

            // Update users with guest role
            const guestRole = await rolesCollection.findOne({ slug: ROLE_SLUG_GUEST });
            if (!guestRole) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('roles.delete.guestRoleNotFound'),
              };
              await session.abortTransaction();
              return;
            }
            const updatedUsers = await usersCollection.updateMany(
              { roleId: _id },
              { $set: { roleId: guestRole._id } },
            );
            if (!updatedUsers.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('roles.delete.usersUpdateError'),
              };
              await session.abortTransaction();
              return;
            }

            // Delete role
            const removedRoleResult = await rolesCollection.findOneAndDelete({ _id });
            if (!removedRoleResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('roles.delete.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('roles.delete.success'),
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

          const { getApiMessage } = await getRequestParams(context);
          const collections = await getDbCollections();
          const rolesCollection = collections.rolesCollection();
          const navItemsCollection = collections.navItemsCollection();
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
                returnDocument: 'after',
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
              returnDocument: 'after',
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
