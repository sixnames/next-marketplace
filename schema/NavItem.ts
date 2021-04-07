import { extendType, objectType } from 'nexus';
import { getRequestParams, getSessionRole } from 'lib/sessionHelpers';
import { NavItemModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_NAV_ITEMS } from 'db/collectionNames';
import {
  ROLE_SLUG_ADMIN,
  ROUTE_APP_NAV_GROUP,
  ROUTE_CMS_NAV_GROUP,
  SORT_ASC,
  SORT_DESC,
} from 'config/common';

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
                index: SORT_DESC,
              },
            },
          )
          .toArray();
        return children;
      },
    });

    // NavItem appNavigationChildren field resolver
    t.nonNull.list.nonNull.field('appNavigationChildren', {
      type: 'NavItem',
      resolve: async (source, _args, context): Promise<NavItemModel[]> => {
        const { role } = await getSessionRole(context);
        const db = await getDatabase();
        const navItemsCollection = db.collection<NavItemModel>(COL_NAV_ITEMS);

        const roleNavQuery =
          role.slug === ROLE_SLUG_ADMIN
            ? {}
            : {
                _id: { $in: role.allowedAppNavigation },
              };

        const children = await navItemsCollection
          .find(
            {
              ...roleNavQuery,
              parentId: source._id,
              navGroup: source.navGroup,
            },
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

// NavItem Queries
export const NavItemQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return all app nav items
    t.nonNull.list.nonNull.field('getAllAppNavItems', {
      type: 'NavItem',
      description: 'Should return all app nav items',
      resolve: async (): Promise<NavItemModel[]> => {
        const db = await getDatabase();
        const navItemsCollection = db.collection<NavItemModel>(COL_NAV_ITEMS);
        const navItems = await navItemsCollection
          .find(
            {
              $or: [{ parentId: null }, { parentId: { $exists: false } }],
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

    // Should return all cms nav items
    t.nonNull.list.nonNull.field('getAllCmsNavItems', {
      type: 'NavItem',
      description: 'Should return all cms nav items',
      resolve: async (): Promise<NavItemModel[]> => {
        const db = await getDatabase();
        const navItemsCollection = db.collection<NavItemModel>(COL_NAV_ITEMS);
        const navItems = await navItemsCollection
          .find(
            {
              $or: [{ parentId: null }, { parentId: { $exists: false } }],
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
