import { Arg, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Config, ConfigModel } from '../../entities/Config';
import { UpdateConfigInput } from './UpdateConfigInput';
import PayloadType from '../common/PayloadType';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateAssetConfigInput } from './UpdateAssetConfigInput';
import storeUploads from '../../utils/assets/storeUploads';
import { removeUpload } from '../../utils/assets/removeUpload';

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
    @Arg('input', (_type) => [UpdateConfigInput]) input: UpdateConfigInput[],
  ): Promise<ConfigPayloadType> {
    try {
      for await (const { id, value } of input) {
        await ConfigModel.findByIdAndUpdate(id, { value });
      }

      return {
        success: true,
        message: 'success',
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
    @Arg('input', (_type) => UpdateAssetConfigInput) input: UpdateAssetConfigInput,
  ): Promise<ConfigPayloadType> {
    try {
      const { id, value } = input;
      const config = await ConfigModel.findById(id);

      if (!config) {
        return {
          success: false,
          message: 'notFound',
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
          message: 'error',
          configs: await ConfigModel.find({}),
        };
      }

      return {
        success: true,
        message: 'success',
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
