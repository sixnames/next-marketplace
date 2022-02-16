import { LanguageModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { CityInterface, SsrConfigsInterface } from 'db/uiInterfaces';
import { DEFAULT_CURRENCY, SORT_ASC, SORT_DESC } from './config/common';
import { getSsrConfigs } from './getSsrConfigs';
import { getFieldStringLocale } from './i18n';
import { GetPageInitialDataCommonInterface } from './ssrUtils';

export interface PageInitialDataPayload {
  configs: SsrConfigsInterface;
  cities: CityInterface[];
  languages: LanguageModel[];
  currency: string;
}

export interface GetSsrPageInitialDataInterface extends GetPageInitialDataCommonInterface {
  locale: string;
  citySlug: string;
  companySlug?: string;
}

export const getPageDataSsr = async ({
  locale,
  citySlug,
  companySlug,
}: GetSsrPageInitialDataInterface): Promise<PageInitialDataPayload> => {
  // console.log(' ');
  // console.log('=================== getPageInitialData =======================');
  // const timeStart = new Date().getTime();
  const collections = await getDbCollections();

  // configs
  const configs = await getSsrConfigs({
    citySlug,
    locale,
    companySlug,
  });
  // console.log('After configs ', new Date().getTime() - timeStart);

  // languages
  const languagesCollection = collections.languagesCollection();
  const languages = await languagesCollection
    .find(
      {},
      {
        sort: {
          _id: SORT_ASC,
        },
      },
    )
    .toArray();
  // console.log('After languages ', new Date().getTime() - timeStart);

  // cities
  const citiesCollection = collections.citiesCollection();
  const initialCities = await citiesCollection.find({}, { sort: { _id: SORT_DESC } }).toArray();
  const cities = initialCities.map((city) => {
    return {
      ...city,
      name: getFieldStringLocale(city.nameI18n, locale),
    };
  });
  // console.log('After cities ', new Date().getTime() - timeStart);

  // currency
  let currency = DEFAULT_CURRENCY;
  const sessionCity = initialCities.find(({ slug }) => slug === citySlug);
  if (sessionCity) {
    currency = sessionCity.currency || DEFAULT_CURRENCY;
  }
  // console.log('After currency ', new Date().getTime() - timeStart);

  return {
    configs,
    languages,
    cities,
    currency,
  };
};
