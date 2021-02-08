import { noNaN } from 'lib/numbers';
import { arg, inputObjectType, objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import {
  AttributesGroupModel,
  ProductsPaginationPayloadModel,
  RubricAttributesGroupModel,
  RubricNavItemAttributeModel,
  RubricVariantModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_ATTRIBUTES_GROUPS, COL_RUBRIC_VARIANTS } from 'db/collectionNames';
import { productsPaginationQuery } from 'lib/productsPaginationQuery';

export const RubricNavItemAttributeOption = objectType({
  name: 'RubricNavItemAttributeOption',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('slug');
    t.nonNull.string('name');
    t.nonNull.boolean('isDisabled');
    t.nonNull.int('counter');
  },
});

export const RubricNavItemAttribute = objectType({
  name: 'RubricNavItemAttribute',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('name');
    t.nonNull.boolean('isDisabled');
    t.nonNull.list.nonNull.field('options', {
      type: 'RubricNavItemAttributeOption',
    });
  },
});

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

    // TODO optimize
    // Rubric navItems field resolver
    t.nonNull.list.nonNull.field('navItems', {
      type: 'RubricNavItemAttribute',
      resolve: async (): Promise<RubricNavItemAttributeModel[]> => {
        try {
          return [];
        } catch (e) {
          console.log(e);
          return [];
        }
      },
    });
  },
});
