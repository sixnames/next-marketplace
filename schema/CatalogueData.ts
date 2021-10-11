import { castCatalogueParamToObject } from 'lib/catalogueUtils';
import { arg, extendType, inputObjectType, nonNull } from 'nexus';
import {
  AttributeModel,
  BrandCollectionModel,
  BrandModel,
  CategoryModel,
  ManufacturerModel,
  OptionModel,
  ProductAttributeModel,
  RubricModel,
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
} from 'db/collectionNames';
import {
  FILTER_BRAND_COLLECTION_KEY,
  FILTER_BRAND_KEY,
  FILTER_CATEGORY_KEY,
  FILTER_MANUFACTURER_KEY,
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

              if (slug === FILTER_BRAND_KEY) {
                selectedBrandSlugs.push(value);
                return;
              }

              if (slug === FILTER_BRAND_COLLECTION_KEY) {
                selectedBrandCollectionSlugs.push(value);
                return;
              }

              if (slug === FILTER_MANUFACTURER_KEY) {
                selectedManufacturerSlugs.push(value);
                return;
              }

              if (slug === FILTER_CATEGORY_KEY) {
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
