import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Config, ConfigModel } from '../../entities/Config';
import { UpdateConfigInput } from './UpdateConfigInput';
import PayloadType from '../common/PayloadType';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateAssetConfigInput } from './UpdateAssetConfigInput';
import storeUploads from '../../utils/assets/storeUploads';
import { removeUpload } from '../../utils/assets/removeUpload';
import { ContextInterface } from '../../types/context';
import getMessagesByKeys from '../../utils/translations/getMessagesByKeys';
import { updateAssetConfigSchema, updateConfigsSchema } from '../../validation/configSchema';
import getApiMessage from '../../utils/translations/getApiMessage';

@ObjectType()
class ConfigPayloadType extends PayloadType() {
  @Field((_type) => [Config])
  configs: Config[];
}

@Resolver((_for) => Config)
export class ConfigResolver {
  @Query((_returns) => [Config])
  async getAllConfigs(): Promise<Config[]> {
    return ConfigModel.find({});
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
  ): Promise<Config['value']> {
    const config = await ConfigModel.findOne({ slug });
    if (!config) {
      throw new Error('Config not found');
    }

    return config.value;
  }

  @Mutation((_returns) => ConfigPayloadType)
  async updateConfigs(
    @Ctx() ctx: ContextInterface,
    @Arg('input', (_type) => [UpdateConfigInput]) input: UpdateConfigInput[],
  ): Promise<ConfigPayloadType> {
    try {
      const { lang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.configs.id',
        'validation.configs.value',
      ]);
      await updateConfigsSchema({ lang, messages }).validate(input);

      for await (const { id, value } of input) {
        await ConfigModel.findByIdAndUpdate(id, { value });
      }

      return {
        success: true,
        message: await getApiMessage({ lang, key: 'configs.update.success' }),
        configs: await ConfigModel.find({}),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
        configs: await ConfigModel.find({}),
      };
    }
  }

  @Mutation((_returns) => ConfigPayloadType)
  async updateAssetConfig(
    @Ctx() ctx: ContextInterface,
    @Arg('input', (_type) => UpdateAssetConfigInput) input: UpdateAssetConfigInput,
  ): Promise<ConfigPayloadType> {
    try {
      const { lang } = ctx.req;
      const messages = await getMessagesByKeys([
        'configs.updateAsset.error',
        'configs.updateAsset.success',
        'validation.configs.id',
        'validation.configs.value',
      ]);
      await updateAssetConfigSchema({ lang, messages }).validate(input);

      const { id, value } = input;
      const config = await ConfigModel.findById(id);

      if (!config) {
        return {
          success: false,
          message: await getApiMessage({ lang, key: 'configs.updateAsset.notFound' }),
          configs: await ConfigModel.find({}),
        };
      }

      for await (const oldAsset of config.value) {
        await removeUpload(`.${oldAsset}`);
      }

      const assetsResult = await storeUploads({
        files: value,
        slug: config.slug,
        dist: 'config',
        outputFormat: 'svg',
      });
      const updatedConfig = await ConfigModel.findByIdAndUpdate(id, {
        value: assetsResult.map(({ url }) => url),
      });

      if (!updatedConfig) {
        return {
          success: false,
          message: await getApiMessage({ lang, key: 'configs.updateAsset.error' }),
          configs: await ConfigModel.find({}),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ lang, key: 'configs.updateAsset.success' }),
        configs: await ConfigModel.find({}),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
        configs: await ConfigModel.find({}),
      };
    }
  }
}
