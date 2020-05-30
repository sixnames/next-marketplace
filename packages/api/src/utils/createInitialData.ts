import { MOCK_METRICS, ROLE_ADMIN } from '@rg/config';
import { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD } from '../config';
import { MetricModel } from '../entities/Metric';
import { UserModel } from '../entities/User';
import { hash } from 'bcryptjs';

async function createInitialData() {
  const admin = await UserModel.findOne({ email: ADMIN_EMAIL });
  const metric = await MetricModel.find({});

  if (!metric.length) {
    await MetricModel.insertMany(MOCK_METRICS);
  }

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
