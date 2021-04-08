import {
  ASSETS_DIST_CONFIGS,
  CONFIG_DEFAULT_COMPANY_SLUG,
  DEFAULT_CITY,
  DEFAULT_LOCALE,
} from 'config/common';
import { COL_CONFIGS } from 'db/collectionNames';
import { ConfigModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getConfigTemplates } from 'lib/getConfigTemplates';
import { Collection } from 'mongodb';
import path from 'path';
import { findOrCreateTestAsset } from 'lib/s3';

interface FindOrCreateConfigInterface {
  configTemplate: ConfigModel;
  configCollection: Collection<ConfigModel>;
}

async function createConfig({
  configTemplate,
  configCollection,
}: FindOrCreateConfigInterface): Promise<ConfigModel> {
  const config = await configCollection.insertOne({
    ...configTemplate,
  });

  const createdConfig = config.ops[0];

  if (!config.result.ok || !createdConfig) {
    throw Error('Error in findOrCreateConfig');
  }

  return createdConfig;
}

interface StoreConfigWithAssetInterface extends FindOrCreateConfigInterface {
  sourceImage: string;
}

async function storeConfigWithAsset({
  configTemplate,
  configCollection,
  sourceImage,
}: StoreConfigWithAssetInterface): Promise<ConfigModel> {
  const { slug } = configTemplate;

  const localFilePath = path.join(process.cwd(), 'db', 'initialData', sourceImage);
  const s3Url = await findOrCreateTestAsset({
    localFilePath,
    dist: `${ASSETS_DIST_CONFIGS}/${slug}`,
    fileName: slug,
  });

  return createConfig({
    configCollection,
    configTemplate: {
      ...configTemplate,
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [s3Url],
        },
      },
    },
  });
}

export interface CreateTestSiteConfigsPayloadInterface {
  allConfigs: ConfigModel[];
}

export async function createTestSiteConfigs(): Promise<CreateTestSiteConfigsPayloadInterface> {
  const db = await getDatabase();
  const configCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const configTemplates = getConfigTemplates({
    assetsPath: ASSETS_DIST_CONFIGS,
    email: ['email@email.com'],
    phone: ['+79998887766'],
    siteName: 'siteName',
    companySlug: CONFIG_DEFAULT_COMPANY_SLUG,
  });
  const allConfigs: ConfigModel[] = [];
  for await (const configTemplate of configTemplates) {
    if (configTemplate.variant === 'asset') {
      const config = await storeConfigWithAsset({
        configCollection,
        sourceImage: `logo.svg`,
        configTemplate,
      });
      allConfigs.push(config);
    }

    const config = await createConfig({
      configCollection,
      configTemplate,
    });
    allConfigs.push(config);
  }

  return {
    allConfigs,
  };
}
