import { objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import { NavItemModel } from 'db/dbModels';
import { COL_NAV_ITEMS } from 'db/collectionNames';
import { ROLE_SLUG_ADMIN, ROUTE_APP_NAV_GROUP, ROUTE_CMS_NAV_GROUP, SORT_ASC } from 'config/common';

export const Role = objectType({
  name: 'Role',
  definition(t) {
    t.nonNull.objectId('_id');
    t.implements('Timestamp');
    t.nonNull.string('slug');
    t.nonNull.boolean('isStaff');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');

    // Role description field resolver
    t.nonNull.field('description', {
      type: 'String',
      resolve: async (source, _args, context): Promise<string> => {
        const { getFieldLocale } = await getRequestParams(context);
        return getFieldLocale(source.descriptionI18n);
      },
    });

    // Role name field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context): Promise<string> => {
        const { getFieldLocale } = await getRequestParams(context);
        return getFieldLocale(source.nameI18n);
      },
    });

    // Role name appNavigation resolver
    t.nonNull.list.nonNull.field('appNavigation', {
      type: 'NavItem',
      resolve: async (source, _args): Promise<NavItemModel[]> => {
        const db = await getDatabase();
        const navItemsCollection = await db.collection<NavItemModel>(COL_NAV_ITEMS);

        const roleNavQuery =
          source.slug === ROLE_SLUG_ADMIN
            ? {}
            : {
                path: { $in: source.allowedAppNavigation },
              };

        const navItems = await navItemsCollection
          .find(
            {
              ...roleNavQuery,
              parentId: null,
              navGroup: ROUTE_APP_NAV_GROUP,
            },
            {
              sort: {
                index: SORT_ASC,
              },
            },
          )
          .toArray();
        return navItems;
      },
    });

    // Role name cmsNavigation resolver
    t.nonNull.list.nonNull.field('cmsNavigation', {
      type: 'NavItem',
      resolve: async (source, _args): Promise<NavItemModel[]> => {
        const db = await getDatabase();
        const navItemsCollection = await db.collection<NavItemModel>(COL_NAV_ITEMS);

        const roleNavQuery =
          source.slug === ROLE_SLUG_ADMIN
            ? {}
            : {
                path: { $in: source.allowedAppNavigation },
              };

        const navItems = await navItemsCollection
          .find(
            {
              ...roleNavQuery,
              parentId: null,
              navGroup: ROUTE_CMS_NAV_GROUP,
            },
            {
              sort: {
                index: SORT_ASC,
              },
            },
          )
          .toArray();
        return navItems;
      },
    });
  },
});
