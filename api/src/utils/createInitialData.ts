import {
  ADMIN_NAME,
  ADMIN_EMAIL,
  ADMIN_PHONE,
  ADMIN_PASSWORD,
  MOCK_METRICS,
  ROLE_ADMIN,
  DEFAULT_LANG,
  MOCK_LANGUAGES,
} from '../config';
import { MetricModel } from '../entities/Metric';
import { UserModel } from '../entities/User';
import { hash } from 'bcryptjs';
import { LanguageModel } from '../entities/Language';

async function createInitialData() {
  // Create default language
  const languages = await LanguageModel.find({ key: DEFAULT_LANG });
  if (!languages.length) {
    await LanguageModel.create(MOCK_LANGUAGES[0]);
  }

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
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      password,
      role: ROLE_ADMIN,
    });
  }
}

export default createInitialData;
