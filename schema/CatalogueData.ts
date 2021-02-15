import { getFieldTranslation } from 'config/constantTranslations';
import {
  castCatalogueParamToObject,
  CastCatalogueParamToObjectPayloadInterface,
  getCatalogueAdditionalFilterOptions,
  getCatalogueAttribute,
  getCatalogueTitle,
  getParamOptionFirstValueByKey,
  SelectedFilterInterface,
} from 'lib/catalogueUtils';
import { updateRubricViews } from 'lib/countersUtils';
import { getCurrencyString } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getRubricCatalogueAttributes } from 'lib/rubricUtils';
import { ObjectId } from 'mongodb';
import { arg, extendType, list, nonNull, objectType, stringArg } from 'nexus';
import {
  CatalogueDataModel,
  CatalogueFilterAttributeModel,
  CatalogueFilterAttributeOptionModel,
  CatalogueFilterSelectedPricesModel,
  CatalogueSearchResultModel,
  LanguageModel,
  ProductModel,
  ProductsPaginationPayloadModel,
  RubricModel,
  RubricOptionModel,
} from 'db/dbModels';
import { getRequestParams, getSessionRole } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_LANGUAGES,
  COL_PRODUCTS,
  COL_RUBRICS,
} from 'db/collectionNames';
import {
  CATALOGUE_BRAND_COLLECTION_KEY,
  CATALOGUE_BRAND_KEY,
  CATALOGUE_FILTER_EXCLUDED_KEYS,
  CATALOGUE_MANUFACTURER_KEY,
  CATALOGUE_MAX_PRICE_KEY,
  CATALOGUE_MIN_PRICE_KEY,
  CATALOGUE_PRODUCTS_LIMIT,
  PAGE_DEFAULT,
  SORT_ASC,
  SORT_BY_CREATED_AT,
  SORT_BY_ID_DIRECTION,
  SORT_BY_KEY,
  SORT_DESC,
  SORT_DESC_STR,
  SORT_DIR_KEY,
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

export const CatalogueFilterSelectedPrices = objectType({
  name: 'CatalogueFilterSelectedPrices',
  definition(t) {
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
      resolve: async (_root, args, context): Promise<CatalogueDataModel | null> => {
        try {
          const sessionRole = await getSessionRole(context);
          const { city, getFieldLocale, locale } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

          // Args
          const { catalogueFilter, productsInput } = args;
          const [rubricSlug, ...allSelectedSlugs] = catalogueFilter;

          // Get selected filters and additional filters
          // and cast it to the objects
          const selectedOptionsSlugs: string[] = [];
          const castedAdditionalFilters: CastCatalogueParamToObjectPayloadInterface[] = [];
          allSelectedSlugs.forEach((param) => {
            const castedParam = castCatalogueParamToObject(param);
            const { slug } = castedParam;

            const isAdditional = CATALOGUE_FILTER_EXCLUDED_KEYS.includes(slug);
            if (isAdditional) {
              castedAdditionalFilters.push(castedParam);
              return;
            }

            selectedOptionsSlugs.push(param);
          });
          const selectedBrandSlugs: string[] = [];
          const selectedBrandCollectionSlugs: string[] = [];
          const selectedManufacturerSlugs: string[] = [];
          castedAdditionalFilters.forEach(({ slug, value }) => {
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

          // Update catalogue view counters
          const rubric = await updateRubricViews({
            rubricSlug,
            selectedOptionsSlugs,
            selectedBrandSlugs,
            selectedBrandCollectionSlugs,
            selectedManufacturerSlugs,
            sessionRole,
            city,
          });
          if (!rubric) {
            return null;
          }

          // Cast additional filters
          const { limit, page } = productsInput;
          const sortBy = getParamOptionFirstValueByKey({
            defaultValue: SORT_BY_CREATED_AT,
            castedParams: castedAdditionalFilters,
            slug: SORT_BY_KEY,
          });

          const sortDir = getParamOptionFirstValueByKey({
            defaultValue: SORT_DESC_STR,
            castedParams: castedAdditionalFilters,
            slug: SORT_DIR_KEY,
          });
          const castedSortDir = sortDir === SORT_DESC_STR ? SORT_DESC : SORT_ASC;

          const minPrice = getParamOptionFirstValueByKey({
            castedParams: castedAdditionalFilters,
            slug: CATALOGUE_MIN_PRICE_KEY,
          });

          const maxPrice = getParamOptionFirstValueByKey({
            castedParams: castedAdditionalFilters,
            slug: CATALOGUE_MAX_PRICE_KEY,
          });

          const sortByPriority = `priority.${city}`;
          const realLimit = limit || CATALOGUE_PRODUCTS_LIMIT;
          const realPage = page || PAGE_DEFAULT;
          const skip = realPage ? (realPage - 1) * realLimit : 0;
          const realSortDir = castedSortDir || SORT_DESC;
          let realSortBy = sortBy || sortByPriority;
          if (sortBy === 'price') {
            realSortBy = 'minPrice';
          }
          if (sortBy === 'priority' || sortBy === SORT_BY_CREATED_AT || sortBy === sortByPriority) {
            realSortBy = sortByPriority;
          }

          // Additional filters matchers
          const brandsMatch =
            selectedBrandSlugs.length > 0 ? { brandSlug: { $in: selectedBrandSlugs } } : {};

          const brandCollectionsMatch =
            selectedBrandCollectionSlugs.length > 0
              ? { brandCollectionSlug: { $in: selectedBrandCollectionSlugs } }
              : {};

          const manufacturersMatch =
            selectedManufacturerSlugs.length > 0
              ? { manufacturerSlug: { $in: selectedManufacturerSlugs } }
              : {};

          // Products pipelines
          // filter
          const selectedFiltersPipeline =
            selectedOptionsSlugs.length > 0
              ? {
                  selectedOptionsSlugs: { $in: selectedOptionsSlugs },
                }
              : {};

          // price range pipeline
          const priceRangePipeline =
            minPrice && maxPrice
              ? [
                  {
                    $match: {
                      [`minPriceCities.${city}`]: {
                        $gte: noNaN(minPrice),
                        $lte: noNaN(maxPrice),
                      },
                    },
                  },
                ]
              : [];

          // Products initial pipeline
          const productsInitialPipeline = [
            // initial match
            {
              $match: {
                rubricsIds: rubric._id,
                active: true,
                archive: false,
                // [`shopProductsCountCities.${city}`]: { $gt: 0 },
                ...selectedFiltersPipeline,
                ...brandsMatch,
                ...brandCollectionsMatch,
                ...manufacturersMatch,
              },
            },

            // add minPrice field
            { $addFields: { minPrice: `$minPriceCities.${city}` } },
          ];

          // Products main pipeline for filters counters
          const productsMainPipeline = [...productsInitialPipeline, ...priceRangePipeline];

          const productsAggregationResult = await productsCollection
            .aggregate<ProductsPaginationPayloadModel>([
              ...productsInitialPipeline,

              // sort
              {
                $sort: {
                  [realSortBy]: realSortDir,
                  [`priority.${city}`]: SORT_DESC,
                  [`views.${city}`]: SORT_DESC,
                },
              },

              // facet pagination totals
              {
                $facet: {
                  docs: [...priceRangePipeline, { $skip: skip }, { $limit: realLimit }],
                  countAllDocs: [...priceRangePipeline, { $count: 'totalDocs' }],
                  minPriceDocs: [
                    { $group: { _id: '$minPrice' } },
                    { $sort: { _id: SORT_ASC } },
                    { $limit: 1 },
                  ],
                  maxPriceDocs: [
                    { $group: { _id: '$minPrice' } },
                    { $sort: { _id: SORT_DESC } },
                    { $limit: 1 },
                  ],
                },
              },
              {
                $addFields: {
                  totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
                  minPriceDocsObject: { $arrayElemAt: ['$minPriceDocs', 0] },
                  maxPriceDocsObject: { $arrayElemAt: ['$maxPriceDocs', 0] },
                },
              },
              {
                $addFields: {
                  totalDocs: '$totalDocsObject.totalDocs',
                  minPrice: '$minPriceDocsObject._id',
                  maxPrice: '$maxPriceDocsObject._id',
                },
              },
              {
                $addFields: {
                  totalPagesFloat: {
                    $divide: ['$totalDocs', realLimit],
                  },
                },
              },
              {
                $addFields: {
                  totalPages: {
                    $ceil: '$totalPagesFloat',
                  },
                },
              },
              {
                $project: {
                  docs: 1,
                  totalDocs: 1,
                  totalPages: 1,
                  minPrice: 1,
                  maxPrice: 1,
                  hasPrevPage: {
                    $gt: [page, PAGE_DEFAULT],
                  },
                  hasNextPage: {
                    $lt: [page, '$totalPages'],
                  },
                },
              },
            ])
            .toArray();

          const aggregationResult = productsAggregationResult[0];

          const products = {
            ...aggregationResult,
            docs: aggregationResult.docs || [],
            minPrice: aggregationResult.minPrice || 0,
            maxPrice: aggregationResult.maxPrice || 0,
            totalDocs: aggregationResult.totalDocs || 0,
            totalActiveDocs: 0,
            totalPages: aggregationResult.totalPages || PAGE_DEFAULT,
            sortBy: realSortBy,
            sortDir: realSortDir,
            page: realPage,
            limit: realLimit,
          };

          // Catalogue filter
          // cast attributes for CatalogueFilterAttribute
          const selectedFilters: SelectedFilterInterface[] = [];
          const castedAttributes: CatalogueFilterAttributeModel[] = [];
          const attributes = await getRubricCatalogueAttributes({
            attributes: rubric.attributes,
            city,
          });

          for await (const attribute of attributes) {
            const { options } = attribute;
            const castedOptions: CatalogueFilterAttributeOptionModel[] = [];
            const selectedOptions: RubricOptionModel[] = [];

            for await (const option of options) {
              // check if selected
              const optionSlug = option.slug;
              const isSelected = allSelectedSlugs.includes(optionSlug);

              if (isSelected) {
                // Push to the selected options list for catalogue title config
                selectedOptions.push(option);
              }

              const optionNextSlug = isSelected
                ? catalogueFilter
                    .filter((pathArg) => {
                      return pathArg !== optionSlug;
                    })
                    .join('/')
                : [...catalogueFilter, optionSlug].join('/');

              // count products with current option
              const optionProducts = await productsCollection
                .aggregate<any>([
                  ...productsMainPipeline,

                  // option products match
                  {
                    $match: {
                      selectedOptionsSlugs: optionSlug,
                    },
                  },
                  {
                    $count: 'counter',
                  },
                ])
                .toArray();
              const counter = optionProducts[0]?.counter || 0;

              castedOptions.push({
                _id: new ObjectId(),
                name: getFieldLocale(option.nameI18n),
                slug: option.slug,
                nextSlug: `/${optionNextSlug}`,
                isSelected,
                isDisabled: counter < 1,
                counter,
              });
            }

            const otherSelectedValues = catalogueFilter.filter((param) => {
              const castedParam = castCatalogueParamToObject(param);
              return castedParam.slug !== attribute.slug;
            });
            const clearSlug = `/${otherSelectedValues.join('/')}`;

            const sortedOptions = castedOptions.sort((optionA, optionB) => {
              const isDisabledA = optionA.isDisabled ? 0 : 1;
              const isDisabledB = optionB.isDisabled ? 0 : 1;
              return isDisabledB - isDisabledA;
            });
            const disabledOptionsCount = sortedOptions.reduce((acc: number, { isDisabled }) => {
              if (isDisabled) {
                return acc + 1;
              }
              return acc;
            }, 0);

            const isSelected = sortedOptions.some(({ isSelected }) => isSelected);

            if (isSelected) {
              // Add selected items to the catalogue title config
              selectedFilters.push({
                attribute,
                options: selectedOptions,
              });
            }

            castedAttributes.push({
              _id: new ObjectId(),
              clearSlug,
              slug: attribute.slug,
              name: getFieldLocale(attribute.nameI18n),
              options: sortedOptions,
              isDisabled: disabledOptionsCount === sortedOptions.length,
              isSelected,
            });
          }

          // Brands
          const brandOptions = await getCatalogueAdditionalFilterOptions({
            productsMainPipeline,
            productForeignField: '$brandSlug',
            collectionSlugs: selectedBrandSlugs,
            filterKey: CATALOGUE_BRAND_KEY,
            collection: COL_BRANDS,
            catalogueFilterArgs: catalogueFilter,
            city,
          });
          const brandsAttribute = await getCatalogueAttribute({
            _id: new ObjectId(),
            slug: CATALOGUE_BRAND_KEY,
            name: getFieldTranslation(`catalogueFilter.brands.${locale}`),
            options: brandOptions.map((option) => {
              return {
                ...option,
                name: getFieldLocale(option.nameI18n),
              };
            }),
            catalogueFilter,
          });

          // Brand collections
          const brandCollectionOptions = await getCatalogueAdditionalFilterOptions({
            productsMainPipeline,
            productForeignField: '$brandCollectionSlug',
            collectionSlugs: selectedBrandCollectionSlugs,
            filterKey: CATALOGUE_BRAND_COLLECTION_KEY,
            collection: COL_BRAND_COLLECTIONS,
            catalogueFilterArgs: catalogueFilter,
            city,
          });
          const brandCollectionsAttribute = await getCatalogueAttribute({
            _id: new ObjectId(),
            slug: CATALOGUE_BRAND_COLLECTION_KEY,
            name: getFieldTranslation(`catalogueFilter.brandCollections.${locale}`),
            options: brandCollectionOptions.map((option) => {
              return {
                ...option,
                name: getFieldLocale(option.nameI18n),
              };
            }),
            catalogueFilter,
          });

          // Manufacturers
          const manufacturerOptions = await getCatalogueAdditionalFilterOptions({
            productsMainPipeline,
            productForeignField: '$manufacturerSlug',
            collectionSlugs: selectedManufacturerSlugs,
            filterKey: CATALOGUE_MANUFACTURER_KEY,
            collection: 'manufacturers',
            catalogueFilterArgs: catalogueFilter,
            city,
          });
          const manufacturersAttribute = await getCatalogueAttribute({
            _id: new ObjectId(),
            slug: CATALOGUE_MANUFACTURER_KEY,
            name: getFieldTranslation(`catalogueFilter.manufacturers.${locale}`),
            options: manufacturerOptions.map((option) => {
              return {
                ...option,
                name: getFieldLocale(option.nameI18n),
              };
            }),
            catalogueFilter,
          });

          // Final attributes list
          const finalAttributes = [
            ...castedAttributes,
            brandsAttribute,
            brandCollectionsAttribute,
            manufacturersAttribute,
          ];

          // Get selected prices
          const selectedFiltersWithoutPrices = catalogueFilter.filter((param) => {
            const castedParam = castCatalogueParamToObject(param);
            return (
              castedParam.slug !== CATALOGUE_MIN_PRICE_KEY &&
              castedParam.slug !== CATALOGUE_MAX_PRICE_KEY
            );
          });
          const selectedPrices: CatalogueFilterSelectedPricesModel | null =
            minPrice && maxPrice
              ? {
                  _id: new ObjectId(),
                  clearSlug: `/${selectedFiltersWithoutPrices.join('/')}`,
                  formattedMinPrice: getCurrencyString({ locale, value: minPrice }),
                  formattedMaxPrice: getCurrencyString({ locale, value: maxPrice }),
                }
              : null;

          // Get selected attributes
          const selectedAttributes = finalAttributes.reduce(
            (acc: CatalogueFilterAttributeModel[], attribute) => {
              if (!attribute.isSelected) {
                return acc;
              }
              return [
                ...acc,
                {
                  ...attribute,
                  _id: new ObjectId(),
                  options: attribute.options.filter((option) => {
                    return option.isSelected;
                  }),
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

          return {
            _id: new ObjectId(),
            rubric,
            catalogueTitle,
            products,
            catalogueFilter: {
              _id: new ObjectId(),
              attributes: finalAttributes,
              selectedAttributes,
              selectedPrices,
              clearSlug: `/${rubric.slug}`,
            },
          };
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
