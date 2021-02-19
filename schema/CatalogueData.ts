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
import { updateRubricOptionsViews, updateRubricViews } from 'lib/countersUtils';
import { getCurrencyString } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getRubricCatalogueAttributes, getRubricCatalogueAttributesB } from 'lib/rubricUtils';
import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, list, nonNull, objectType, stringArg } from 'nexus';
import {
  BrandCollectionModel,
  BrandModel,
  CatalogueDataModel,
  CatalogueFilterAttributeModel,
  CatalogueFilterAttributeOptionModel,
  CatalogueFilterSelectedPricesModel,
  CatalogueProductsModel,
  CatalogueSearchResultModel,
  ConfigModel,
  LanguageModel,
  ManufacturerModel,
  ProductModel,
  ProductsPaginationPayloadModel,
  RubricAttributeModel,
  RubricModel,
  RubricOptionModel,
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
  CATALOGUE_BRAND_COLLECTION_KEY,
  CATALOGUE_BRAND_KEY,
  CATALOGUE_FILTER_EXCLUDED_KEYS,
  CATALOGUE_FILTER_VISIBLE_ATTRIBUTES,
  CATALOGUE_FILTER_VISIBLE_OPTIONS,
  CATALOGUE_MANUFACTURER_KEY,
  CATALOGUE_MAX_PRICE_KEY,
  CATALOGUE_MIN_PRICE_KEY,
  CATALOGUE_PRODUCTS_LIMIT,
  DEFAULT_CITY,
  DEFAULT_LOCALE,
  PAGE_DEFAULT,
  SORT_ASC,
  SORT_BY_CREATED_AT,
  SORT_BY_ID_DIRECTION,
  SORT_BY_KEY,
  SORT_DESC,
  SORT_DESC_STR,
  SORT_DIR_KEY,
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

export const CatalogueProducts = objectType({
  name: 'CatalogueProducts',
  definition(t) {
    t.nonNull.objectId('lastProductId');
    t.nonNull.boolean('hasMore');
    t.nonNull.string('clearSlug');
    t.nonNull.field('rubric', {
      type: 'Rubric',
    });
    t.nonNull.list.nonNull.field('products', {
      type: 'Product',
    });
    t.nonNull.string('catalogueTitle');
    t.nonNull.list.nonNull.field('attributes', {
      type: 'CatalogueFilterAttribute',
    });
    t.nonNull.list.nonNull.field('selectedAttributes', {
      type: 'CatalogueFilterAttribute',
    });
  },
});

export const CatalogueProductsInput = inputObjectType({
  name: 'CatalogueProductsInput',
  definition(t) {
    t.objectId('key');
    t.nonNull.list.nonNull.string('filter');
  },
});

export const CatalogueQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return catalogue page data
    t.field('getCatalogueProducts', {
      type: 'CatalogueProducts',
      args: {
        input: nonNull(
          arg({
            type: 'CatalogueProductsInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CatalogueProductsModel | null> => {
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
          const { key, filter } = input;
          const [rubricSlug, ...filterOptions] = filter;

          // Get configs
          const catalogueFilterVisibleAttributesCount = await configsCollection.findOne({
            slug: 'catalogueFilterVisibleAttributesCount',
          });
          const catalogueFilterVisibleOptionsCount = await configsCollection.findOne({
            slug: 'catalogueFilterVisibleOptionsCount',
          });
          const catalogueVisibleAttributesCount =
            noNaN(catalogueFilterVisibleAttributesCount?.cities[DEFAULT_CITY][DEFAULT_LOCALE][0]) ||
            noNaN(CATALOGUE_FILTER_VISIBLE_ATTRIBUTES);
          const catalogueVisibleOptionsCount =
            noNaN(catalogueFilterVisibleOptionsCount?.cities[DEFAULT_CITY][DEFAULT_LOCALE][0]) ||
            noNaN(CATALOGUE_FILTER_VISIBLE_OPTIONS);

          // Get rubric
          const rubric = await rubricsCollection.findOne({ slug: rubricSlug });
          const rubricTime = new Date().getTime();
          console.log('Rubric and configs >>>>>>>>>>>>>>>> ', rubricTime - timeStart);

          if (!rubric) {
            return null;
          }

          // Get products
          const noFiltersSelected = filterOptions.length < 1;
          const keyStage = key
            ? {
                _id: {
                  $gt: key,
                },
              }
            : {};

          const initialFilterProductsMatch = noFiltersSelected
            ? { selectedOptionsSlugs: rubricSlug }
            : {
                selectedOptionsSlugs: {
                  $all: filter,
                },
              };

          const productsInitialMatch = {
            ...initialFilterProductsMatch,
            active: true,
            archive: false,
          };

          const productsMainPipeline = [
            {
              $match: {
                ...productsInitialMatch,
                ...keyStage,
              },
            },
            {
              $sort: {
                [`views.msk`]: SORT_DESC,
                [`priority.msk`]: SORT_DESC,
              },
            },
            {
              $limit: CATALOGUE_PRODUCTS_LIMIT,
            },
          ];

          const productsStartTime = new Date().getTime();
          const products = await productsCollection.aggregate(productsMainPipeline).toArray();
          const productsEndTime = new Date().getTime();
          console.log('Products >>>>>>>>>>>>>>>> ', productsEndTime - productsStartTime);

          const productsCountStartTime = new Date().getTime();
          const productsCountAggregation = await productsCollection
            .aggregate<any>([
              { $match: { ...productsInitialMatch } },
              { $limit: 3000 },
              {
                $count: 'counter',
              },
            ])
            .toArray();
          console.log(productsCountAggregation);
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
          const selectedFilters: SelectedFilterInterface[] = [];
          const castedAttributes: CatalogueFilterAttributeModel[] = [];
          const selectedAttributes: CatalogueFilterAttributeModel[] = [];
          const attributes = await getRubricCatalogueAttributesB({
            attributes: rubric.attributes,
            catalogueVisibleAttributesCount,
            catalogueVisibleOptionsCount,
            city,
          });

          for await (const attribute of attributes) {
            if (castedAttributes.length === catalogueVisibleAttributesCount) {
              break;
            }

            const { options } = attribute as RubricAttributeModel;
            const castedOptions: CatalogueFilterAttributeOptionModel[] = [];
            const selectedOptions: RubricOptionModel[] = [];

            for await (const option of options) {
              // check if selected
              const optionSlug = option.slug;
              const isSelected = filter.includes(optionSlug);

              if (isSelected) {
                // Push to the selected options list for catalogue title config
                selectedOptions.push(option);
              }

              const optionNextSlug = isSelected
                ? filter
                    .filter((pathArg) => {
                      return pathArg !== optionSlug;
                    })
                    .join('/')
                : [...filter, optionSlug].join('/');

              const optionProductsMatch = noFiltersSelected
                ? { selectedOptionsSlugs: rubricSlug }
                : {
                    selectedOptionsSlugs: {
                      $all: [...filter, optionSlug],
                    },
                  };

              // Check if option has products
              const optionProducts = await productsCollection.findOne({
                ...optionProductsMatch,
                active: true,
                archive: false,
              });
              const counter = optionProducts ? 1 : 0;

              castedOptions.push({
                _id: option._id,
                name: getFieldLocale(option.nameI18n),
                slug: option.slug,
                nextSlug: `/${optionNextSlug}`,
                isSelected,
                isDisabled: counter < 1,
                counter,
              });
            }

            const otherSelectedValues = filter.filter((param) => {
              const castedParam = castCatalogueParamToObject(param);
              return castedParam.slug !== attribute.slug;
            });
            const clearSlug = `/${otherSelectedValues.join('/')}`;

            const sortedOptions = castedOptions.sort((optionA, optionB) => {
              return optionB.counter - optionA.counter;
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

            const castedAttribute = {
              _id: attribute._id,
              clearSlug,
              slug: attribute.slug,
              name: getFieldLocale(attribute.nameI18n),
              options: sortedOptions.slice(0, catalogueVisibleOptionsCount),
              isDisabled: disabledOptionsCount === sortedOptions.length,
              isSelected,
            };

            if (isSelected) {
              selectedAttributes.push({
                ...castedAttribute,
                options: castedAttribute.options.filter((option) => {
                  return option.isSelected;
                }),
              });
            }

            castedAttributes.push(castedAttribute);
          }
          const afterOptions = new Date().getTime();
          console.log('Options >>>>>>>>>>>>>>>> ', afterOptions - beforeOptions);

          // Get catalogue title
          const catalogueTitle = getCatalogueTitle({
            catalogueTitle: rubric.catalogueTitle,
            selectedFilters,
            getFieldLocale,
            locale,
          });

          const timeEnd = new Date().getTime();
          console.log('Total time: ', timeEnd - timeStart);

          // Get keySet pagination product
          const lastProduct = products[products.length - 1];

          return {
            lastProductId: lastProduct._id,
            hasMore: key ? !key.equals(lastProduct._id) : false,
            clearSlug: `/${rubricSlug}`,
            rubric,
            products,
            catalogueTitle,
            attributes: castedAttributes,
            selectedAttributes,
          };
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    });

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
          let realSortBy: string | null = sortBy || sortByPriority;
          if (sortBy === 'price') {
            realSortBy = 'minPrice';
          }
          if (sortBy === 'priority' || sortBy === SORT_BY_CREATED_AT || sortBy === sortByPriority) {
            realSortBy = null;
          }

          // Additional filters matchers
          const brandsMatch =
            selectedBrandSlugs.length > 0
              ? [
                  {
                    $match: { brandSlug: { $in: selectedBrandSlugs } },
                  },
                ]
              : [];

          const brandCollectionsMatch =
            selectedBrandCollectionSlugs.length > 0
              ? [{ $match: { brandCollectionSlug: { $in: selectedBrandCollectionSlugs } } }]
              : [];

          const manufacturersMatch =
            selectedManufacturerSlugs.length > 0
              ? [{ $match: { manufacturerSlug: { $in: selectedManufacturerSlugs } } }]
              : [];

          // Products pipelines
          // filter
          const selectedFiltersPipeline =
            selectedOptionsSlugs.length > 0
              ? [
                  {
                    $match: {
                      selectedOptionsSlugs: { $in: selectedOptionsSlugs },
                    },
                  },
                ]
              : [];

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
              },
            },

            // catalogue filter match
            ...selectedFiltersPipeline,

            // brands, brandCollections and manufacturers matchers
            ...brandsMatch,
            ...brandCollectionsMatch,
            ...manufacturersMatch,

            // add minPrice field
            { $addFields: { minPrice: `$minPriceCities.${city}` } },
          ];

          // Sort stage
          const selectedSort = realSortBy
            ? {
                [realSortBy]: realSortDir,
              }
            : {};

          const sortPipeline = [
            {
              $sort: {
                ...selectedSort,
                [`priority.${city}`]: SORT_DESC,
                [`views.${city}`]: SORT_DESC,
              },
            },
          ];

          // Products main pipeline for filters counters
          const productsMainPipeline = [...productsInitialPipeline, ...priceRangePipeline];
          const productsFinalPipeline = [
            ...productsInitialPipeline,

            // sort
            ...sortPipeline,

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
          ];

          /*const stats = await productsCollection
            .aggregate<ProductsPaginationPayloadModel>(productsFinalPipeline, {
              allowDiskUse: true,
            })
            .explain();
          console.log(JSON.stringify(stats, null, 2));*/

          const productsAggregationResult = await productsCollection
            .aggregate<ProductsPaginationPayloadModel>(productsFinalPipeline, {
              allowDiskUse: true,
            })
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
            sortBy: realSortBy || sortByPriority,
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
              const optionProductsPipeline = [
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
              ];

              /*const optionsStats = await productsCollection
                .aggregate<any>(optionProductsPipeline)
                .explain();
              console.log(JSON.stringify(optionsStats, null, 2));*/

              const optionProducts = await productsCollection
                .aggregate<any>(optionProductsPipeline)
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
            type: 'CatalogueProductsInput',
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
              return selectedSlug.split('-')[0];
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
