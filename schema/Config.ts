import { CategoryInterface } from 'db/uiInterfaces';
import { alwaysArray } from 'lib/arrayUtils';
import { phoneToRaw } from 'lib/phoneUtils';
import { getTreeFromList } from 'lib/treeUtils';
import { arg, enumType, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  DEFAULT_COMPANY_SLUG,
  CONFIG_VARIANTS_ENUMS,
  SORT_ASC,
  DEFAULT_LOCALE,
  FILTER_SEPARATOR,
} from 'config/common';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import { CategoryModel, ConfigModel, ConfigPayloadModel, ObjectIdModel } from 'db/dbModels';
import { COL_CATEGORIES, COL_CONFIGS } from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { get } from 'lodash';

export const ConfigVariant = enumType({
  name: 'ConfigVariant',
  members: CONFIG_VARIANTS_ENUMS,
  description: 'Site config variant enum.',
});

export const Config = objectType({
  name: 'Config',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.boolean('multi', {
      description: 'Set to true if config is able to hold multiple values.',
    });
    t.nonNull.list.nonNull.string('acceptedFormats', {
      description: 'Accepted formats for asset config',
    });
    t.nonNull.string('slug');
    t.nonNull.string('group');
    t.nonNull.string('companySlug');
    t.nonNull.string('name');
    t.string('description');
    t.nonNull.json('cities', {
      description: `
      Each key is city slug with value for current city.
      Each city contains object with key as locale and value for current locale
      `,
    });
    t.field('variant', {
      type: 'ConfigVariant',
    });

    // Config value resolver
    t.nonNull.list.nonNull.field('value', {
      type: 'String',
      description: 'Returns current value of current city and locale.',
      resolve: async (source, _args, context): Promise<string[]> => {
        const { getCityLocale } = await getRequestParams(context);
        return getCityLocale(source.cities);
      },
    });

    // Config single value resolver
    t.nonNull.field('singleValue', {
      type: 'String',
      description: 'Returns first value of current city and locale.',
      resolve: async (source, _args, context): Promise<string> => {
        const { getCityLocale } = await getRequestParams(context);
        return getCityLocale(source.cities)[0];
      },
    });
  },
});

// Config Queries
export const ConfigQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('getAllConfigs', {
      type: 'Config',
      resolve: async (): Promise<ConfigModel[]> => {
        const { db } = await getDatabase();
        const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
        const configs = await configsCollection.find({}, { sort: { index: SORT_ASC } }).toArray();
        return configs;
      },
    });
  },
});

export const ConfigPayload = objectType({
  name: 'ConfigPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Config',
    });
  },
});

export const UpdateConfigInput = inputObjectType({
  name: 'UpdateConfigInput',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.boolean('multi');
    t.nonNull.list.nonNull.string('acceptedFormats');
    t.nonNull.string('slug');
    t.nonNull.string('companySlug');
    t.nonNull.string('group');
    t.nonNull.string('name');
    t.string('description');
    t.nonNull.json('cities');
    t.nonNull.field('variant', {
      type: 'ConfigVariant',
    });
  },
});

export const UpdateVisibleCategoriesInNavDropdownInput = inputObjectType({
  name: 'UpdateVisibleCategoriesInNavDropdownInput',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.boolean('multi');
    t.nonNull.list.nonNull.string('acceptedFormats');
    t.nonNull.string('slug');
    t.nonNull.string('companySlug');
    t.nonNull.string('group');
    t.nonNull.string('name');
    t.string('description');
    t.nonNull.json('cities');
    t.nonNull.field('variant', {
      type: 'ConfigVariant',
    });
    t.nonNull.objectId('categoryId');
    t.nonNull.objectId('rubricId');
    t.nonNull.string('citySlug');
  },
});

