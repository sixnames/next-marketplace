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
} from '../../config';
import { MetricModel } from '../../entities/Metric';
import { UserModel } from '../../entities/User';
import { hash } from 'bcryptjs';
import { LanguageModel } from '../../entities/Language';
import createInitialApiMessages from './createInitialApiMessages';
import { CurrencyModel } from '../../entities/Currency';

async function createInitialData() {
  // Create initial currencies
  const currencies = await CurrencyModel.find({ nameString: DEFAULT_CURRENCY });
  if (!currencies || !currencies.length) {
    await CurrencyModel.create(INITIAL_CURRENCIES[0]);
  }

  // Create default language
  const languages = await LanguageModel.find({ key: DEFAULT_LANG });
  if (!languages || !languages.length) {
    await LanguageModel.create(INITIAL_LANGUAGES[0]);
  }

  // Create api messages
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
