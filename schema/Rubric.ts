import { arg, inputObjectType, objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import { ProductsPaginationPayloadModel, RubricVariantModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_RUBRIC_VARIANTS } from 'db/collectionNames';
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
    t.nonNull.field('catalogueTitle', {
      type: 'RubricCatalogueTitle',
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
        const { db } = await getDatabase();
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
            rubricId: source._id,
          },
          city,
        });
        return paginationResult;
      },
    });
  },
});
