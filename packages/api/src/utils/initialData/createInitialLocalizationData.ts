import { Currency, CurrencyModel } from '../../entities/Currency';
import {
  INITIAL_CITIES,
  INITIAL_COUNTRIES,
  INITIAL_LANGUAGES,
  MOCK_CURRENCIES,
  MOCK_METRICS,
} from '@yagu/mocks';
import { DEFAULT_CITY, DEFAULT_COUNTRY, DEFAULT_CURRENCY, DEFAULT_LANG } from '@yagu/config';
import { City, CityModel } from '../../entities/City';
import { Country, CountryModel } from '../../entities/Country';
import { Language, LanguageModel } from '../../entities/Language';
import { Metric, MetricModel } from '../../entities/Metric';

export interface CreateInitialLocalizationDataPayloadInterface {
  initialMetricsPayload: Metric[];
  initialCurrenciesPayload: Currency[];
  initialCityPayload: City;
  initialCountryPayload: Country;
  initialLanguagePayload: Language;
}

export const createInitialLocalizationData = async (): Promise<CreateInitialLocalizationDataPayloadInterface> => {
  // Create all metrics
  let initialMetricsPayload = await MetricModel.find({});
  if (!initialMetricsPayload.length) {
    initialMetricsPayload = await MetricModel.insertMany(MOCK_METRICS);
  }

  // Create initial currencies
  let initialCurrenciesPayload = await CurrencyModel.find({});
  if (!initialCurrenciesPayload.length) {
    initialCurrenciesPayload = await CurrencyModel.insertMany(MOCK_CURRENCIES);
  }

  // Create initial cities
  let initialCityPayload = await CityModel.findOne({ slug: DEFAULT_CITY });
  if (!initialCityPayload) {
    initialCityPayload = await CityModel.create(INITIAL_CITIES[0]);
  }

  // Create initial countries
  let initialCountryPayload = await CountryModel.findOne({ nameString: DEFAULT_COUNTRY });
  if (!initialCountryPayload) {
    initialCountryPayload = await CountryModel.create({
      ...INITIAL_COUNTRIES[0],
      cities: [initialCityPayload.id],
      currency: DEFAULT_CURRENCY,
    });
  }

  // Create default language
  let initialLanguagePayload = await LanguageModel.findOne({ key: DEFAULT_LANG });
  if (!initialLanguagePayload) {
    initialLanguagePayload = await LanguageModel.create(INITIAL_LANGUAGES[0]);
  }

  return {
    initialMetricsPayload,
    initialCurrenciesPayload,
    initialCityPayload,
    initialCountryPayload,
    initialLanguagePayload,
  };
};
