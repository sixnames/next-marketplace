import { OptionInterface } from 'db/uiInterfaces';
import { getAlgoliaProductsSearch } from 'lib/algoliaUtils';
import { castCatalogueFilters, castCatalogueParamToObject } from 'lib/catalogueUtils';
import { getAlphabetList } from 'lib/optionsUtils';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  BrandCollectionModel,
  BrandModel,
  CatalogueSearchResultModel,
  LanguageModel,
  ManufacturerModel,
  OptionAlphabetListModel,
  OptionModel,
  ProductAttributeModel,
  ProductModel,
  RubricAttributeModel,
  RubricModel,
  ShopProductModel,
} from 'db/dbModels';
import { getRequestParams, getSessionRole } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_LANGUAGES,
  COL_MANUFACTURERS,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  CATALOGUE_BRAND_COLLECTION_KEY,
  CATALOGUE_BRAND_KEY,
  CATALOGUE_MANUFACTURER_KEY,
  CATALOGUE_OPTION_SEPARATOR,
  DEFAULT_COMPANY_SLUG,
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

export const CatalogueSearchTopItemsInput = inputObjectType({
  name: 'CatalogueSearchTopItemsInput',
  definition(t) {
    t.objectId('companyId');
    t.string('companySlug', { default: DEFAULT_COMPANY_SLUG });
  },
});

export const CatalogueSearchInput = inputObjectType({
  name: 'CatalogueSearchInput',
  definition(t) {
    t.nonNull.string('search');
    t.objectId('companyId');
    t.string('companySlug', { default: DEFAULT_COMPANY_SLUG });
  },
});

export const CatalogueAdditionalOptionsInput = inputObjectType({
  name: 'CatalogueAdditionalOptionsInput',
  definition(t) {
    t.objectId('companyId');
    t.boolean('isSearchResult');
    t.nonNull.string('attributeSlug');
    t.nonNull.list.nonNull.string('filter');
    t.nonNull.string('rubricSlug');
  },
});

