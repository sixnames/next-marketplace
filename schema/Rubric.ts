import { arg, inputObjectType, objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import {
  AttributesGroupModel,
  ProductModel,
  ProductsPaginationPayloadModel,
  RubricAttributesGroupModel,
  RubricCountersModel,
  RubricNavItemsModel,
  RubricVariantModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_ATTRIBUTES_GROUPS, COL_PRODUCTS, COL_RUBRIC_VARIANTS } from 'db/collectionNames';
import { productsPaginationQuery } from 'lib/productsPaginationQuery';
import { ObjectId } from 'mongodb';

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
    t.nonNull.list.nonNull.field('visibleOptions', {
      type: 'RubricNavItemAttributeOption',
    });
    t.nonNull.list.nonNull.field('hiddenOptions', {
      type: 'RubricNavItemAttributeOption',
    });
    t.nonNull.list.nonNull.field('options', {
      type: 'RubricNavItemAttributeOption',
    });
  },
});

export const RubricNavItems = objectType({
  name: 'RubricNavItems',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.boolean('isDisabled');
    t.nonNull.list.nonNull.field('attributes', {
      type: 'RubricNavItemAttribute',
    });
  },
});

export const RubricCounters = objectType({
  name: 'RubricCounters',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.int('totalDocs');
    t.nonNull.int('totalActiveDocs');
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
    t.nonNull.list.nonNull.field('attributes', {
      type: 'RubricAttribute',
    });
    t.nonNull.field('catalogueTitle', {
      type: 'RubricCatalogueTitle',
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

    // Rubric productsCounters field resolver
    t.nonNull.field('productsCounters', {
      type: 'RubricCounters',
      args: {
        input: arg({
          type: 'RubricProductsCountersInput',
        }),
      },
      resolve: async (source, args): Promise<RubricCountersModel> => {
        try {
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

          const attributesStage = args?.input?.attributesIds
            ? [
                {
                  $match: {
                    'attributes.attributeId': { $in: args.input.attributesIds },
                  },
                },
              ]
            : [];

          const excludedProductsStage = args?.input?.excludedProductsIds
            ? [
                {
                  $match: {
                    _id: { $nin: args.input.excludedProductsIds },
                  },
                },
              ]
            : [];

          const aggregation = await productsCollection
            .aggregate<RubricCountersModel>([
              {
                $match: {
                  rubricsIds: source._id,
                },
              },
              ...attributesStage,
              ...excludedProductsStage,
              {
                $facet: {
                  countAllDocs: [{ $match: { archive: false } }, { $count: 'totalDocs' }],
                  countActiveDocs: [
                    { $match: { active: true, archive: false } },
                    { $count: 'totalActiveDocs' },
                  ],
                },
              },
              {
                $addFields: {
                  totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
                },
              },
              {
                $addFields: {
                  totalDocs: '$totalDocsObject.totalDocs',
                },
              },
              {
                $addFields: {
                  totalActiveDocsObject: { $arrayElemAt: ['$countActiveDocs', 0] },
                },
              },
              {
                $addFields: {
                  totalActiveDocs: '$totalActiveDocsObject.totalActiveDocs',
                },
              },
              {
                $project: {
                  totalActiveDocs: 1,
                  totalDocs: 1,
                },
              },
            ])
            .toArray();

          const aggregationResult = aggregation[0];

          return {
            _id: new ObjectId(),
            totalActiveDocs: aggregationResult.totalActiveDocs || 0,
            totalDocs: aggregationResult.totalDocs || 0,
          };
        } catch (e) {
          console.log(e);
          return {
            _id: new ObjectId(),
            totalActiveDocs: 0,
            totalDocs: 0,
          };
        }
      },
    });

    // TODO optimize
    // Rubric navItems field resolver
    t.nonNull.field('navItems', {
      type: 'RubricNavItems',
      resolve: async (): Promise<RubricNavItemsModel> => {
        try {
          return {
            _id: new ObjectId(),
            attributes: [],
            isDisabled: true,
          };
        } catch (e) {
          console.log(e);
          return {
            _id: new ObjectId(),
            attributes: [],
            isDisabled: true,
          };
        }
      },
    });
  },
});
