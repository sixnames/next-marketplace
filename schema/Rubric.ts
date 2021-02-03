import { arg, inputObjectType, objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import {
  AttributeModel,
  ConfigModel,
  OptionModel,
  ProductModel,
  ProductsPaginationPayloadModel,
  RubricCountersModel,
  RubricModel,
  RubricNavItemAttributeModel,
  RubricNavItemAttributeOptionModel,
  RubricNavItemsModel,
  RubricVariantModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES,
  COL_CONFIGS,
  COL_OPTIONS,
  COL_PRODUCTS,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import { productsPaginationQuery } from 'lib/productsPaginationQuery';
import { ObjectId } from 'mongodb';
import { getRubricsTreeIds } from 'lib/rubricUtils';
import { noNaN } from 'lib/numbers';
import { LOCALE_NOT_FOUND_FIELD_MESSAGE, SORT_DESC } from 'config/common';

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
    t.nonNull.int('level');
    t.nonNull.boolean('active');
    t.objectId('parentId');
    t.nonNull.objectId('variantId');
    t.nonNull.json('views');
    t.nonNull.json('priorities');
    t.nonNull.field('catalogueTitle', {
      type: 'RubricCatalogueTitle',
    });
    t.nonNull.list.nonNull.field('attributesGroups', {
      type: 'RubricAttributesGroup',
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

    // Rubric parent field resolver
    t.field('parent', {
      type: 'Rubric',
      resolve: async (source): Promise<RubricModel | null> => {
        if (!source.parentId) {
          return null;
        }
        const db = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const parent = await rubricsCollection.findOne({ _id: source.parentId });
        return parent;
      },
    });

    // Rubric children field resolver
    t.nonNull.list.nonNull.field('children', {
      type: 'Rubric',
      args: {
        input: arg({
          type: 'GetRubricsTreeInput',
          default: {},
        }),
      },
      resolve: async (source, args): Promise<RubricModel[]> => {
        try {
          const db = await getDatabase();
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const { input } = args;
          const excludedIds = input?.excludedRubricsIds || [];
          const children = await rubricsCollection
            .find({ parentId: source._id, _id: { $nin: excludedIds } })
            .toArray();

          return children;
        } catch (e) {
          return [];
        }
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
          const rubricsIds = await getRubricsTreeIds(source._id);

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
                  rubricsIds: { $in: rubricsIds },
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
      resolve: async (source, _args, context): Promise<RubricNavItemsModel> => {
        try {
          const { city, getFieldLocale, getCityLocale } = await getRequestParams(context);
          const db = await getDatabase();
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { attributesGroups, catalogueTitle } = source;

          // Get nav config
          let maxVisibleOptions = 5;
          const navConfig = await configsCollection.findOne({
            slug: 'stickyNavVisibleOptionsCount',
          });
          if (navConfig) {
            const configCityData = getCityLocale(navConfig.cities) || [];
            const value = configCityData[0];
            if (value) {
              maxVisibleOptions = noNaN(value);
            }
          }

          // Get id's of children rubrics
          const rubricsIds = await getRubricsTreeIds(source._id);

          // Get all visible attributes id's
          const visibleAttributesIds = attributesGroups.reduce((acc: ObjectId[], group) => {
            return [...acc, ...group.showInCatalogueFilter];
          }, []);

          // Fetch sorted attributes
          const attributes = await attributesCollection
            .aggregate([
              { $match: { _id: { $in: visibleAttributesIds } } },
              {
                $sort: {
                  [`views.${city}`]: SORT_DESC,
                  [`priority.${city}`]: SORT_DESC,
                },
              },
            ])
            .toArray();

          // Cast attributes to RubricNavItemAttribute
          const navAttributes: RubricNavItemAttributeModel[] = [];

          for await (const attribute of attributes) {
            if (!attribute.optionsGroupId) {
              continue;
            }

            const options = await optionsCollection
              .aggregate([
                { $match: { _id: { $in: attribute.optionsIds } } },
                {
                  $sort: {
                    [`views.${city}`]: SORT_DESC,
                    [`priority.${city}`]: SORT_DESC,
                  },
                },
              ])
              .toArray();

            const resultOptions: RubricNavItemAttributeOptionModel[] = [];

            for await (const option of options) {
              // Get option name based on rubric catalogue title gender
              const { variants, nameI18n } = option;
              let filterNameString: string;
              const currentVariant = variants?.find(
                ({ gender }) => gender === catalogueTitle.gender,
              );
              const currentVariantName = getFieldLocale(currentVariant?.value);
              if (currentVariantName === LOCALE_NOT_FOUND_FIELD_MESSAGE || !currentVariant) {
                filterNameString = getFieldLocale(nameI18n);
              } else {
                filterNameString = currentVariantName;
              }

              // Get option slug for current attribute
              const optionSlug = `${attribute.slug}-${option.slug}`;

              // Count products with current option
              const products = await productsCollection
                .aggregate<any>([
                  // Initial products match
                  {
                    $match: {
                      rubricsIds: { $in: rubricsIds },
                      active: true,
                      'attributes.attributeSlugs': optionSlug,
                    },
                  },
                  // Lookup shop products
                  {
                    $lookup: {
                      from: COL_SHOP_PRODUCTS,
                      localField: '_id',
                      foreignField: 'productId',
                      as: 'shops',
                    },
                  },
                  // Count shop products
                  { $addFields: { shopsCount: { $size: '$shops' } } },

                  // Filter out products not added to the shops
                  { $match: { shopsCount: { $gt: 0 } } },
                  {
                    $count: 'counter',
                  },
                ])
                .toArray();
              const counter = noNaN(products[0]?.counter);

              resultOptions.push({
                _id: new ObjectId(),
                isDisabled: counter < 1,
                name: filterNameString,
                slug: `/${source.slug}/${optionSlug}`,
                counter,
              });
            }

            const sortedOptions = resultOptions.sort((optionA, optionB) => {
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

            const enabledOptions = sortedOptions.filter(({ isDisabled }) => !isDisabled);
            const visibleOptions = enabledOptions.slice(0, maxVisibleOptions);
            const hiddenOptions = enabledOptions.slice(+maxVisibleOptions);

            navAttributes.push({
              _id: new ObjectId(),
              options: sortedOptions,
              visibleOptions,
              hiddenOptions,
              name: getFieldLocale(attribute.nameI18n),
              isDisabled: disabledOptionsCount === sortedOptions.length,
            });
          }

          const disabledAttributesCount = navAttributes.reduce((acc: number, { isDisabled }) => {
            if (isDisabled) {
              return acc + 1;
            }
            return acc;
          }, 0);

          return {
            _id: new ObjectId(),
            attributes: navAttributes,
            isDisabled: disabledAttributesCount === navAttributes.length,
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
