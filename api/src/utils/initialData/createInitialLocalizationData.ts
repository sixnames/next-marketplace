import { CurrencyModel } from '../../entities/Currency';
import {
  DEFAULT_CITY,
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_LANG,
  INITIAL_CITIES,
  INITIAL_COUNTRIES,
  INITIAL_CURRENCIES,
  INITIAL_LANGUAGES,
  MOCK_METRICS,
} from '../../config';
import { CityModel } from '../../entities/City';
import { CountryModel } from '../../entities/Country';
import { LanguageModel } from '../../entities/Language';
import { MetricModel } from '../../entities/Metric';

export async function createInitialLocalizationData() {
  // Create all metrics
  const metric = await MetricModel.find({});
  if (!metric.length) {
    await MetricModel.insertMany(MOCK_METRICS);
  }

  // Create initial currencies
  const currencies = await CurrencyModel.find({ nameString: DEFAULT_CURRENCY });
  let initialCurrencyName = DEFAULT_CURRENCY;
  if (!currencies || !currencies.length) {
    const initialCurrency = await CurrencyModel.create(INITIAL_CURRENCIES[0]);
    initialCurrencyName = initialCurrency.nameString;
  }

  // Create initial cities
  const cities = await CityModel.find({ slug: DEFAULT_CITY });
  const citiesIds = [];
  if (!cities || !cities.length) {
    const initialCity = await CityModel.create(INITIAL_CITIES[0]);
    citiesIds.push(initialCity.id);
  }

  // Create initial countries
  const countries = await CountryModel.find({ nameString: DEFAULT_COUNTRY });
  if (!countries || !countries.length) {
    await CountryModel.create({
      ...INITIAL_COUNTRIES[0],
      cities: citiesIds,
      currency: initialCurrencyName,
    });
  }

  // Create default language
  const languages = await LanguageModel.find({ key: DEFAULT_LANG });
  if (!languages || !languages.length) {
    await LanguageModel.create(INITIAL_LANGUAGES[0]);
  }
}
