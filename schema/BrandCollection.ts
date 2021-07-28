import { COL_BRAND_COLLECTIONS } from 'db/collectionNames';
import { BrandCollectionModel, BrandCollectionsAlphabetListModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getAlphabetList } from 'lib/optionsUtils';
import { arg, extendType, inputObjectType, objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';

export const BrandCollection = objectType({
  name: 'BrandCollection',
  definition(t) {
    t.implements('Base');
    t.implements('Timestamp');
    t.nonNull.string('slug');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');

    // BrandCollection name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // BrandCollection description translation field resolver
    t.field('description', {
      type: 'String',
      resolve: async (source, _args, context) => {
        if (!source.descriptionI18n) {
          return null;
        }
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.descriptionI18n);
      },
    });
  },
});

export const BrandCollectionsAlphabetList = objectType({
  name: 'BrandCollectionsAlphabetList',
  definition(t) {
    t.implements('AlphabetList');
    t.nonNull.list.nonNull.field('docs', {
      type: 'BrandCollection',
    });
  },
});

export const BrandCollectionAlphabetInput = inputObjectType({
  name: 'BrandCollectionAlphabetInput',
  definition(t) {
    t.objectId('brandId');
    t.string('brandSlug');
    t.list.nonNull.string('slugs');
  },
});

// Brand collection queries
export const BrandCollectionQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return brand collections grouped by alphabet
    t.nonNull.list.nonNull.field('getBrandCollectionAlphabetLists', {
      type: 'BrandCollectionsAlphabetList',
      description: 'Should return brand collections grouped by alphabet',
      args: {
        input: arg({
          type: 'BrandCollectionAlphabetInput',
        }),
      },
      resolve: async (_root, args, context): Promise<BrandCollectionsAlphabetListModel[]> => {
        const { locale } = await getRequestParams(context);
        const { db } = await getDatabase();
        const brandCollectionsCollection =
          db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
        const { input } = args;
        let query: Record<string, any> = {};
        if (input) {
          if (input.brandId) {
            query = { brandId: input.brandId };
          }

          if (input.brandSlug) {
            query = { brandSlug: input.brandSlug };
          }

          if (input.slugs) {
            query = {
              slug: {
                $in: input.slugs,
              },
            };
          }
        }

        const brandCollections = await brandCollectionsCollection
          .find(query, {
            projection: {
              _id: true,
              slug: true,
              nameI18n: true,
            },
          })
          .toArray();
        return getAlphabetList<BrandCollectionModel>({
          entityList: brandCollections,
          locale,
        });
      },
    });
  },
});
