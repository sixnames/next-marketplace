import { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD } from '../../config';
import { UserModel } from '../../entities/User';
import { hash } from 'bcryptjs';
import createInitialApiMessages from './createInitialApiMessages';
import { createInitialSiteConfigs } from './createInitialSiteConfigs';
import { createInitialRoles } from './createInitialRoles';
import { createInitialLocalizationData } from './createInitialLocalizationData';
import { Types } from 'mongoose';

async function createInitialData() {
  // Create initial site config
  await createInitialSiteConfigs();

  // Create metrics, currencies, cities, countries, languages
  await createInitialLocalizationData();

  // Create api message
  await createInitialApiMessages();

  // Create roles and get admin role
  const adminRoleId = await createInitialRoles();

  // Create admin user
  let admin = await UserModel.findOne({ email: ADMIN_EMAIL });
  if (!admin) {
    const password = await hash(ADMIN_PASSWORD, 10);

    admin = await UserModel.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      password,
      role: adminRoleId,
    });
  }
  if (!Types.ObjectId.isValid(admin.role)) {
    await UserModel.findByIdAndUpdate(admin.id, { role: adminRoleId });
  }
}

export default createInitialData;
