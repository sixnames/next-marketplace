import { CONFIG_VARIANT_ASSET, DEFAULT_COMPANY_SLUG, DEFAULT_LOCALE } from 'config/common';
import { COL_COMPANIES, COL_CONFIGS } from 'db/collectionNames';
import { ConfigModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { getConfigTemplates } from 'lib/getConfigTemplates';
import { castDbData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';

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
