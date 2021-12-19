import { ObjectId } from 'mongodb';
import { CONFIG_VARIANT_ASSET, DEFAULT_COMPANY_SLUG, DEFAULT_LOCALE } from '../config/common';
import { COL_COMPANIES, COL_CONFIGS } from '../db/collectionNames';
import { ConfigModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import { CompanyInterface, ConfigInterface } from '../db/uiInterfaces';
import { getConfigTemplates } from './getConfigTemplates';
import { getCityFieldLocaleString } from './i18n';
import { noNaN } from './numbers';
import { castDbData } from './ssrUtils';

interface GetConfigPageDataInterface {
  group: string;
  companyId?: string;
}

interface GetConfigPageDataPayloadInterface {
  assetConfigs: ConfigModel[];
  normalConfigs: ConfigModel[];
  currentCompany?: CompanyInterface | null;
}

export async function getConfigPageData({
  companyId,
  group,
}: GetConfigPageDataInterface): Promise<GetConfigPageDataPayloadInterface | null> {
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const isDefault = companyId === DEFAULT_COMPANY_SLUG;

  if (!companyId || companyId === 'undefined') {
    return null;
  }

  let company: CompanyInterface | null | undefined = null;
  if (!isDefault) {
    company = await companiesCollection.findOne({ _id: new ObjectId(companyId) });
  }

  if (!company && !isDefault) {
    return null;
  }

  const companySlug = isDefault ? DEFAULT_COMPANY_SLUG : company?.slug;
  const companyConfigs = await configsCollection.find({ companySlug, group }).toArray();
  const initialConfigTemplates = getConfigTemplates({
    companySlug: `${companySlug}`,
  });
  const initialConfigsGroup = initialConfigTemplates.filter((config) => {
    return config.group === group;
  });

  const configTemplates = initialConfigsGroup.reduce((acc: ConfigModel[], template) => {
    const companyConfig = companyConfigs.find(({ slug }) => slug === template.slug);
    if (companyConfig) {
      const cities = Object.keys(companyConfig.cities).reduce((acc: Record<string, any>, key) => {
        const city = companyConfig.cities[key];
        const defaultValue = city[DEFAULT_LOCALE];
        if (!defaultValue || defaultValue.length < 1) {
          acc[key] = {
            [DEFAULT_LOCALE]: [''],
          };
        } else {
          acc[key] = city;
        }

        return acc;
      }, {});

      return [
        ...acc,
        {
          ...template,
          _id: companyConfig._id,
          cities: cities,
        },
      ];
    }
    return [...acc, template];
  }, []);

  const assetConfigs = configTemplates.filter(({ variant }) => variant === CONFIG_VARIANT_ASSET);
  const notAssetConfigs = configTemplates.filter(({ variant }) => variant !== CONFIG_VARIANT_ASSET);

  return {
    assetConfigs: castDbData(assetConfigs),
    normalConfigs: castDbData(notAssetConfigs),
    currentCompany: company,
  };
}

interface CastConfigsInterface {
  configs: ConfigModel[];
  citySlug: string;
  locale: string;
}

export function castConfigs({
  configs,
  citySlug,
  locale,
}: CastConfigsInterface): ConfigInterface[] {
  return configs.map((config) => {
    const value = getCityFieldLocaleString({ cityField: config.cities, citySlug, locale });
    const singleValue = (value || [])[0];
    return {
      ...config,
      value,
      singleValue,
    };
  });
}

interface GetCurrentConfigInterface {
  configs: ConfigInterface[];
  slug: string;
}

export function getCurrentConfig({
  slug,
  configs,
}: GetCurrentConfigInterface): ConfigInterface | undefined {
  return configs.find((config) => config.slug === slug);
}

export function getConfigBooleanValue({ configs, slug }: GetCurrentConfigInterface): boolean {
  const config = getCurrentConfig({ slug, configs });
  return config?.singleValue === 'true';
}

export function getConfigStringValue({ configs, slug }: GetCurrentConfigInterface): string {
  const config = getCurrentConfig({ slug, configs });
  return config?.singleValue || '';
}

export function getConfigNumberValue({ configs, slug }: GetCurrentConfigInterface): number {
  const config = getCurrentConfig({ slug, configs });
  return noNaN(config?.singleValue);
}

export function getConfigListValue({ configs, slug }: GetCurrentConfigInterface): string[] {
  const config = getCurrentConfig({ slug, configs });
  return config?.value || [];
}
