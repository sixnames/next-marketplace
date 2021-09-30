import { OptionInterface } from 'db/uiInterfaces';
import { getAlgoliaProductsSearch } from 'lib/algoliaUtils';
import { castCatalogueFilters, castCatalogueParamToObject } from 'lib/catalogueUtils';
import { getAlphabetList } from 'lib/optionsUtils';
import { arg, extendType, inputObjectType, nonNull } from 'nexus';
import {
  AttributeModel,
  BrandCollectionModel,
  BrandModel,
  CategoryModel,
  ManufacturerModel,
  OptionAlphabetListModel,
  OptionModel,
  ProductAttributeModel,
  RubricModel,
  ShopProductModel,
} from 'db/dbModels';
import { getRequestParams, getSessionRole } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CATEGORIES,
  COL_MANUFACTURERS,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import {
  CATALOGUE_BRAND_COLLECTION_KEY,
  CATALOGUE_BRAND_KEY,
  CATALOGUE_CATEGORY_KEY,
  CATALOGUE_MANUFACTURER_KEY,
  FILTER_SEPARATOR,
  DEFAULT_COMPANY_SLUG,
  VIEWS_COUNTER_STEP,
} from 'config/common';

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
        const { city, locale } = await getRequestParams(context);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const { companyId, filter, attributeSlug, rubricSlug, isSearchResult } = args.input;

        const {
          minPrice,
          maxPrice,
          realFilterOptions,
          noFiltersSelected,
          rubricFilters: filterRubrics,
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
            indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
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
                  $split: ['$selectedOptionsSlugs', FILTER_SEPARATOR],
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

        return getAlphabetList<OptionModel>({
          entityList: shopProductsAggregation,
          locale,
        });
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
          const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
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
            const selectedCategoriesSlugs: string[] = [];

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

              if (slug === CATALOGUE_CATEGORY_KEY) {
                selectedCategoriesSlugs.push(value);
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

            // Update categories
            if (selectedCategoriesSlugs.length > 0) {
              await categoriesCollection.updateMany(
                { slug: { $in: selectedCategoriesSlugs } },
                counterUpdater,
              );
            }

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
              await attributesCollection.updateMany(
                {
                  slug: {
                    $in: selectedAttributesSlugs,
                  },
                },
                {
                  $inc: {
                    [`views.${companySlug}.${city}.${rubric.slug}`]: VIEWS_COUNTER_STEP,
                  },
                },
              );

              await productAttributesCollection.updateMany(
                {
                  slug: {
                    $in: selectedAttributesSlugs,
                  },
                },
                counterUpdater,
              );

              const selectedAttributes = await attributesCollection
                .find({
                  slug: {
                    $in: selectedAttributesSlugs,
                  },
                })
                .toArray();

              for await (const attribute of selectedAttributes) {
                const { optionsGroupId } = attribute;

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
