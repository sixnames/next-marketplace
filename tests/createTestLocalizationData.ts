import {
  COL_CITIES,
  COL_COUNTRIES,
  COL_CURRENCIES,
  COL_LANGUAGES,
  COL_METRICS,
} from 'db/collectionNames';
import { INITIAL_METRICS } from 'db/createInitialLocalizationData';
import { CityModel, CountryModel, CurrencyModel, LanguageModel, MetricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  DEFAULT_CITY,
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  SECONDARY_CITY,
  SECONDARY_COUNTRY,
  SECONDARY_CURRENCY,
  SECONDARY_LOCALE,
} from 'config/common';
import { ObjectId } from 'mongodb';

export interface CreateTestLocalizationDataPayloadInterface {
  metrics: MetricModel[];
  currencies: CurrencyModel[];
  cities: CityModel[];
  countries: CountryModel[];
  languages: LanguageModel[];
}

export const createTestLocalizationData = async (): Promise<CreateTestLocalizationDataPayloadInterface> => {
  const db = await getDatabase();
  // Create all metrics
  const metricsCollection = db.collection<MetricModel>(COL_METRICS);
  const createdMetrics = await metricsCollection.insertMany(INITIAL_METRICS);

  // Create initial currencies
  const currenciesCollection = db.collection<CurrencyModel>(COL_CURRENCIES);
  const createdCurrencies = await currenciesCollection.insertMany([
    {
      _id: new ObjectId('604cad82b604c1c320c326ae'),
      name: DEFAULT_CURRENCY,
    },
    {
      _id: new ObjectId('604cad82b604c1c320c326af'),
      name: SECONDARY_CURRENCY,
    },
  ]);

  // Create initial cities
  const citiesCollection = db.collection<CityModel>(COL_CITIES);
  const defaultCityId = new ObjectId('604cad82b604c1c320c326b0');
  const secondaryCityId = new ObjectId('604cad82b604c1c320c326b1');
  const cities = await citiesCollection.insertMany([
    {
      _id: defaultCityId,
      slug: DEFAULT_CITY,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Москва',
        [SECONDARY_LOCALE]: 'Moscow',
      },
    },
    {
      _id: secondaryCityId,
      slug: SECONDARY_CITY,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Нью Йорк',
        [SECONDARY_LOCALE]: 'New York',
      },
    },
  ]);

  // Create initial countries
  const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);
  const countries = await countriesCollection.insertMany([
    {
      _id: new ObjectId('604cad82b604c1c320c326b2'),
      citiesIds: [defaultCityId],
      name: DEFAULT_COUNTRY,
      currency: DEFAULT_CURRENCY,
    },
    {
      _id: new ObjectId('604cad82b604c1c320c326b3'),
      name: SECONDARY_COUNTRY,
      citiesIds: [secondaryCityId],
      currency: SECONDARY_CURRENCY,
    },
  ]);

  // Create default language
  const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
  const languages = await languagesCollection.insertMany([
    {
      _id: new ObjectId('604cad82b604c1c320c326b4'),
      slug: DEFAULT_LOCALE,
      name: 'Русский',
      nativeName: DEFAULT_LOCALE,
    },
    {
      _id: new ObjectId('604cad82b604c1c320c326b5'),
      slug: SECONDARY_LOCALE,
      name: 'English',
      nativeName: SECONDARY_LOCALE,
    },
  ]);

  return {
    metrics: createdMetrics.ops,
    currencies: createdCurrencies.ops,
    cities: cities.ops,
    countries: countries.ops,
    languages: languages.ops,
  };
};
