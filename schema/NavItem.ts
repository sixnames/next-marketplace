import { objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import { NavItemModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_NAV_ITEMS } from 'db/collectionNames';
import { SORT_ASC } from 'config/common';

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
