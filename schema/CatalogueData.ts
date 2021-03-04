import { getPriceAttribute } from 'config/constantAttributes';
import {
  castCatalogueParamToObject,
  getCatalogueAttributes,
  getCatalogueTitle,
} from 'lib/catalogueUtils';
import { updateRubricOptionsViews } from 'lib/countersUtils';
import { noNaN } from 'lib/numbers';
import { getRubricCatalogueAttributes } from 'lib/rubricUtils';
import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType, stringArg } from 'nexus';
import {
  BrandCollectionModel,
  BrandModel,
  CatalogueAdditionalAttributesModel,
  CatalogueDataModel,
  CatalogueFilterAttributeModel,
  CatalogueFilterAttributeOptionModel,
  CatalogueSearchResultModel,
  ConfigModel,
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
  COL_CONFIGS,
  COL_LANGUAGES,
  COL_MANUFACTURERS,
  COL_PRODUCTS,
  COL_RUBRICS,
} from 'db/collectionNames';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  CATALOGUE_BRAND_COLLECTION_KEY,
  CATALOGUE_BRAND_KEY,
  CATALOGUE_FILTER_SORT_KEYS,
  CATALOGUE_FILTER_VISIBLE_ATTRIBUTES,
  CATALOGUE_FILTER_VISIBLE_OPTIONS,
  CATALOGUE_MANUFACTURER_KEY,
  CATALOGUE_OPTION_SEPARATOR,
  CATALOGUE_PRODUCTS_COUNT_LIMIT,
  CATALOGUE_PRODUCTS_LIMIT,
  DEFAULT_CITY,
  DEFAULT_LOCALE,
  PRICE_ATTRIBUTE_SLUG,
  SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY,
  SORT_ASC,
  SORT_BY_ID_DIRECTION,
  SORT_DESC,
  SORT_DESC_STR,
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

