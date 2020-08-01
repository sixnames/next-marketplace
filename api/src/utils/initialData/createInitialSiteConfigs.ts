import { setSharpImage, StoreFileFormat } from '../assets/setSharpImage';
import { Config, ConfigModel, ConfigVariantEnum } from '../../entities/Config';
import {
  SITE_CONFIGS_INITIAL,
  SITE_CONFIGS_LOGO,
  SITE_CONFIGS_LOGO_ICON,
  SITE_CONFIGS_LOGO_NAME,
  SITE_CONFIGS_PREVIEW_IMAGE,
} from '../../config';
import fs from 'fs';
import mkdirp from 'mkdirp';

function sendErrorCode(error: string) {
  throw Error(error);
}

interface StoreConfigWithAssetInterface {
  configTemplate: Pick<Config, 'slug' | 'nameString' | 'description' | 'variant'>;
  sourceImage: string;
  slug: string;
  format: StoreFileFormat;
}

type FindOrCreateConfigTemplate = Pick<
  Config,
  'slug' | 'nameString' | 'description' | 'variant' | 'value'
>;

async function findOrCreateConfig(configTemplate: FindOrCreateConfigTemplate): Promise<boolean> {
  const entityExists = await ConfigModel.exists({ slug: configTemplate.slug });
  if (entityExists) {
    return true;
  }

  await ConfigModel.create({
    ...configTemplate,
    variant: configTemplate.variant as ConfigVariantEnum,
  });
  return true;
}

async function createManyConfigs(configs: FindOrCreateConfigTemplate[]) {
  return Promise.all(
    configs.map(async (config) => {
      await findOrCreateConfig(config);
    }),
  );
}

async function storeConfigWithAsset({
  configTemplate,
  sourceImage,
  slug,
  format,
}: StoreConfigWithAssetInterface) {
  try {
    const dist = 'config';
    const filesPath = `./assets/${dist}`;
    const exists = fs.existsSync(filesPath);
    if (!exists) {
      await mkdirp(filesPath);
    }

    const assetExists = fs.existsSync(`${filesPath}/${slug}.svg`);
    if (format === 'svg' && !assetExists) {
      fs.copyFileSync(sourceImage, `./assets/${dist}/${slug}.svg`);
    }

    const logoPath = await setSharpImage({
      sourceImage,
      slug,
      dist,
      format,
    });
    if (!logoPath) {
      sendErrorCode(`${slug} error`);
      return false;
    }

    return findOrCreateConfig({ ...configTemplate, value: [logoPath] });
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function createInitialSiteConfigs(): Promise<boolean> {
  try {
    await storeConfigWithAsset({
      sourceImage: './site-config/logo.svg',
      slug: 'logo',
      configTemplate: {
        ...SITE_CONFIGS_LOGO,
        variant: SITE_CONFIGS_LOGO.variant as ConfigVariantEnum,
      },
      format: 'svg',
    });
    await storeConfigWithAsset({
      sourceImage: './site-config/logo-icon.svg',
      slug: 'logo-icon',
      configTemplate: {
        ...SITE_CONFIGS_LOGO_ICON,
        variant: SITE_CONFIGS_LOGO_ICON.variant as ConfigVariantEnum,
      },
      format: 'svg',
    });
    await storeConfigWithAsset({
      sourceImage: './site-config/logo-name.svg',
      slug: 'logo-name',
      configTemplate: {
        ...SITE_CONFIGS_LOGO_NAME,
        variant: SITE_CONFIGS_LOGO_NAME.variant as ConfigVariantEnum,
      },
      format: 'svg',
    });
    await storeConfigWithAsset({
      sourceImage: './site-config/og-image.jpg',
      slug: 'og-image',
      configTemplate: {
        ...SITE_CONFIGS_PREVIEW_IMAGE,
        variant: SITE_CONFIGS_PREVIEW_IMAGE.variant as ConfigVariantEnum,
      },
      format: 'jpg',
    });

    await createManyConfigs(
      SITE_CONFIGS_INITIAL.map((config) => ({
        ...config,
        variant: config.variant as ConfigVariantEnum,
      })),
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
