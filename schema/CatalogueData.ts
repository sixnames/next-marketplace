import { castCatalogueParamToObject } from 'lib/catalogueUtils';
import { updateRubricOptionsViews } from 'lib/countersUtils';
import { noNaN } from 'lib/numbers';
import { arg, extendType, inputObjectType, nonNull, objectType, stringArg } from 'nexus';
import {
  BrandCollectionModel,
  BrandModel,
  CatalogueSearchResultModel,
  LanguageModel,
  ManufacturerModel,
  ProductModel,
  RubricAttributeModel,
  RubricModel,
} from 'db/dbModels';
import { getRequestParams, getSessionRole } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_LANGUAGES,
  COL_MANUFACTURERS,
  COL_PRODUCTS,
  COL_RUBRICS,
} from 'db/collectionNames';
import {
  CATALOGUE_BRAND_COLLECTION_KEY,
  CATALOGUE_BRAND_KEY,
  CATALOGUE_MANUFACTURER_KEY,
  CATALOGUE_OPTION_SEPARATOR,
  SORT_BY_ID_DIRECTION,
  SORT_DESC,
  VIEWS_COUNTER_STEP,
} from 'config/common';

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

export const CatalogueQueries = extendType({
  type: 'Query',
  definition(t) {
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

          // const rubricsStart = new Date().getTime();
          const rubrics = await rubricsCollection
            .aggregate([
              {
                $match: {
                  active: true,
                },
              },
              {
                $project: {
                  _id: 1,
                  nameI18n: 1,
                  slug: 1,
                },
              },
              {
                $sort: {
                  [`priorities.${city}`]: SORT_DESC,
                  [`views.${city}`]: SORT_DESC,
                  _id: SORT_BY_ID_DIRECTION,
                },
              },
              { $limit: 3 },
            ])
            .toArray();

          const rubricsIds = rubrics.map(({ _id }) => _id);
          // console.log('Top rubrics ', new Date().getTime() - rubricsStart);

          // const productsStart = new Date().getTime();
          const products = await productsCollection
            .aggregate([
              {
                $match: {
                  rubricId: { $in: rubricsIds },
                  active: true,
                },
              },
              // filter out by shop products availability
              { $addFields: { shopsCount: `$shopProductsCountCities.${city}` } },
              { $match: { shopsCount: { $gt: 0 } } },
              {
                $sort: {
                  [`availabilityCities.${city}`]: SORT_DESC,
                  [`priorities.${city}`]: SORT_DESC,
                  [`views.${city}`]: SORT_DESC,
                  _id: SORT_DESC,
                },
              },
              { $limit: 3 },
            ])
            .toArray();
          // console.log('Top products ', new Date().getTime() - productsStart);

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
                [`priorities.${city}`]: SORT_DESC,
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

export const CatalogueDataInput = inputObjectType({
  name: 'CatalogueDataInput',
  definition(t) {
    t.objectId('lastProductId');
    t.nonNull.list.nonNull.string('filter');
  },
});

export const CatalogueMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should update catalogue counters
    t.nonNull.field('updateCatalogueCounters', {
      type: 'Boolean',
      description: 'Should update catalogue counters',
      args: {
        input: nonNull(
          arg({
            type: 'CatalogueDataInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<boolean> => {
        try {
          const db = await getDatabase();
          const sessionRole = await getSessionRole(context);
          const { city } = await getRequestParams(context);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
          const brandCollectionsCollection = db.collection<BrandCollectionModel>(
            COL_BRAND_COLLECTIONS,
          );
          const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);

          // Args
          const { input } = args;
          const { filter } = input;
          const [rubricSlug] = filter;

          if (!sessionRole.isStuff) {
            const rubric = await rubricsCollection.findOne({ slug: rubricSlug });
            if (!rubric) {
              return false;
            }

            // cast additional filters
            const selectedBrandSlugs: string[] = [];
            const selectedBrandCollectionSlugs: string[] = [];
            const selectedManufacturerSlugs: string[] = [];
            filter.forEach((param) => {
              const castedParam = castCatalogueParamToObject(param);
              const { slug, value } = castedParam;

              if (slug === CATALOGUE_BRAND_KEY) {
                selectedBrandSlugs.push(value);
              }
              if (slug === CATALOGUE_BRAND_COLLECTION_KEY) {
                selectedBrandCollectionSlugs.push(value);
              }
              if (slug === CATALOGUE_MANUFACTURER_KEY) {
                selectedManufacturerSlugs.push(value);
              }
            });

            const counterUpdater = {
              $inc: {
                [`views.${city}`]: VIEWS_COUNTER_STEP,
              },
            };

            // Update brand counters
            if (selectedBrandSlugs.length > 0) {
              await brandsCollection.updateMany(
                { slug: { $in: selectedBrandSlugs } },
                counterUpdater,
              );
            }

            // Update brand collection counters
            if (selectedBrandCollectionSlugs.length > 0) {
              await brandCollectionsCollection.updateMany(
                { slug: { $in: selectedBrandCollectionSlugs } },
                counterUpdater,
              );
            }

            // Update manufacturer counters
            if (selectedManufacturerSlugs.length > 0) {
              await manufacturersCollection.updateMany(
                { slug: { $in: selectedManufacturerSlugs } },
                counterUpdater,
              );
            }

            // Update rubric counters
            const attributesSlugs = filter.map((selectedSlug) => {
              return selectedSlug.split(CATALOGUE_OPTION_SEPARATOR)[0];
            });

            const updatedAttributes: RubricAttributeModel[] = [];
            rubric.attributes.forEach((attribute: RubricAttributeModel) => {
              if (attributesSlugs.includes(attribute.slug)) {
                if (!attribute.views) {
                  attribute.views = { [city]: VIEWS_COUNTER_STEP };
                } else {
                  attribute.views[city] = noNaN(attribute.views[city]) + VIEWS_COUNTER_STEP;
                }
                const updatedOptions = updateRubricOptionsViews({
                  selectedOptionsSlugs: filter,
                  options: attribute.options,
                  city,
                }).sort((optionA, optionB) => {
                  const optionACounter =
                    noNaN(optionA.views[city]) + noNaN(optionA.priorities[city]);
                  const optionBCounter =
                    noNaN(optionB.views[city]) + noNaN(optionB.priorities[city]);
                  return optionBCounter - optionACounter;
                });
                attribute.options = updatedOptions;
              }
              updatedAttributes.push(attribute);
            });

            const sortedAttributes = updatedAttributes.sort((attributeA, attributeB) => {
              const attributeAViews = attributeA.views || { [city]: 0 };
              const attributeAPriorities = attributeA.priorities || { [city]: 0 };
              const attributeBViews = attributeB.views || { [city]: 0 };
              const attributeBPriorities = attributeB.priorities || { [city]: 0 };

              const attributeACounter =
                noNaN(attributeAViews[city]) + noNaN(attributeAPriorities[city]);
              const attributeBCounter =
                noNaN(attributeBViews[city]) + noNaN(attributeBPriorities[city]);
              return attributeBCounter - attributeACounter;
            });

            await rubricsCollection.findOneAndUpdate(
              { _id: rubric._id },
              {
                ...counterUpdater,
                $set: {
                  attributes: sortedAttributes,
                },
              },
              { returnOriginal: false },
            );
          }

          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      },
    });
  },
});
