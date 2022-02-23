import { getDbCollections } from 'db/mongodb';
import {
  DEFAULT_COMPANY_SLUG,
  FILTER_BRAND_COLLECTION_KEY,
  FILTER_BRAND_KEY,
  FILTER_CATEGORY_KEY,
  FILTER_MANUFACTURER_KEY,
  VIEWS_COUNTER_STEP,
} from 'lib/config/common';
import { getRequestParams, getSessionRole } from 'lib/sessionHelpers';
import { arg, extendType, inputObjectType, nonNull } from 'nexus';

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
          const collections = await getDbCollections();
          const { role } = await getSessionRole(context);
          const { citySlug } = await getRequestParams(context);
          const rubricsCollection = collections.rubricsCollection();
          const categoriesCollection = collections.categoriesCollection();
          const attributesCollection = collections.attributesCollection();
          const optionsCollection = collections.optionsCollection();
          const brandsCollection = collections.brandsCollection();
          const brandCollectionsCollection = collections.brandCollectionsCollection();
          const manufacturersCollection = collections.manufacturersCollection();

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
            const filterSlugs: string[] = [];
            const selectedCategoriesSlugs: string[] = [];

            filter.forEach((param) => {
              const paramArray = param.split('-');
              const slug = `${paramArray[0]}`;
              const value = `${paramArray[1]}`;

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
              filterSlugs.push(value);
            });

            const counterUpdater = {
              $inc: {
                [`views.${companySlug}.${citySlug}`]: VIEWS_COUNTER_STEP,
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
                    [`views.${companySlug}.${citySlug}.${rubric.slug}`]: VIEWS_COUNTER_STEP,
                  },
                },
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
                        $in: filterSlugs,
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
          console.log('updateCatalogueCounters error', e);
          return false;
        }
      },
    });
  },
});
