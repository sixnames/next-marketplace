import { CityModel, CountryModel, CurrencyModel, LanguageModel, MetricModel } from './dbModels';
import {
  DEFAULT_CITY,
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  SECONDARY_LOCALE,
} from 'config/common';
import { getDatabase } from './mongodb';
import {
  COL_CITIES,
  COL_COUNTRIES,
  COL_CURRENCIES,
  COL_LANGUAGES,
  COL_METRICS,
} from './collectionNames';

// Metrics
export const INITIAL_METRICS = [
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'км/ч',
      [SECONDARY_LOCALE]: 'km/h',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'мм',
      [SECONDARY_LOCALE]: 'mm',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'шт.',
      [SECONDARY_LOCALE]: 'units',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'м2',
      [SECONDARY_LOCALE]: 'm2',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'мест',
      [SECONDARY_LOCALE]: 'places',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'км',
      [SECONDARY_LOCALE]: 'km',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'кВт',
      [SECONDARY_LOCALE]: 'kw',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'р.',
      [SECONDARY_LOCALE]: 'rub.',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'лет',
      [SECONDARY_LOCALE]: 'years',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'см',
      [SECONDARY_LOCALE]: 'cm',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: '%',
      [SECONDARY_LOCALE]: '%',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'м',
      [SECONDARY_LOCALE]: 'm',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'часов',
      [SECONDARY_LOCALE]: 'hours',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'кг',
      [SECONDARY_LOCALE]: 'kg',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'чел.',
      [SECONDARY_LOCALE]: 'people',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'м/с',
      [SECONDARY_LOCALE]: 'm/s',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'год',
      [SECONDARY_LOCALE]: 'year',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'мин.',
      [SECONDARY_LOCALE]: 'minutes',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'ед.',
      [SECONDARY_LOCALE]: 'units',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'мл.',
      [SECONDARY_LOCALE]: 'ml',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'л/ч.',
      [SECONDARY_LOCALE]: 'p/h',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'Hz',
      [SECONDARY_LOCALE]: 'Hz',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'Вт',
      [SECONDARY_LOCALE]: 'Wt',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: '°',
      [SECONDARY_LOCALE]: '°',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: '°C',
      [SECONDARY_LOCALE]: '°C',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'кд/м2',
      [SECONDARY_LOCALE]: 'kd/m2',
    },
  },
  {
    nameI18n: {
      [DEFAULT_LOCALE]: 'м3/ч',
      [SECONDARY_LOCALE]: 'm3/h',
    },
  },
];

export interface CreateInitialLocalizationDataPayloadInterface {
  metrics: MetricModel[];
  defaultCurrency: CurrencyModel;
  defaultCity: CityModel;
  defaultCountry: CountryModel;
  defaultLanguage: LanguageModel;
}

export const createInitialLocalizationData = async (): Promise<CreateInitialLocalizationDataPayloadInterface> => {
  const db = await getDatabase();
  // Create all metrics
  const metricsCollection = db.collection<MetricModel>(COL_METRICS);
  let metrics = await metricsCollection.find({}).toArray();
  if (!metrics.length) {
    const createdMetrics: MetricModel[] = [];
    for await (const metricTemplate of INITIAL_METRICS) {
      const createdMetric = await metricsCollection.insertOne({
        ...metricTemplate,
      });
      if (!createdMetric.result.ok) {
        throw Error('INITIAL_METRICS creation error');
      }
      createdMetrics.push(createdMetric.ops[0]);
    }
    metrics = createdMetrics;
  }

  // Create initial currencies
  const currenciesCollection = db.collection<CurrencyModel>(COL_CURRENCIES);
  let defaultCurrency = await currenciesCollection.findOne({ name: DEFAULT_CURRENCY });
  if (!defaultCurrency) {
    const createdCurrency = await currenciesCollection.insertOne({
      name: DEFAULT_CURRENCY,
    });
    if (!createdCurrency.result.ok) {
      throw Error('DEFAULT_CURRENCY creation error');
    }
    defaultCurrency = createdCurrency.ops[0];
  }

  // Create initial cities
  const citiesCollection = db.collection<CityModel>(COL_CITIES);
  let defaultCity = await citiesCollection.findOne({ slug: DEFAULT_CITY });
  if (!defaultCity) {
    const createdCity = await citiesCollection.insertOne({
      slug: DEFAULT_CITY,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Москва',
        [SECONDARY_LOCALE]: 'Moscow',
      },
    });
    if (!createdCity.result.ok) {
      throw Error('DEFAULT_CITY creation error');
    }
    defaultCity = createdCity.ops[0];
  }

  // Create initial countries
  const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);
  let defaultCountry = await countriesCollection.findOne({ name: DEFAULT_COUNTRY });
  if (!defaultCountry) {
    const createdCountry = await countriesCollection.insertOne({
      citiesIds: [defaultCity._id],
      name: DEFAULT_COUNTRY,
      currency: defaultCurrency.name,
    });
    if (!createdCountry.result.ok) {
      throw Error('DEFAULT_COUNTRY creation error');
    }
    defaultCountry = createdCountry.ops[0];
  }

  // Create default language
  const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
  let defaultLanguage = await languagesCollection.findOne({ slug: DEFAULT_LOCALE });
  if (!defaultLanguage) {
    const createdLanguage = await languagesCollection.insertOne({
      slug: DEFAULT_LOCALE,
      name: 'Русский',
      nativeName: 'ru',
    });
    if (!createdLanguage.result.ok) {
      throw Error('DEFAULT_LOCALE creation error');
    }
    defaultLanguage = createdLanguage.ops[0];
  }

  return {
    metrics,
    defaultCurrency,
    defaultCity,
    defaultCountry,
    defaultLanguage,
  };
};
