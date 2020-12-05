import { setSharpImage, StoreFileFormat } from '../assets/setSharpImage';
import { Config, ConfigModel, ConfigVariantEnum } from '../../entities/Config';
import { DEFAULT_CITY, DEFAULT_LANG } from '@yagu/config';
import { SITE_CONFIGS_ASSETS_All, SITE_CONFIGS_INITIAL } from '@yagu/mocks';
import fs from 'fs';
import mkdirp from 'mkdirp';

interface StoreConfigWithAssetInterface {
  configTemplate: Pick<
    Config,
    | 'slug'
    | 'nameString'
    | 'description'
    | 'variant'
    | 'order'
    | 'multi'
    | 'acceptedFormats'
    | 'cities'
  >;
  sourceImage: string;
  slug: string;
  format: StoreFileFormat;
}

type FindOrCreateConfigTemplate = Pick<
  Config,
  | 'slug'
  | 'nameString'
  | 'description'
  | 'variant'
  | 'order'
  | 'multi'
  | 'cities'
  | 'acceptedFormats'
>;

async function findOrCreateConfig(configTemplate: FindOrCreateConfigTemplate): Promise<Config> {
  const entityExists = await ConfigModel.findOne({ slug: configTemplate.slug });
  if (entityExists) {
    return entityExists;
  }

  const config = ConfigModel.create({
    ...configTemplate,
    variant: configTemplate.variant as ConfigVariantEnum,
  });

  if (!config) {
    throw Error('Error in findOrCreateConfig');
  }

  return config;
}

async function createManyConfigs(configs: FindOrCreateConfigTemplate[]): Promise<Config[]> {
  return Promise.all(
    configs.map(async (config) => {
      return await findOrCreateConfig(config);
    }),
  );
}

async function storeConfigWithAsset({
  configTemplate,
  sourceImage,
  slug,
  format,
}: StoreConfigWithAssetInterface): Promise<Config | null> {
  try {
    const dist = 'config';
    const fileDirectory = `./assets/${dist}/${slug}`;
    const assetDirectory = `/assets/${dist}/${slug}`;
    const fileName = `${slug}.${format}`;
    const filePath = `${fileDirectory}/${fileName}`;
    let assetPath: string | null = null;

    await mkdirp(fileDirectory);

    const fileExist = fs.existsSync(filePath);
    if (!fileExist) {
      if (format === 'svg') {
        fs.copyFileSync(sourceImage, filePath);
        assetPath = `${assetDirectory}/${fileName}`;
      } else {
        assetPath = await setSharpImage({
          sourceImage,
          slug,
          dist,
          format,
        });
      }
    }

    return findOrCreateConfig({
      ...configTemplate,
      cities: [
        {
          key: DEFAULT_CITY,
          translations: [
            {
              key: DEFAULT_LANG,
              value: [`${assetPath}`],
            },
          ],
        },
      ],
    });
  } catch (e) {
    console.log('==================== Error in storeConfigWithAsset ====================');
    console.log(e);
    return null;
  }
}

export interface CreateInitialSiteConfigsInterface {
  initialConfigs: Config[];
}

export async function createInitialSiteConfigs(): Promise<CreateInitialSiteConfigsInterface> {
  const getAssetsConfigs = async () => {
    return Promise.all(
      SITE_CONFIGS_ASSETS_All.map(async ({ sourceImage, format, ...config }) => {
        const createdConfig = await storeConfigWithAsset({
          sourceImage: `./site-config/${sourceImage}`,
          slug: config.slug,
          format: format as StoreFileFormat,
          configTemplate: {
            ...config,
            variant: config.variant as ConfigVariantEnum,
          },
        });

        if (!createdConfig) {
          throw Error('getAssetsConfigs');
        }
        return createdConfig;
      }),
    );
  };
  const assetsConfigs = await getAssetsConfigs();

  const simpleConfigs = await createManyConfigs(
    SITE_CONFIGS_INITIAL.map((config) => ({
      ...config,
      variant: config.variant as ConfigVariantEnum,
    })),
  );

  return {
    initialConfigs: [...assetsConfigs, ...simpleConfigs],
  };
}
