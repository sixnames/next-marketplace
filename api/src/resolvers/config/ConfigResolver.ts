import {
  Arg,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Config, ConfigCity, ConfigModel } from '../../entities/Config';
import { UpdateConfigInput } from './UpdateConfigInput';
import PayloadType from '../common/PayloadType';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateAssetConfigInput } from './UpdateAssetConfigInput';
import storeUploads from '../../utils/assets/storeUploads';
import { removeUpload } from '../../utils/assets/removeUpload';
import {
  updateAssetConfigSchema,
  updateConfigSchema,
  updateConfigsSchema,
} from '../../validation/configSchema';
import getApiMessage from '../../utils/translations/getApiMessage';
import { getOperationsConfigs } from '../../utils/auth/auth';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import getCityData from '../../utils/getCityData';
import { DocumentType } from '@typegoose/typegoose';
import getLangField from '../../utils/translations/getLangField';
import { DEFAULT_CITY } from '../../config';

const { operationConfigUpdate } = getOperationsConfigs(Config.name);

@ObjectType()
class ConfigPayloadType extends PayloadType() {
  @Field((_type) => [Config])
  configs: Config[];
}

const configsSortOrder = { order: 1 };

@Resolver((_for) => Config)
export class ConfigResolver {
  @Query((_returns) => [Config])
  async getAllConfigs(): Promise<Config[]> {
    return ConfigModel.find({}).sort(configsSortOrder);
  }

  @Query((_returns) => Config)
  async getConfigBySlug(@Arg('slug', (_type) => String) slug: string): Promise<Config> {
    const config = await ConfigModel.findOne({ slug });
    if (!config) {
      throw new Error('Config not found');
    }

    return config;
  }

  @Query((_returns) => [String])
  async getConfigValueBySlug(
    @Arg('slug', (_type) => String) slug: string,
    @Localization() { lang, city }: LocalizationPayloadInterface,
  ): Promise<Config['value']> {
    const config = await ConfigModel.findOne({ slug });
    if (!config) {
      throw new Error('Config not found');
    }

    let configCity = getCityData<ConfigCity>(config.cities, city);
    if (!configCity) {
      configCity = getCityData<ConfigCity>(config.cities, DEFAULT_CITY);
    }

    if (!configCity) {
      throw Error('Config city not found on query getConfigValueBySlug');
    }

    if (config.multiLang) {
      return [getLangField(configCity.translations, lang)];
    }

    return configCity.value;
  }

  @Mutation((_returns) => ConfigPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateConfigSchema })
  async updateConfig(
    @Localization() { lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Config>,
    @Arg('input', (_type) => UpdateConfigInput) input: UpdateConfigInput,
  ): Promise<ConfigPayloadType> {
    try {
      const { id, cities } = input;
      const config = await ConfigModel.findOneAndUpdate(
        { _id: id, ...customFilter },
        { cities },
        { new: true },
      );

      if (!config) {
        return {
          success: true,
          message: await getApiMessage({ lang, key: 'configs.update.error' }),
          configs: await ConfigModel.find({}).sort(configsSortOrder),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ lang, key: 'configs.update.success' }),
        configs: await ConfigModel.find({}).sort(configsSortOrder),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
        configs: await ConfigModel.find({}).sort(configsSortOrder),
      };
    }
  }

  @Mutation((_returns) => ConfigPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateConfigsSchema })
  async updateConfigs(
    @Localization() { lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Config>,
    @Arg('input', (_type) => [UpdateConfigInput]) input: UpdateConfigInput[],
  ): Promise<ConfigPayloadType> {
    try {
      for await (const { id, cities } of input) {
        await ConfigModel.findOneAndUpdate({ _id: id, ...customFilter }, { cities });
      }

      return {
        success: true,
        message: await getApiMessage({ lang, key: 'configs.update.success' }),
        configs: await ConfigModel.find({}).sort(configsSortOrder),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
        configs: await ConfigModel.find({}).sort(configsSortOrder),
      };
    }
  }

  @Mutation((_returns) => ConfigPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateAssetConfigSchema })
  async updateAssetConfig(
    @Localization() { lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Config>,
    @Arg('input', (_type) => UpdateAssetConfigInput) input: UpdateAssetConfigInput,
  ): Promise<ConfigPayloadType> {
    try {
      const { id, value } = input;
      const config = await ConfigModel.findOne({ _id: id, ...customFilter });
      if (!config) {
        return {
          success: false,
          message: await getApiMessage({ lang, key: 'configs.updateAsset.notFound' }),
          configs: await ConfigModel.find({}).sort(configsSortOrder),
        };
      }

      const defaultCity = config.cities[0];
      if (!defaultCity) {
        return {
          success: false,
          message: await getApiMessage({ lang, key: 'configs.updateAsset.notFound' }),
          configs: await ConfigModel.find({}).sort(configsSortOrder),
        };
      }

      for await (const oldAsset of defaultCity.value) {
        await removeUpload(`.${oldAsset}`);
      }

      const assetsResult = await storeUploads({
        files: value,
        slug: config.slug,
        dist: 'config',
        outputFormat: 'jpg',
      });

      const updatedConfig = await ConfigModel.updateMany(
        { _id: id },
        {
          $set: {
            'cities.0.value': assetsResult.map(({ url }) => url),
          },
        },
      );

      if (!updatedConfig) {
        return {
          success: false,
          message: await getApiMessage({ lang, key: 'configs.updateAsset.error' }),
          configs: await ConfigModel.find({}).sort(configsSortOrder),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ lang, key: 'configs.updateAsset.success' }),
        configs: await ConfigModel.find({}).sort(configsSortOrder),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
        configs: await ConfigModel.find({}).sort(configsSortOrder),
      };
    }
  }

  @FieldResolver((_returns) => [String])
  async value(
    @Root() config: DocumentType<Config>,
    @Localization() { city, lang }: LocalizationPayloadInterface,
  ): Promise<string[]> {
    let configCity = getCityData<ConfigCity>(config.cities, city);

    if (!configCity) {
      configCity = getCityData<ConfigCity>(config.cities, DEFAULT_CITY);
    }

    if (!configCity) {
      throw Error('Config city not found on field value');
    }

    if (config.multiLang) {
      return [getLangField(configCity.translations, lang)];
    }

    return configCity.value;
  }
}
