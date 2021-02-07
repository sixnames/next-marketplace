import { arg, extendType, list, nonNull, objectType, stringArg } from 'nexus';
import {
  CatalogueDataModel,
  CatalogueSearchResultModel,
  LanguageModel,
  ProductModel,
  RubricModel,
} from 'db/dbModels';
import { getRequestParams } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import { COL_LANGUAGES, COL_PRODUCTS, COL_RUBRICS } from 'db/collectionNames';
import { SORT_BY_ID_DIRECTION, SORT_DESC } from 'config/common';

export const CatalogueSearchResult = objectType({
  name: 'CatalogueSearchResult',
  definition(t) {
    t.nonNull.list.nonNull.field('rubrics', {
      type: 'Rubric',
    });
    t.nonNull.list.nonNull.field('products', {
      type: 'Product',
    });
  },
});

export const CatalogueFilterSelectedPrices = objectType({
  name: 'CatalogueFilterSelectedPrices',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('clearSlug');
    t.nonNull.string('formattedMinPrice');
    t.nonNull.string('formattedMaxPrice');
  },
});

export const CatalogueFilterAttributeOption = objectType({
  name: 'CatalogueFilterAttributeOption',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.string('nextSlug');
    t.nonNull.int('counter');
    t.nonNull.boolean('isSelected');
    t.nonNull.boolean('isDisabled');
  },
});

export const CatalogueFilterAttribute = objectType({
  name: 'CatalogueFilterAttribute',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.string('clearSlug');
    t.nonNull.boolean('isSelected');
    t.nonNull.boolean('isDisabled');
    t.nonNull.list.nonNull.field('options', {
      type: 'CatalogueFilterAttributeOption',
    });
  },
});

export const CatalogueFilter = objectType({
  name: 'CatalogueFilter',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('clearSlug');
    t.nonNull.list.nonNull.field('attributes', {
      type: 'CatalogueFilterAttribute',
    });
    t.nonNull.list.nonNull.field('selectedAttributes', {
      type: 'CatalogueFilterAttribute',
    });
    t.field('selectedPrices', {
      type: 'CatalogueFilterSelectedPrices',
    });
  },
});

export const CatalogueData = objectType({
  name: 'CatalogueData',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('catalogueTitle');
    t.nonNull.field('rubric', {
      type: 'Rubric',
    });
    t.nonNull.field('products', {
      type: 'ProductsPaginationPayload',
    });
    t.nonNull.field('catalogueFilter', {
      type: 'CatalogueFilter',
    });
  },
});

export const CatalogueQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return catalogue page data
    t.field('getCatalogueData', {
      type: 'CatalogueData',
      description: 'Should return catalogue page data',
      args: {
        catalogueFilter: nonNull(list(nonNull(stringArg()))),
        productsInput: nonNull(arg({ type: 'ProductsPaginationInput' })),
      },
      resolve: async (_root, _args, _context): Promise<CatalogueDataModel | null> => {
        try {
          return null;
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    });

    // Should return top search items
    t.nonNull.field('getCatalogueSearchTopItems', {
      type: 'CatalogueSearchResult',
      description: 'Should return top search items',
      resolve: async (_root, _args, context): Promise<CatalogueSearchResultModel> => {
        try {
          const { city } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

          const finalPipeline = [
            {
              $sort: {
                [`views.${city}`]: SORT_DESC,
                [`priority.${city}`]: SORT_DESC,
                _id: SORT_BY_ID_DIRECTION,
              },
            },
            { $limit: 3 },
          ];

          const products = await productsCollection
            .aggregate([
              {
                $match: {
                  active: true,
                  archive: false,
                },
              },
              // filter out by shop products availability
              { $addFields: { shopsCount: `$shopProductsCountCities.${city}` } },
              { $match: { shopsCount: { $gt: 0 } } },
              ...finalPipeline,
            ])
            .toArray();

          const rubrics = await rubricsCollection
            .aggregate([
              {
                $match: {
                  active: true,
                },
              },
              ...finalPipeline,
            ])
            .toArray();

          return {
            products,
            rubrics,
          };
        } catch (e) {
          console.log(e);
          return {
            products: [],
            rubrics: [],
          };
        }
      },
    });

    // Should return top search items
    t.nonNull.field('getCatalogueSearchResult', {
      type: 'CatalogueSearchResult',
      description: 'Should return top search items',
      args: {
        search: nonNull(stringArg()),
      },
      resolve: async (_root, args, context): Promise<CatalogueSearchResultModel> => {
        try {
          const { city } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
          const { search } = args;

          // Get all languages
          const languages = await languagesCollection.find({}).toArray();

          const searchByName = languages.map(({ slug }) => {
            return {
              [`nameI18n.${slug}`]: search,
            };
          });

          const finalPipeline = [
            {
              $sort: {
                [`views.${city}`]: SORT_DESC,
                [`priority.${city}`]: SORT_DESC,
                _id: SORT_BY_ID_DIRECTION,
              },
            },
            { $limit: 3 },
          ];

          const products = await productsCollection
            .aggregate([
              {
                $match: {
                  active: true,
                  archive: false,
                  $or: [
                    ...searchByName,
                    {
                      originalName: search,
                    },
                  ],
                },
              },
              // filter out by shop products availability
              { $addFields: { shopsCount: `$shopProductsCountCities.${city}` } },
              { $match: { shopsCount: { $gt: 0 } } },
              ...finalPipeline,
            ])
            .toArray();

          const rubrics = await rubricsCollection
            .aggregate([
              {
                $match: {
                  active: true,
                  $or: [...searchByName],
                },
              },
              ...finalPipeline,
            ])
            .toArray();

          return {
            products,
            rubrics,
          };
        } catch (e) {
          console.log(e);
          return {
            products: [],
            rubrics: [],
          };
        }
      },
    });
  },
});
