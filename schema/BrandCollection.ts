import { COL_BRAND_COLLECTIONS } from 'db/collectionNames';
import { BrandCollectionModel, BrandCollectionsAlphabetListModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getAlphabetList } from 'lib/optionsUtils';
import { extendType, objectType } from 'nexus';
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

// Brand collection queries
export const BrandCollectionQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return brand collections grouped by alphabet
    t.nonNull.list.nonNull.field('getBrandCollectionAlphabetLists', {
      type: 'BrandCollectionsAlphabetList',
      description: 'Should return brand collections grouped by alphabet',
      resolve: async (): Promise<BrandCollectionsAlphabetListModel[]> => {
        const db = await getDatabase();
        const brandCollectionsCollection = db.collection<BrandCollectionModel>(
          COL_BRAND_COLLECTIONS,
        );
        const brandCollections = await brandCollectionsCollection
          .find(
            {},
            {
              projection: {
                _id: true,
                slug: true,
                nameI18n: true,
              },
            },
          )
          .toArray();
        return getAlphabetList<BrandCollectionModel>(brandCollections);
      },
    });
  },
});