// Config Mutations
export const ConfigMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should update config
    t.nonNull.field('updateConfig', {
      type: 'ConfigPayload',
      description: 'Should update config',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateConfigInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ConfigPayloadModel> => {
        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug:
              args.input.companySlug === DEFAULT_COMPANY_SLUG
                ? 'updateConfig'
                : 'updateCompanyConfig',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          // Validate
          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
          const { input } = args;
          const { _id, ...values } = input;

          // cast phone value
          const castedValues =
            values.variant === 'tel'
              ? {
                  ...values,
                  cities: Object.keys(values.cities).reduce((acc: Record<string, any>, cityKey) => {
                    const city = values.cities[cityKey];
                    acc[cityKey] = Object.keys(city).reduce(
                      (localeAcc: Record<string, any>, localeKey) => {
                        const localeValue = alwaysArray(city[localeKey]);
                        localeAcc[localeKey] = localeValue.map((phone) => phoneToRaw(phone));
                        return localeAcc;
                      },
                      {},
                    );
                    return acc;
                  }, {}),
                }
              : values;

          // Update config
          const updatedConfigResult = await configsCollection.findOneAndUpdate(
            {
              _id,
            },
            {
              $set: castedValues,
            },
            {
              returnDocument: 'after',
              upsert: true,
            },
          );
          const updatedConfig = updatedConfigResult.value;
          if (!updatedConfigResult.ok || !updatedConfig) {
            return {
              success: false,
              message: await getApiMessage('configs.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('configs.update.success'),
            payload: updatedConfig,
          };
        } catch (e) {
          return {
            success: false,
            message: await getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update nav categories config
    t.nonNull.field('updateVisibleCategoriesInNavDropdown', {
      type: 'ConfigPayload',
      description: 'Should update nav categories config',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateVisibleCategoriesInNavDropdownInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ConfigPayloadModel> => {
        const childCategoryIds: ObjectIdModel[] = [];
        function getChildCategoryIds(category: CategoryInterface) {
          childCategoryIds.push(category._id);
          (category.categories || []).forEach(getChildCategoryIds);
        }

        try {
          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug:
              args.input.companySlug === DEFAULT_COMPANY_SLUG
                ? 'updateConfig'
                : 'updateCompanyConfig',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
          const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
          const { input } = args;
          const { _id, rubricId, categoryId, citySlug, cities, ...values } = input;

          const rubricCategoriesAggregation = await categoriesCollection
            .aggregate<CategoryModel>([
              {
                $match: {
                  rubricId,
                },
              },
            ])
            .toArray();
          const currentCategory = rubricCategoriesAggregation.find(({ _id }) => {
            return _id.equals(categoryId);
          });
          if (!currentCategory) {
            return {
              success: false,
              message: await getApiMessage('configs.update.error'),
            };
          }

          const childCategories = getTreeFromList({
            list: rubricCategoriesAggregation,
            childrenFieldName: 'categories',
            parentId: currentCategory._id,
          });

          let prevCityValue = alwaysArray(get(cities, `${citySlug}.${DEFAULT_LOCALE}`));

          const castedValue = `${rubricId.toHexString()}${FILTER_SEPARATOR}${categoryId.toHexString()}`;
          const exist = prevCityValue.includes(castedValue);
          if (exist) {
            childCategories.forEach(getChildCategoryIds);
            const castedChildValues = childCategoryIds.map((categoryId) => {
              return `${rubricId.toHexString()}${FILTER_SEPARATOR}${categoryId.toHexString()}`;
            });
            prevCityValue = prevCityValue.filter((prevValue) => {
              return ![...castedChildValues, castedValue].includes(prevValue);
            });
          } else {
            prevCityValue.push(castedValue);
          }

          // Update config
          const updatedConfigResult = await configsCollection.findOneAndUpdate(
            {
              _id,
            },
            {
              $set: {
                ...values,
                cities: {
                  ...cities,
                  [citySlug]: {
                    [DEFAULT_LOCALE]: prevCityValue,
                  },
                },
              },
            },
            {
              returnDocument: 'after',
              upsert: true,
            },
          );
          const updatedConfig = updatedConfigResult.value;
          if (!updatedConfigResult.ok || !updatedConfig) {
            return {
              success: false,
              message: await getApiMessage('configs.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('configs.update.success'),
            payload: updatedConfig,
          };
        } catch (e) {
          return {
            success: false,
            message: await getResolverErrorMessage(e),
          };
        }
      },
    });
  },
});
