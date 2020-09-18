import { setSharpImage, StoreFileFormat } from '../assets/setSharpImage';
import { Config, ConfigModel, ConfigVariantEnum } from '../../entities/Config';
import {
  DEFAULT_CITY,
  DEFAULT_LANG,
  SITE_CONFIGS_INITIAL,
  SITE_CONFIGS_LOGO,
  SITE_CONFIGS_LOGO_DARK,
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

async function findOrCreateConfig(configTemplate: FindOrCreateConfigTemplate): Promise<boolean> {
  try {
    const entityExists = await ConfigModel.exists({ slug: configTemplate.slug });
    if (entityExists) {
      return true;
    }

    await ConfigModel.create({
      ...configTemplate,
      variant: configTemplate.variant as ConfigVariantEnum,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
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
    const fileDirectory = `./assets/${dist}/${slug}`;
    const assetDirectory = `/assets/${dist}/${slug}`;
    const fileName = `${slug}.${format}`;
    const filePath = `${fileDirectory}/${fileName}`;
    let assetPath: string | null = `${assetDirectory}/${fileName}`;

    const directoryExists = fs.existsSync(fileDirectory);
    if (!directoryExists) {
      await mkdirp(fileDirectory);
    }
    //
    const fileExist = fs.existsSync(filePath);
    if (!fileExist) {
      if (format === 'svg') {
        fs.copyFileSync(sourceImage, filePath);
      } else {
        assetPath = await setSharpImage({
          sourceImage,
          slug,
          dist,
          format,
        });
      }
    }

    if (!assetPath) {
      sendErrorCode(`${slug} error`);
      return false;
    }

    return findOrCreateConfig({
      ...configTemplate,
      cities: [
        {
          key: DEFAULT_CITY,
          translations: [
            {
              key: DEFAULT_LANG,
              value: [assetPath],
            },
          ],
        },
      ],
    });
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function createInitialSiteConfigs(): Promise<boolean> {
  try {
    await storeConfigWithAsset({
      sourceImage: './site-config/logo.svg',
      slug: SITE_CONFIGS_LOGO.slug,
      format: 'svg',
      configTemplate: {
        ...SITE_CONFIGS_LOGO,
        variant: SITE_CONFIGS_LOGO.variant as ConfigVariantEnum,
      },
    });
    await storeConfigWithAsset({
      sourceImage: './site-config/logo-dark.svg',
      slug: SITE_CONFIGS_LOGO_DARK.slug,
      format: 'svg',
      configTemplate: {
        ...SITE_CONFIGS_LOGO_DARK,
        variant: SITE_CONFIGS_LOGO_DARK.variant as ConfigVariantEnum,
      },
    });
    await storeConfigWithAsset({
      sourceImage: './site-config/logo-icon.svg',
      slug: SITE_CONFIGS_LOGO_ICON.slug,
      format: 'svg',
      configTemplate: {
        ...SITE_CONFIGS_LOGO_ICON,
        variant: SITE_CONFIGS_LOGO_ICON.variant as ConfigVariantEnum,
      },
    });
    await storeConfigWithAsset({
      sourceImage: './site-config/logo-name.svg',
      slug: SITE_CONFIGS_LOGO_NAME.slug,
      format: 'svg',
      configTemplate: {
        ...SITE_CONFIGS_LOGO_NAME,
        variant: SITE_CONFIGS_LOGO_NAME.variant as ConfigVariantEnum,
      },
    });
    await storeConfigWithAsset({
      sourceImage: './site-config/og-image.jpg',
      slug: SITE_CONFIGS_PREVIEW_IMAGE.slug,
      format: 'jpg',
      configTemplate: {
        ...SITE_CONFIGS_PREVIEW_IMAGE,
        variant: SITE_CONFIGS_PREVIEW_IMAGE.variant as ConfigVariantEnum,
      },
    });

    await createManyConfigs(
      SITE_CONFIGS_INITIAL.map((config) => ({
        ...config,
        variant: config.variant as ConfigVariantEnum,
      })),
    );
    /*const test = await ConfigModel.find({}).select({ slug: 1 });
    console.log(test);*/
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