export const CatalogueQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return all options of current attribute for current catalogue rubric
    t.list.nonNull.field('getCatalogueAdditionalOptions', {
      type: 'OptionsAlphabetList',
      args: {
        input: nonNull(
          arg({
            type: 'CatalogueAdditionalOptionsInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OptionAlphabetListModel[] | null> => {
        const { db } = await getDatabase();
        const { city } = await getRequestParams(context);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const { companyId, filter, attributeSlug, rubricSlug, isSearchResult } = args.input;

        const {
          minPrice,
          maxPrice,
          realFilterOptions,
          noFiltersSelected,
          rubricSlug: filterRubrics,
        } = castCatalogueFilters({
          filters: filter,
        });

        const searchRubricsStage = filterRubrics
          ? {
              rubricSlug: {
                $in: filterRubrics,
              },
            }
          : {};

        const rubricStage = isSearchResult ? searchRubricsStage : { rubricSlug };

        let searchStage = {};
        if (isSearchResult) {
          // Get algolia search result
          const searchIds = await getAlgoliaProductsSearch({
            indexName: `${process.env.ALG_INDEX_SHOP_PRODUCTS}`,
            search: rubricSlug,
          });
          searchStage = {
            _id: {
              $in: searchIds,
            },
          };
        }

        const pricesStage =
          minPrice && maxPrice
            ? {
                price: {
                  $gte: minPrice,
                  $lte: maxPrice,
                },
              }
            : {};

        const optionsStage = noFiltersSelected
          ? {}
          : {
              selectedOptionsSlugs: {
                $in: realFilterOptions,
              },
            };

        const companyRubricsMatch = companyId ? { companyId } : {};

        const productsInitialMatch = {
          ...searchStage,
          ...rubricStage,
          ...companyRubricsMatch,
          citySlug: city,
          ...optionsStage,
          ...pricesStage,
        };

        const shopProductsAggregation = await shopProductsCollection
          .aggregate<OptionInterface>([
            {
              $match: { ...productsInitialMatch },
            },
            {
              $unwind: '$selectedOptionsSlugs',
            },
            {
              $addFields: {
                slugArray: {
                  $split: ['$selectedOptionsSlugs', CATALOGUE_OPTION_SEPARATOR],
                },
              },
            },
            {
              $addFields: {
                attributeSlug: {
                  $arrayElemAt: ['$slugArray', 0],
                },
                optionSlug: {
                  $arrayElemAt: ['$slugArray', 1],
                },
              },
            },
            {
              $match: {
                attributeSlug,
              },
            },
            {
              $group: {
                _id: '$attributeSlug',
                optionsSlugs: {
                  $addToSet: '$optionSlug',
                },
              },
            },
            {
              $lookup: {
                from: COL_OPTIONS,
                as: 'options',
                let: { optionsSlugs: '$optionsSlugs' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: ['$slug', '$$optionsSlugs'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $unwind: '$options',
            },
            {
              $replaceRoot: {
                newRoot: '$options',
              },
            },
          ])
          .toArray();

        return getAlphabetList<OptionModel>(shopProductsAggregation);
      },
    });

    // Should return top search items
    t.nonNull.field('getCatalogueSearchTopItems', {
      type: 'CatalogueSearchResult',
      description: 'Should return top search items',
      args: {
        input: nonNull(
          arg({
            type: 'CatalogueSearchTopItemsInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CatalogueSearchResultModel> => {
        try {
          const { city } = await getRequestParams(context);
          const { db } = await getDatabase();
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const { companyId, companySlug } = args.input;

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
                  [`priorities.${companySlug}.${city}`]: SORT_DESC,
                  [`views.${companySlug}.${city}`]: SORT_DESC,
                  _id: SORT_BY_ID_DIRECTION,
                },
              },
              { $limit: 3 },
            ])
            .toArray();

          const rubricsIds = rubrics.map(({ _id }) => _id);
          // console.log('Top rubrics ', new Date().getTime() - rubricsStart);

          // const productsStart = new Date().getTime();
          const companyRubricsMatch = companyId ? { companyId } : {};
          const products = await shopProductsCollection
            .aggregate<ProductModel>([
              {
                $match: {
                  ...companyRubricsMatch,
                  rubricId: { $in: rubricsIds },
                  citySlug: city,
                },
              },
              {
                $group: {
                  _id: '$productId',
                  itemId: { $first: '$itemId' },
                  rubricId: { $first: '$rubricId' },
                  rubricSlug: { $first: `$rubricSlug` },
                  slug: { $first: '$slug' },
                  mainImage: { $first: `$mainImage` },
                  originalName: { $first: `$originalName` },
                  nameI18n: { $first: `$nameI18n` },
                  views: { $max: `$views.${companySlug}.${city}` },
                  priorities: { $max: `$priorities.${companySlug}.${city}` },
                  minPrice: {
                    $min: '$price',
                  },
                  maxPrice: {
                    $min: '$price',
                  },
                  available: {
                    $max: '$available',
                  },
                  selectedOptionsSlugs: {
                    $addToSet: '$selectedOptionsSlugs',
                  },
                  shopProductsIds: {
                    $addToSet: '$_id',
                  },
                },
              },
              {
                $sort: {
                  priorities: SORT_DESC,
                  views: SORT_DESC,
                  available: SORT_DESC,
                  _id: SORT_DESC,
                },
              },
              { $limit: 3 },
              {
                $addFields: {
                  shopsCount: { $size: '$shopProductsIds' },
                  cardPrices: {
                    min: '$minPrice',
                    max: '$maxPrice',
                  },
                },
              },

              // Lookup product attributes
              {
                $lookup: {
                  from: COL_PRODUCT_ATTRIBUTES,
                  as: 'attributes',
                  let: {
                    productId: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$productId', '$productId'],
                        },
                        viewVariant: {
                          $in: [ATTRIBUTE_VIEW_VARIANT_LIST, ATTRIBUTE_VIEW_VARIANT_OUTER_RATING],
                        },
                      },
                    },
                    {
                      $lookup: {
                        from: COL_OPTIONS,
                        as: 'options',
                        let: {
                          optionsGroupId: '$optionsGroupId',
                          selectedOptionsIds: '$selectedOptionsIds',
                        },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $and: [
                                  {
                                    $eq: ['$optionsGroupId', '$$optionsGroupId'],
                                  },
                                  {
                                    $in: ['$_id', '$$selectedOptionsIds'],
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
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
        input: nonNull(
          arg({
            type: 'CatalogueSearchInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CatalogueSearchResultModel> => {
        try {
          const { city } = await getRequestParams(context);
          const { db } = await getDatabase();
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
          const { search, companyId, companySlug } = args.input;

          // Get all languages
          const languages = await languagesCollection.find({}).toArray();

          const searchByName = languages.map(({ slug }) => {
            return {
              [`nameI18n.${slug}`]: {
                $regex: search,
                $options: 'i',
              },
            };
          });

          // const rubricsStart = new Date().getTime();
          const rubrics = await rubricsCollection
            .aggregate([
              {
                $match: {
                  active: true,
                  $or: [...searchByName],
                },
              },
              {
                $sort: {
                  [`priorities.${companySlug}.${city}`]: SORT_DESC,
                  [`views.${companySlug}.${city}`]: SORT_DESC,
                  _id: SORT_BY_ID_DIRECTION,
                },
              },
              { $limit: 3 },
            ])
            .toArray();
          // console.log('Search rubrics ', new Date().getTime() - rubricsStart);

          // const productsStart = new Date().getTime();
          const searchIds = await getAlgoliaProductsSearch({
            indexName: `${process.env.ALG_INDEX_SHOP_PRODUCTS}`,
            search,
          });
          if (searchIds.length < 1) {
            return {
              products: [],
              rubrics,
            };
          }

          const companyRubricsMatch = companyId ? { companyId } : {};
          const products = await shopProductsCollection
            .aggregate<ProductModel>([
              {
                $match: {
                  _id: {
                    $in: searchIds,
                  },
                  ...companyRubricsMatch,
                  citySlug: city,
                },
              },
              {
                $group: {
                  _id: '$productId',
                  itemId: { $first: '$itemId' },
                  rubricId: { $first: '$rubricId' },
                  rubricSlug: { $first: `$rubricSlug` },
                  slug: { $first: '$slug' },
                  mainImage: { $first: `$mainImage` },
                  originalName: { $first: `$originalName` },
                  nameI18n: { $first: `$nameI18n` },
                  views: { $max: `$views.${companySlug}.${city}` },
                  priorities: { $max: `$priorities.${companySlug}.${city}` },
                  minPrice: {
                    $min: '$price',
                  },
                  maxPrice: {
                    $min: '$price',
                  },
                  available: {
                    $max: '$available',
                  },
                  selectedOptionsSlugs: {
                    $addToSet: '$selectedOptionsSlugs',
                  },
                  shopProductsIds: {
                    $addToSet: '$_id',
                  },
                },
              },
              {
                $sort: {
                  priorities: SORT_DESC,
                  views: SORT_DESC,
                  available: SORT_DESC,
                  _id: SORT_DESC,
                },
              },
              { $limit: 3 },
              {
                $addFields: {
                  shopsCount: { $size: '$shopProductsIds' },
                  cardPrices: {
                    min: '$minPrice',
                    max: '$maxPrice',
                  },
                },
              },

              // Lookup product attributes
              {
                $lookup: {
                  from: COL_PRODUCT_ATTRIBUTES,
                  as: 'attributes',
                  let: {
                    productId: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$productId', '$productId'],
                        },
                        viewVariant: {
                          $in: [ATTRIBUTE_VIEW_VARIANT_LIST, ATTRIBUTE_VIEW_VARIANT_OUTER_RATING],
                        },
                      },
                    },
                    {
                      $lookup: {
                        from: COL_OPTIONS,
                        as: 'options',
                        let: {
                          optionsGroupId: '$optionsGroupId',
                          selectedOptionsIds: '$selectedOptionsIds',
                        },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $and: [
                                  {
                                    $eq: ['$optionsGroupId', '$$optionsGroupId'],
                                  },
                                  {
                                    $in: ['$_id', '$$selectedOptionsIds'],
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ])
            .toArray();
          // console.log('Search products count ', products.length);
          // console.log('Search products ', new Date().getTime() - productsStart);

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
    t.string('companySlug', { default: DEFAULT_COMPANY_SLUG });
    t.nonNull.list.nonNull.string('filter');
    t.nonNull.string('rubricSlug');
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
          const { db } = await getDatabase();
          const { role } = await getSessionRole(context);
          const { city } = await getRequestParams(context);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const rubricAttributesCollection =
            db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
          const productAttributesCollection =
            db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
          const brandCollectionsCollection =
            db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
          const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);

          // Args
          const { input } = args;
          const { filter, companySlug, rubricSlug } = input;

          if (!role.isStaff) {
            const rubric = await rubricsCollection.findOne({ slug: rubricSlug });
            if (!rubric) {
              return false;
            }

            // cast additional filters
            const selectedBrandSlugs: string[] = [];
            const selectedBrandCollectionSlugs: string[] = [];
            const selectedManufacturerSlugs: string[] = [];
            const selectedAttributesSlugs: string[] = [];
            const selectedOptionsSlugs: string[] = [];

            filter.forEach((param) => {
              const castedParam = castCatalogueParamToObject(param);
              const { slug, value } = castedParam;

              if (slug === CATALOGUE_BRAND_KEY) {
                selectedBrandSlugs.push(value);
                return;
              }

              if (slug === CATALOGUE_BRAND_COLLECTION_KEY) {
                selectedBrandCollectionSlugs.push(value);
                return;
              }

              if (slug === CATALOGUE_MANUFACTURER_KEY) {
                selectedManufacturerSlugs.push(value);
                return;
              }

              selectedAttributesSlugs.push(slug);
              selectedOptionsSlugs.push(value);
            });

            const counterUpdater = {
              $inc: {
                [`views.${companySlug}.${city}`]: VIEWS_COUNTER_STEP,
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
            await rubricsCollection.findOneAndUpdate(
              {
                slug: rubricSlug,
              },
              counterUpdater,
            );

            // Update attributes counters
            if (selectedAttributesSlugs.length > 0) {
              await rubricAttributesCollection.updateMany(
                {
                  rubricId: rubric._id,
                  slug: {
                    $in: selectedAttributesSlugs,
                  },
                },
                counterUpdater,
              );

              await productAttributesCollection.updateMany(
                {
                  rubricId: rubric._id,
                  slug: {
                    $in: selectedAttributesSlugs,
                  },
                },
                counterUpdater,
              );

              const selectedRubricAttributes = await rubricAttributesCollection
                .find({
                  rubricId: rubric._id,
                  slug: {
                    $in: selectedAttributesSlugs,
                  },
                })
                .toArray();

              for await (const rubricAttribute of selectedRubricAttributes) {
                const { optionsGroupId } = rubricAttribute;

                if (optionsGroupId) {
                  await optionsCollection.updateMany(
                    {
                      optionsGroupId,
                      slug: {
                        $in: selectedOptionsSlugs,
                      },
                    },
                    counterUpdater,
                  );
                }
              }
            }
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
