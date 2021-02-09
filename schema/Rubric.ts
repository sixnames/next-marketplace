import { CATALOGUE_NAV_VISIBLE_OPTIONS, DEFAULT_LOCALE } from 'config/common';
import { noNaN } from 'lib/numbers';
import { getRubricCatalogueAttributes } from 'lib/rubricUtils';
import { arg, inputObjectType, objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import {
  AttributesGroupModel,
  ConfigModel,
  ProductsPaginationPayloadModel,
  RubricAttributeModel,
  RubricAttributesGroupModel,
  RubricVariantModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_ATTRIBUTES_GROUPS, COL_CONFIGS, COL_RUBRIC_VARIANTS } from 'db/collectionNames';
import { productsPaginationQuery } from 'lib/productsPaginationQuery';

export const RubricProductsCountersInput = inputObjectType({
  name: 'RubricProductsCountersInput',
  definition(t) {
    t.list.nonNull.objectId('attributesIds', {
      description: 'Filter by current attributes',
    });
    t.list.nonNull.objectId('excludedProductsIds', {
      description: 'Exclude current products',
    });
  },
});

export const Rubric = objectType({
  name: 'Rubric',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
    t.nonNull.json('shortDescriptionI18n');
    t.nonNull.string('slug');
    t.nonNull.boolean('active');
    t.nonNull.objectId('variantId');
    t.nonNull.json('views');
    t.nonNull.json('priorities');
    t.nonNull.int('productsCount');
    t.nonNull.int('activeProductsCount');
    t.nonNull.json('shopProductsCountCities');
    t.nonNull.json('visibleInCatalogueCities');
    t.nonNull.list.nonNull.field('attributes', {
      type: 'RubricAttribute',
    });
    t.nonNull.field('catalogueTitle', {
      type: 'RubricCatalogueTitle',
    });

    // Rubric shopProductsCount field resolver
    t.nonNull.field('shopProductsCount', {
      type: 'Int',
      resolve: async (source, _args, context): Promise<number> => {
        const { getCityData } = await getRequestParams(context);
        return noNaN(getCityData(source.shopProductsCountCities));
      },
    });

    // Rubric visibleInCatalogue field resolver
    t.nonNull.field('visibleInCatalogue', {
      type: 'Boolean',
      resolve: async (source, _args, context): Promise<boolean> => {
        const { getCityData } = await getRequestParams(context);
        return Boolean(getCityData(source.visibleInCatalogueCities));
      },
    });

    // Rubric attributesGroups field resolver
    t.nonNull.list.nonNull.field('attributesGroups', {
      type: 'RubricAttributesGroup',
      resolve: async (source): Promise<RubricAttributesGroupModel[]> => {
        const db = await getDatabase();
        const attributesGroupsCollection = db.collection<AttributesGroupModel>(
          COL_ATTRIBUTES_GROUPS,
        );
        const attributesGroups = await attributesGroupsCollection
          .find({
            _id: { $in: source.attributesGroupsIds },
          })
          .toArray();

        return attributesGroups.map((attributesGroup) => {
          return {
            ...attributesGroup,
            attributes: source.attributes.filter(({ _id }) => {
              return attributesGroup.attributesIds.some((attributeId) => attributeId.equals(_id));
            }),
          };
        });
      },
    });

    // Rubric name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // Rubric description translation field resolver
    t.nonNull.field('description', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.descriptionI18n);
      },
    });

    // Rubric shortDescription translation field resolver
    t.nonNull.field('shortDescription', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.shortDescriptionI18n);
      },
    });

    // Rubric variant field resolver
    t.nonNull.field('variant', {
      type: 'RubricVariant',
      resolve: async (source): Promise<RubricVariantModel> => {
        const db = await getDatabase();
        const rubricVariantsCollection = db.collection<RubricVariantModel>(COL_RUBRIC_VARIANTS);
        const variant = await rubricVariantsCollection.findOne({ _id: source.variantId });
        if (!variant) {
          throw Error('Rubric variant not found');
        }

        return variant;
      },
    });

    // Rubric paginated products field resolver
    t.nonNull.field('products', {
      type: 'ProductsPaginationPayload',
      args: {
        input: arg({
          type: 'ProductsPaginationInput',
        }),
      },
      resolve: async (source, args, context): Promise<ProductsPaginationPayloadModel> => {
        const { city } = await getRequestParams(context);
        const paginationResult = await productsPaginationQuery({
          input: {
            ...args.input,
            rubricsIds: [source._id],
          },
          city,
        });
        return paginationResult;
      },
    });

    // Rubric navItems field resolver
    t.nonNull.list.nonNull.field('navItems', {
      type: 'RubricAttribute',
      resolve: async (source, _args, context): Promise<RubricAttributeModel[]> => {
        try {
          const { city } = await getRequestParams(context);
          const db = await getDatabase();
          const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);

          // Get nav options config
          const visibleOptionsConfig = await configsCollection.findOne({
            slug: 'stickyNavVisibleOptionsCount',
          });
          let maxVisibleOptions = CATALOGUE_NAV_VISIBLE_OPTIONS;
          if (visibleOptionsConfig) {
            const configCityData = visibleOptionsConfig.cities[city];
            if (configCityData && configCityData[DEFAULT_LOCALE]) {
              maxVisibleOptions =
                configCityData[DEFAULT_LOCALE][0] || CATALOGUE_NAV_VISIBLE_OPTIONS;
            }
          }

          const visibleAttributes = source.attributes.filter(
            ({ visibleInCatalogueCities, showInCatalogueNav }) => {
              return visibleInCatalogueCities[city] && showInCatalogueNav;
            },
          );

          const catalogueAttributes = getRubricCatalogueAttributes({
            attributes: visibleAttributes,
            rubricSlug: source.slug,
            city,
            maxVisibleOptions: noNaN(maxVisibleOptions),
          });

          return catalogueAttributes;
        } catch (e) {
          console.log(e);
          return [];
        }
      },
    });
  },
});
