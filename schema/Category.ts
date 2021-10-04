import { COL_CATEGORIES } from 'db/collectionNames';
import { CategoriesAlphabetListModel, CategoryModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getAlphabetList } from 'lib/optionsUtils';
import { getRequestParams } from 'lib/sessionHelpers';
import { arg, extendType, inputObjectType, objectType } from 'nexus';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('slug');
    t.nonNull.json('nameI18n');
    t.string('image');
    t.nonNull.objectId('rubricId');
    t.objectId('parentId');
    t.nonNull.json('views');
    t.nonNull.json('priorities');
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });
    t.nonNull.list.nonNull.field('categories', {
      type: 'Category',
      resolve: async (source): Promise<CategoryModel[]> => {
        const { db } = await getDatabase();
        const categoriesCollection = db.collection(COL_CATEGORIES);
        return categoriesCollection
          .find({
            parentId: source._id,
          })
          .toArray();
      },
    });
  },
});

export const CategoriesAlphabetList = objectType({
  name: 'CategoriesAlphabetList',
  definition(t) {
    t.implements('AlphabetList');
    t.nonNull.list.nonNull.field('docs', {
      type: 'Category',
    });
  },
});

export const CategoryAlphabetInput = inputObjectType({
  name: 'CategoryAlphabetInput',
  definition(t) {
    t.list.nonNull.string('slugs');
  },
});

export const CategoryQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('getCategoriesAlphabetLists', {
      type: 'CategoriesAlphabetList',
      description: 'Should return categories grouped by alphabet',
      args: {
        input: arg({
          type: 'CategoryAlphabetInput',
        }),
      },
      resolve: async (_root, args, context): Promise<CategoriesAlphabetListModel[]> => {
        const { locale } = await getRequestParams(context);
        const { db } = await getDatabase();
        const categoriesCollection = db.collection(COL_CATEGORIES);
        const { input } = args;
        let query: Record<string, any> = {};
        if (input) {
          if (input.slugs) {
            query = {
              slug: {
                $in: input.slugs,
              },
            };
          }
        }

        const categories = await categoriesCollection
          .find(query, {
            projection: {
              _id: true,
              slug: true,
              nameI18n: true,
            },
          })
          .toArray();
        return getAlphabetList<CategoryModel>({
          entityList: categories,
          locale,
        });
      },
    });
  },
});
