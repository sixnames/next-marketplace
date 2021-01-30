import { get } from 'lodash';
import { arg, enumType, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  ASSETS_DIST_CONFIGS,
  CONFIG_VARIANTS_ENUMS,
  DEFAULT_CITY,
  DEFAULT_LOCALE,
  SORT_ASC,
} from 'config/common';
import { getRequestParams, getResolverValidationSchema } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import { ConfigModel, ConfigPayloadModel } from 'db/dbModels';
import { COL_CONFIGS } from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { updateAssetConfigSchema, updateConfigSchema } from 'validation/configSchema';
import { deleteUpload, storeUploads } from 'lib/assets';

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
        const db = await getDatabase();
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
    t.nonNull.objectId('configId');
    t.nonNull.json('cities');
  },
});

export const UpdateAssetConfigInput = inputObjectType({
  name: 'UpdateAssetConfigInput',
  definition(t) {
    t.nonNull.objectId('configId');
    t.nonNull.list.nonNull.upload('assets');
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
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateConfigSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
          const { input } = args;
          const { configId, cities } = input;

          // Check config availability
          const config = await configsCollection.findOne({ _id: configId });
          if (!config) {
            return {
              success: false,
              message: await getApiMessage('configs.update.error'),
            };
          }

          // Update config
          const updatedConfigResult = await configsCollection.findOneAndUpdate(
            { _id: configId },
            {
              $set: {
                cities,
              },
            },
            {
              returnOriginal: false,
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

    // Should asset update config
    t.nonNull.field('updateAssetConfig', {
      type: 'ConfigPayload',
      description: 'Should asset update config',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateAssetConfigInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ConfigPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateAssetConfigSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
          const { input } = args;
          const { configId } = input;

          // Check config availability
          const config = await configsCollection.findOne({ _id: configId });
          if (!config) {
            return {
              success: false,
              message: await getApiMessage('configs.updateAsset.notFound'),
            };
          }

          // Remove old asset
          const filePath = get(config.cities, `${DEFAULT_CITY}.${DEFAULT_LOCALE}`);
          const removed = await deleteUpload({ filePath: `${filePath}` });
          if (!removed) {
            return {
              success: false,
              message: await getApiMessage('configs.updateAsset.error'),
            };
          }

          // Update config
          const assets = await storeUploads({
            files: input.assets,
            dist: ASSETS_DIST_CONFIGS,
            itemId: config.slug,
          });
          const currentAsset = assets[0];
          if (!currentAsset) {
            return {
              success: false,
              message: await getApiMessage('configs.updateAsset.error'),
            };
          }

          const updatedConfigResult = await configsCollection.findOneAndUpdate(
            { _id: configId },
            {
              $set: {
                cities: {
                  [DEFAULT_CITY]: {
                    [DEFAULT_LOCALE]: [currentAsset.url],
                  },
                },
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedConfig = updatedConfigResult.value;
          if (!updatedConfigResult.ok || !updatedConfig) {
            return {
              success: false,
              message: await getApiMessage('configs.updateAsset.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('configs.updateAsset.success'),
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
