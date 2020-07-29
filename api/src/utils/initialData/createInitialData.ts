import {
  ADMIN_NAME,
  ADMIN_EMAIL,
  ADMIN_PHONE,
  ADMIN_PASSWORD,
  MOCK_METRICS,
  ROLE_ADMIN,
  DEFAULT_LANG,
  INITIAL_LANGUAGES,
  DEFAULT_CURRENCY,
  INITIAL_CURRENCIES,
  DEFAULT_COUNTRY,
  INITIAL_COUNTRIES,
  INITIAL_CITIES,
  DEFAULT_CITY,
} from '../../config';
import { MetricModel } from '../../entities/Metric';
import { UserModel } from '../../entities/User';
import { hash } from 'bcryptjs';
import { LanguageModel } from '../../entities/Language';
import { CurrencyModel } from '../../entities/Currency';
import { CountryModel } from '../../entities/Country';
import { CityModel } from '../../entities/City';
import createInitialApiMessages from './createInitialApiMessages';

async function createInitialData() {
  // Create initial currencies
  const currencies = await CurrencyModel.find({ nameString: DEFAULT_CURRENCY });
  let initialCurrencyName = DEFAULT_CURRENCY;
  if (!currencies || !currencies.length) {
    const initialCurrency = await CurrencyModel.create(INITIAL_CURRENCIES[0]);
    initialCurrencyName = initialCurrency.nameString;
  }

  // Create initial cities
  const cities = await CityModel.find({ key: DEFAULT_CITY });
  const citiesIds = [];
  if (!cities || !cities.length) {
    const initialCity = await CityModel.create(INITIAL_CITIES[0]);
    citiesIds.push(initialCity.id);
  }

  // Create initial countries
  const countries = await CurrencyModel.find({ name: DEFAULT_COUNTRY });
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

  // Create api message
  await createInitialApiMessages();

  // Create all metrics
  const metric = await MetricModel.find({});
  if (!metric.length) {
    await MetricModel.insertMany(MOCK_METRICS);
  }

  // Create admin user
  const admin = await UserModel.findOne({ email: ADMIN_EMAIL });
  if (!admin) {
    const password = await hash(ADMIN_PASSWORD, 10);

    await UserModel.create({
      itemId: '1',
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      password,
      role: ROLE_ADMIN,
    });
  }
}

export default createInitialData;
