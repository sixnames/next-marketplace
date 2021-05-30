import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { getRequestParams, getResolverValidationSchema } from 'lib/sessionHelpers';
import { NavItemModel, NavItemPayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_NAV_ITEMS } from 'db/collectionNames';
import { SORT_ASC } from 'config/common';
import { createNavItemSchema, updateNavItemSchema } from 'validation/navItemSchema';

export const NavItem = objectType({
  name: 'NavItem',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.string('slug');
    t.string('path');
    t.nonNull.string('navGroup');
    t.nonNull.int('index');
    t.string('icon');
    t.objectId('parentId');

    // NavItem name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // NavItem children field resolver
    t.nonNull.list.nonNull.field('children', {
      type: 'NavItem',
      resolve: async (source): Promise<NavItemModel[]> => {
        const db = await getDatabase();
        const navItemsCollection = db.collection<NavItemModel>(COL_NAV_ITEMS);
        const children = await navItemsCollection
          .find(
            { parentId: source._id },
            {
              sort: {
                index: SORT_ASC,
              },
            },
          )
          .toArray();
        return children;
      },
    });
  },
});

export const CreateNavItemInput = inputObjectType({
  name: 'CreateNavItemInput',
  definition(t) {
    t.nonNull.json('nameI18n');
    t.nonNull.string('slug');
    t.string('path');
    t.nonNull.string('navGroup');
    t.nonNull.int('index');
    t.string('icon');
  },
});

export const UpdateNavItemInput = inputObjectType({
  name: 'UpdateNavItemInput',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.string('slug');
    t.string('path');
    t.nonNull.string('navGroup');
    t.nonNull.int('index');
    t.string('icon');
  },
});

export const NavItemPayload = objectType({
  name: 'NavItemPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'NavItem',
    });
  },
});

export const NavItemMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create nav item
    t.nonNull.field('createNavItem', {
      type: 'NavItemPayload',
      description: 'Should create nav item',
      args: {
        input: nonNull(
          arg({
            type: 'CreateNavItemInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<NavItemPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createNavItemSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const navItemsCollection = db.collection<NavItemModel>(COL_NAV_ITEMS);
          const { input } = args;

          // Check if nav item already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_NAV_ITEMS,
            fieldName: 'nameI18n',
            fieldArg: input.nameI18n,
            additionalQuery: {
              navGroup: input.navGroup,
            },
            additionalOrQuery: [
              {
                slug: input.slug,
              },
              {
                index: input.index,
              },
            ],
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('navItems.create.duplicate'),
            };
          }

          // Create nav item
          const createdNavItemResult = await navItemsCollection.insertOne({
            ...input,
          });
          const createdNavItem = createdNavItemResult.ops[0];
          if (!createdNavItemResult.result.ok || !createdNavItem) {
            return {
              success: false,
              message: await getApiMessage('navItems.create.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('navItems.create.success'),
            payload: createdNavItem,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update nav item
    t.nonNull.field('updateNavItem', {
      type: 'NavItemPayload',
      description: 'Should update nav item',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateNavItemInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<NavItemPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateNavItemSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const navItemsCollection = db.collection<NavItemModel>(COL_NAV_ITEMS);
          const { input } = args;
          const { _id, ...values } = input;

          // Check if nav item already exist
          const exist = await findDocumentByI18nField({
            collectionName: COL_NAV_ITEMS,
            fieldName: 'nameI18n',
            fieldArg: values.nameI18n,
            additionalQuery: {
              navGroup: values.navGroup,
              _id: {
                $ne: _id,
              },
            },
            additionalOrQuery: [
              {
                slug: values.slug,
              },
              {
                index: values.index,
              },
            ],
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage('navItems.update.duplicate'),
            };
          }

          // Update nav item
          const createdNavItemResult = await navItemsCollection.findOneAndUpdate(
            {
              _id,
            },
            {
              $set: {
                ...values,
              },
            },
            {
              returnOriginal: false,
            },
          );
          const createdNavItem = createdNavItemResult.value;
          if (!createdNavItemResult.ok || !createdNavItem) {
            return {
              success: false,
              message: await getApiMessage('navItems.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('navItems.update.success'),
            payload: createdNavItem,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete nav item
    t.nonNull.field('deleteNavItem', {
      type: 'NavItemPayload',
      description: 'Should delete nav item',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<NavItemPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const navItemsCollection = db.collection<NavItemModel>(COL_NAV_ITEMS);
          const { _id } = args;

          // Delete nav item
          const removedNavItemResult = await navItemsCollection.findOneAndDelete({
            _id,
          });
          if (!removedNavItemResult.ok) {
            return {
              success: false,
              message: await getApiMessage('navItems.delete.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('navItems.delete.success'),
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
