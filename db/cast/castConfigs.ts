import { ConfigModel } from 'db/dbModels';
import { ConfigInterface } from 'db/uiInterfaces';
import { getCityFieldLocaleString } from 'lib/i18n';

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
