import { hash } from 'bcryptjs';
import { COL_USERS } from 'db/collectionNames';
import { UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import createTestApiMessages, {
  CreateTestApiMessagesPayloadInterface,
} from 'tests/createTestApiMessages';
import {
  createTestLocalizationData,
  CreateTestLocalizationDataPayloadInterface,
} from 'tests/createTestLocalizationData';
import { createTestRoles, CreateTestRolesPayloadInterface } from 'tests/createTestRoles';
import {
  createTestSiteConfigs,
  CreateTestSiteConfigsPayloadInterface,
} from 'tests/createTestSiteConfigs';
import { createTestOrderStatuses, CreateTestOrderStatuses } from 'tests/creteTestOrderStatuses';

export interface CreateInitialTestDataPayloadInterface
  extends CreateTestSiteConfigsPayloadInterface,
    CreateTestLocalizationDataPayloadInterface,
    CreateTestApiMessagesPayloadInterface,
    CreateTestRolesPayloadInterface,
    CreateTestOrderStatuses {
  admin: UserModel;
}

export const createInitialTestData = async (): Promise<CreateInitialTestDataPayloadInterface> => {
  // Create initial site config
  const siteConfigsPayload = await createTestSiteConfigs();

  // Create metrics, currencies, cities, countries, languages
  const localizationPayload = await createTestLocalizationData();

  // Create api message
  const initialApiMessages = await createTestApiMessages();

  // Create order statuses
  const initialOrderStatuses = await createTestOrderStatuses();

  // Create roles and get admin role
  const initialRolesIds = await createTestRoles();
  const { adminRole } = initialRolesIds;

  // Create admin user
  const db = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const adminPassword = await hash(`${process.env.ADMIN_PASSWORD}`, 10);

  const createdAdmin = await usersCollection.insertOne({
    itemId: 1,
    name: `${process.env.ADMIN_NAME}`,
    lastName: `${process.env.ADMIN_LAST_NAME}`,
    secondName: `${process.env.ADMIN_SECOND_NAME}`,
    email: `${process.env.ADMIN_EMAIL}`,
    phone: `${process.env.ADMIN_PHONE}`,
    password: adminPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
    roleId: adminRole._id,
    archive: false,
  });

  const admin = createdAdmin.ops[0];

  if (!createdAdmin.result.ok || !admin) {
    throw Error('Admin creation error in createInitialData');
  }

  return {
    ...siteConfigsPayload,
    ...localizationPayload,
    ...initialApiMessages,
    ...initialOrderStatuses,
    ...initialRolesIds,
    admin,
  };
};