export const CatalogueData = objectType({
  name: 'CatalogueData',
  definition(t) {
    t.nonNull.objectId('_id');
    t.objectId('lastProductId');
    t.nonNull.boolean('hasMore');
    t.nonNull.string('clearSlug');
    t.nonNull.list.nonNull.string('filter');
    t.nonNull.field('rubric', {
      type: 'Rubric',
    });
    t.nonNull.list.nonNull.field('products', {
      type: 'Product',
    });
    t.nonNull.int('totalProducts');
    t.nonNull.string('catalogueTitle');
    t.nonNull.list.nonNull.field('attributes', {
      type: 'CatalogueFilterAttribute',
    });
    t.nonNull.list.nonNull.field('selectedAttributes', {
      type: 'CatalogueFilterAttribute',
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

export const CatalogueAdditionalAttributes = objectType({
  name: 'CatalogueAdditionalAttributes',
  definition(t) {
    t.nonNull.list.nonNull.field('additionalAttributes', {
      type: 'CatalogueFilterAttribute',
    });
  },
});

export const CatalogueAdditionalAttributesInput = inputObjectType({
  name: 'CatalogueAdditionalAttributesInput',
  definition(t) {
    t.nonNull.list.nonNull.string('shownAttributesSlugs');
    t.nonNull.list.nonNull.string('filter');
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
        input: nonNull(
          arg({
            type: 'CatalogueDataInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CatalogueDataModel | null> => {
        try {
          console.log(' ');
          console.log('===========================================================');
          const timeStart = new Date().getTime();
          const { getFieldLocale, city, locale } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);

          // Args
          const { input } = args;
          const { lastProductId, filter } = input;
          const [rubricSlug, ...filterOptions] = filter;

          // Get configs
          const catalogueFilterVisibleAttributesCount = await configsCollection.findOne({
            slug: 'catalogueFilterVisibleAttributesCount',
          });
          const catalogueFilterVisibleOptionsCount = await configsCollection.findOne({
            slug: 'catalogueFilterVisibleOptionsCount',
          });
          const visibleAttributesCount =
            noNaN(catalogueFilterVisibleAttributesCount?.cities[DEFAULT_CITY][DEFAULT_LOCALE][0]) ||
            noNaN(CATALOGUE_FILTER_VISIBLE_ATTRIBUTES);
          const visibleOptionsCount =
            noNaN(catalogueFilterVisibleOptionsCount?.cities[DEFAULT_CITY][DEFAULT_LOCALE][0]) ||
            noNaN(CATALOGUE_FILTER_VISIBLE_OPTIONS);

          // Get rubric
          const rubric = await rubricsCollection.findOne({ slug: rubricSlug });
          const rubricTime = new Date().getTime();
          console.log('Rubric and configs >>>>>>>>>>>>>>>> ', rubricTime - timeStart);

          if (!rubric) {
            return null;
          }

          // Cast selected options
          const realFilterOptions: string[] = [];
          let sortBy: string | null = null;
          let sortDir: string | null = null;

          const sortFilterOptions: string[] = [];
          let minPrice: number | null = null;
          let maxPrice: number | null = null;
          filterOptions.forEach((filterOption) => {
            const splittedOption = filterOption.split(CATALOGUE_OPTION_SEPARATOR);
            const filterOptionName = splittedOption[0];
            const filterOptionValue = splittedOption[1];
            if (filterOptionName) {
              const isSort = CATALOGUE_FILTER_SORT_KEYS.includes(filterOptionName);
              const isPriceRange = filterOptionName === PRICE_ATTRIBUTE_SLUG;

              if (isPriceRange) {
                const prices = filterOptionValue.split('_');
                minPrice = prices[0] ? noNaN(prices[0]) : null;
                maxPrice = prices[1] ? noNaN(prices[1]) : null;
                return;
              }

              if (isSort) {
                sortFilterOptions.push(filterOption);
                sortBy = filterOptionName;
                sortDir = filterOptionValue;
                return;
              }

              realFilterOptions.push(filterOption);
            }
          });

          // Get products
          const noFiltersSelected = realFilterOptions.length < 1;
          const keyStage = lastProductId
            ? {
                _id: {
                  $lt: lastProductId,
                },
              }
            : {};

          const pricesStage =
            minPrice && maxPrice
              ? {
                  [`minPriceCities.${city}`]: {
                    $gte: minPrice,
                    $lte: maxPrice,
                  },
                }
              : {};

          const initialFilterProductsMatch = noFiltersSelected
            ? { rubricId: rubric._id, ...pricesStage }
            : {
                rubricId: rubric._id,
                selectedOptionsSlugs: {
                  $all: realFilterOptions,
                },
                ...pricesStage,
              };

          const productsInitialMatch = {
            ...initialFilterProductsMatch,
          };

          // sort stage
          const castedSortDir = sortDir === SORT_DESC_STR ? SORT_DESC : SORT_ASC;
          let sortStage = {
            [`views.${city}`]: SORT_DESC,
            [`priority.${city}`]: SORT_DESC,
            _id: SORT_DESC,
          };

          // sort by price
          if (sortBy === SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY) {
            sortStage = {
              [`minPriceCities.${city}`]: castedSortDir,
              _id: SORT_DESC,
            };
          }

          const productsMainPipeline = [
            {
              $match: {
                ...productsInitialMatch,
                ...keyStage,
              },
            },
            {
              $sort: {
                ...sortStage,
              },
            },
            {
              $limit: CATALOGUE_PRODUCTS_LIMIT,
            },
          ];

          const productsStartTime = new Date().getTime();
          const products = await productsCollection.aggregate(productsMainPipeline).toArray();
          /*const productsExplain = await productsCollection
            .aggregate(productsMainPipeline)
            .explain();
          console.log(JSON.stringify(productsExplain, null, 2));*/

          const productsEndTime = new Date().getTime();
          console.log('Products >>>>>>>>>>>>>>>> ', productsEndTime - productsStartTime);

          const productsCountStartTime = new Date().getTime();
          const productsCountAggregation = await productsCollection
            .aggregate<any>([
              { $match: { ...productsInitialMatch } },
              { $limit: CATALOGUE_PRODUCTS_COUNT_LIMIT },
              {
                $count: 'counter',
              },
            ])
            .toArray();
          const totalProducts = productsCountAggregation[0]
            ? productsCountAggregation[0].counter
            : 0;
          const productsCountEndTime = new Date().getTime();
          console.log(
            `Products count ${totalProducts} >>>>>>>>>>>>>>>> `,
            productsCountEndTime - productsCountStartTime,
          );

          // Get filter attributes
          const beforeOptions = new Date().getTime();
          const attributes = await getRubricCatalogueAttributes({
            attributes: rubric.attributes,
            visibleAttributesCount,
            visibleOptionsCount,
            city,
          });
          const finalAttributes = [getPriceAttribute(), ...attributes];
          const { selectedFilters, castedAttributes } = await getCatalogueAttributes({
            attributes: finalAttributes,
            rubricId: rubric._id,
            realFilterOptions,
            getFieldLocale,
            city,
            filter,
            noFiltersSelected,
            visibleOptionsCount,
            pricesStage,
          });
          const afterOptions = new Date().getTime();
          console.log('Options >>>>>>>>>>>>>>>> ', afterOptions - beforeOptions);

          // Get selected attributes
          const castedFilters = filter.map((param) => castCatalogueParamToObject(param));
          const selectedAttributes = rubric.attributes.reduce(
            (acc: CatalogueFilterAttributeModel[], attribute) => {
              if (
                attribute.variant !== ATTRIBUTE_VARIANT_SELECT &&
                attribute.variant !== ATTRIBUTE_VARIANT_MULTIPLE_SELECT
              ) {
                return acc;
              }
              const currentFilter = castedFilters.find(({ slug }) => attribute.slug === slug);
              if (!currentFilter) {
                return acc;
              }

              const options = attribute.options.reduce(
                (acc: CatalogueFilterAttributeOptionModel[], option) => {
                  if (!filter.includes(option.slug)) {
                    return acc;
                  }

                  const nextSlug = filter
                    .filter((pathArg) => {
                      return pathArg !== option.slug;
                    })
                    .join('/');
                  return [
                    ...acc,
                    {
                      _id: new ObjectId(),
                      clearSlug: '',
                      slug: option.slug,
                      name: getFieldLocale(option.nameI18n),
                      counter: 1,
                      isSelected: true,
                      isDisabled: false,
                      nextSlug: `/${nextSlug}`,
                    },
                  ];
                },
                [],
              );

              return [
                ...acc,
                {
                  _id: new ObjectId(),
                  clearSlug: '',
                  slug: attribute.slug,
                  name: getFieldLocale(attribute.nameI18n),
                  isSelected: true,
                  isDisabled: false,
                  options,
                },
              ];
            },
            [],
          );

          // Get catalogue title
          const catalogueTitle = getCatalogueTitle({
            catalogueTitle: rubric.catalogueTitle,
            selectedFilters,
            getFieldLocale,
            locale,
          });

          // Get keySet pagination
          const lastProduct = products[products.length - 1];
          const finalTotalProducts =
            totalProducts < CATALOGUE_PRODUCTS_COUNT_LIMIT
              ? totalProducts
              : CATALOGUE_PRODUCTS_COUNT_LIMIT;
          let hasMore = !(products.length < CATALOGUE_PRODUCTS_LIMIT);
          if (lastProduct && lastProductId) {
            hasMore =
              !lastProductId.equals(lastProduct?._id) &&
              !(products.length < CATALOGUE_PRODUCTS_LIMIT);
          }

          const sortPathname =
            sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';

          const timeEnd = new Date().getTime();
          console.log('Total time: ', timeEnd - timeStart);

          return {
            _id: rubric._id,
            lastProductId: lastProduct?._id,
            hasMore,
            clearSlug: `/${rubricSlug}${sortPathname}`,
            filter,
            rubric,
            products,
            catalogueTitle,
            totalProducts: finalTotalProducts,
            attributes: castedAttributes,
            selectedAttributes,
          };
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    });

    // Should return catalogue additional attributes
    t.nonNull.field('getCatalogueAdditionalAttributes', {
      type: 'CatalogueAdditionalAttributes',
      description: 'Should return catalogue additional attributes',
      args: {
        input: nonNull(
          arg({
            type: 'CatalogueAdditionalAttributesInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CatalogueAdditionalAttributesModel> => {
        try {
          console.log(' ');
          console.log('Additional attributes');
          const timeStart = new Date().getTime();
          const { getFieldLocale, city } = await getRequestParams(context);
          const db = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);

          // Args
          const { input } = args;
          const { shownAttributesSlugs, filter } = input;
          const [rubricSlug, ...filterOptions] = filter;

          // Get configs
          const catalogueFilterVisibleOptionsCount = await configsCollection.findOne({
            slug: 'catalogueFilterVisibleOptionsCount',
          });
          const visibleOptionsCount =
            noNaN(catalogueFilterVisibleOptionsCount?.cities[DEFAULT_CITY][DEFAULT_LOCALE][0]) ||
            noNaN(CATALOGUE_FILTER_VISIBLE_OPTIONS);

          // Get rubric
          const rubric = await rubricsCollection.findOne({ slug: rubricSlug });

          if (!rubric) {
            return {
              additionalAttributes: [],
            };
          }

          // Cast selected options
          const realFilterOptions: string[] = [];
          let minPrice: number | null = null;
          let maxPrice: number | null = null;
          filterOptions.forEach((filterOption) => {
            const splittedOption = filterOption.split(CATALOGUE_OPTION_SEPARATOR);
            const filterOptionName = splittedOption[0];
            const filterOptionValue = splittedOption[1];
            if (filterOptionName) {
              const isPriceRange = filterOptionName === PRICE_ATTRIBUTE_SLUG;

              if (isPriceRange) {
                const prices = filterOptionValue.split('_');
                minPrice = prices[0] ? noNaN(prices[0]) : null;
                maxPrice = prices[1] ? noNaN(prices[1]) : null;
                return;
              }

              realFilterOptions.push(filterOption);
            }
          });

          const pricesStage =
            minPrice && maxPrice
              ? {
                  [`minPriceCities.${city}`]: {
                    $gte: minPrice,
                    $lte: maxPrice,
                  },
                }
              : {};

          const noFiltersSelected = realFilterOptions.length < 1;

          const attributes = await getRubricCatalogueAttributes({
            attributes: rubric.attributes,
            visibleOptionsCount: 3,
            city,
            attributeCondition: ({ slug, showInCatalogueFilter, variant }) => {
              return (
                !shownAttributesSlugs.includes(slug) &&
                showInCatalogueFilter &&
                (variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
                  variant === ATTRIBUTE_VARIANT_SELECT)
              );
            },
          });

          const { castedAttributes } = await getCatalogueAttributes({
            attributes,
            rubricId: rubric._id,
            realFilterOptions,
            getFieldLocale,
            city,
            filter,
            noFiltersSelected,
            visibleOptionsCount,
            pricesStage,
          });

          const timeEnd = new Date().getTime();
          console.log('Additional attributes total time: ', timeEnd - timeStart);

          return {
            additionalAttributes: castedAttributes,
          };
        } catch (e) {
          console.log(e);
          return {
            additionalAttributes: [],
          };
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
                attribute.views[city] = noNaN(attribute.views[city]) + VIEWS_COUNTER_STEP;
                const updatedOptions = updateRubricOptionsViews({
                  selectedOptionsSlugs: filter,
                  options: attribute.options,
                  city,
                }).sort((optionA, optionB) => {
                  const optionACounter =
                    noNaN(optionA.views[city]) +
                    noNaN(optionA.priorities[city]) +
                    noNaN(optionA.shopProductsCountCities[city]);
                  const optionBCounter =
                    noNaN(optionB.views[city]) +
                    noNaN(optionB.priorities[city]) +
                    noNaN(optionA.shopProductsCountCities[city]);
                  return optionBCounter - optionACounter;
                });
                attribute.options = updatedOptions;
              }
              updatedAttributes.push(attribute);
            });

            const sortedAttributes = updatedAttributes.sort((attributeA, attributeB) => {
              const optionACounter =
                noNaN(attributeA.views[city]) + noNaN(attributeA.priorities[city]);
              const optionBCounter =
                noNaN(attributeB.views[city]) + noNaN(attributeB.priorities[city]);
              return optionBCounter - optionACounter;
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
