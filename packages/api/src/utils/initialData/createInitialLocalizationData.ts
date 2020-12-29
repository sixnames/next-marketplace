import { Currency, CurrencyModel } from '../../entities/Currency';
import { City, CityModel } from '../../entities/City';
import { Country, CountryModel } from '../../entities/Country';
import { Language, LanguageModel } from '../../entities/Language';
import { Metric, MetricModel } from '../../entities/Metric';
import {
  DEFAULT_CITY,
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_LANG,
  SECONDARY_LANG,
} from '@yagu/shared';

// Metrics
export const INITIAL_METRICS = [
  {
    name: [
      { key: DEFAULT_LANG, value: 'км/ч' },
      { key: SECONDARY_LANG, value: 'km/h' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'мм' },
      { key: SECONDARY_LANG, value: 'mm' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'шт.' },
      { key: SECONDARY_LANG, value: 'units' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'м2' },
      { key: SECONDARY_LANG, value: 'm2' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'мест' },
      { key: SECONDARY_LANG, value: 'places' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'км' },
      { key: SECONDARY_LANG, value: 'km' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'кВт' },
      { key: SECONDARY_LANG, value: 'kw' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'р.' },
      { key: SECONDARY_LANG, value: 'rub.' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'лет' },
      { key: SECONDARY_LANG, value: 'years' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'см' },
      { key: SECONDARY_LANG, value: 'cm' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: '%' },
      { key: SECONDARY_LANG, value: '%' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'м' },
      { key: SECONDARY_LANG, value: 'm' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'часов' },
      { key: SECONDARY_LANG, value: 'hours' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'кг' },
      { key: SECONDARY_LANG, value: 'kg' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'чел.' },
      { key: SECONDARY_LANG, value: 'people' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'м/с' },
      { key: SECONDARY_LANG, value: 'm/s' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'год' },
      { key: SECONDARY_LANG, value: 'year' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'мин.' },
      { key: SECONDARY_LANG, value: 'minutes' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'ед.' },
      { key: SECONDARY_LANG, value: 'units' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'мл.' },
      { key: SECONDARY_LANG, value: 'ml' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'л/ч.' },
      { key: SECONDARY_LANG, value: 'p/h' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Hz' },
      { key: SECONDARY_LANG, value: 'Hz' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Вт' },
      { key: SECONDARY_LANG, value: 'Wt' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: '°' },
      { key: SECONDARY_LANG, value: '°' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: '°C' },
      { key: SECONDARY_LANG, value: '°C' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'кд/м2' },
      { key: SECONDARY_LANG, value: 'kd/m2' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'м3/ч' },
      { key: SECONDARY_LANG, value: 'm3/h' },
    ],
  },
];

export interface CreateInitialLocalizationDataPayloadInterface {
  metrics: Metric[];
  defaultCurrency: Currency;
  defaultCity: City;
  defaultCountry: Country;
  defaultLanguage: Language;
}

export const createInitialLocalizationData = async (): Promise<CreateInitialLocalizationDataPayloadInterface> => {
  // Create all metrics
  let metrics = await MetricModel.find({});
  if (!metrics.length) {
    metrics = await MetricModel.insertMany(INITIAL_METRICS);
  }

  // Create initial currencies
  let defaultCurrency = await CurrencyModel.findOne({ nameString: DEFAULT_CURRENCY });
  if (!defaultCurrency) {
    defaultCurrency = await CurrencyModel.create({ nameString: DEFAULT_CURRENCY });
  }

  // Create initial cities
  let defaultCity = await CityModel.findOne({ slug: DEFAULT_CITY });
  if (!defaultCity) {
    defaultCity = await CityModel.create({
      name: [
        { key: DEFAULT_LANG, value: 'Москва' },
        { key: SECONDARY_LANG, value: 'Moscow' },
      ],
      slug: DEFAULT_CITY,
    });
  }

  // Create initial countries
  let defaultCountry = await CountryModel.findOne({ nameString: DEFAULT_COUNTRY });
  if (!defaultCountry) {
    defaultCountry = await CountryModel.create({
      nameString: DEFAULT_COUNTRY,
      cities: [defaultCity.id],
      currency: defaultCurrency.nameString,
    });
  }

  // Create default language
  let defaultLanguage = await LanguageModel.findOne({ key: DEFAULT_LANG });
  if (!defaultLanguage) {
    defaultLanguage = await LanguageModel.create({
      key: DEFAULT_LANG,
      name: 'Русский',
      nativeName: 'ru',
      isDefault: true,
    });
  }

  return {
    metrics,
    defaultCurrency,
    defaultCity,
    defaultCountry,
    defaultLanguage,
  };
};
