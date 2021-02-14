import { hash } from 'bcryptjs';
import { UserModel } from 'db/dbModels';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_OPTIONS_GROUPS,
  COL_PRODUCTS,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_USERS,
} from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { getNextItemId } from 'lib/itemIdUtils';
import {
  createInitialSiteConfigs,
  CreateInitialSiteConfigsPayloadInterface,
} from './createInitialSiteConfigs';
import {
  createInitialLocalizationData,
  CreateInitialLocalizationDataPayloadInterface,
} from './createInitialLocalizationData';
import createInitialApiMessages, {
  CreateInitialApiMessagesPayloadInterface,
} from './createInitialApiMessages';
import {
  CreateInitialOrderStatuses,
  creteInitialOrderStatuses,
} from 'db/createInitialOrderStatuses';
import { createInitialRoles, CreateInitialRolesPayloadInterface } from 'db/createInitialRoles';

export interface CreateInitialDataPayloadInterface
  extends CreateInitialSiteConfigsPayloadInterface,
    CreateInitialLocalizationDataPayloadInterface,
    CreateInitialApiMessagesPayloadInterface,
    CreateInitialOrderStatuses,
    CreateInitialRolesPayloadInterface {
  admin: UserModel;
}

export const createInitialData = async (): Promise<CreateInitialDataPayloadInterface> => {
  // Create initial site config
  const configsPayload = await createInitialSiteConfigs();

  // Create metrics, currencies, cities, countries, languages
  const localizationPayload = await createInitialLocalizationData();

  // Create api message
  const initialApiMessages = await createInitialApiMessages();

  // Create order statuses
  const initialOrderStatuses = await creteInitialOrderStatuses();

  // Create roles and get admin role
  const initialRolesIds = await createInitialRoles();
  const { adminRole } = initialRolesIds;

  // Create admin user
  const db = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  let admin = await usersCollection.findOne({ email: process.env.ADMIN_EMAIL });
  if (!admin) {
    const adminItemId = await getNextItemId(COL_USERS);
    const adminPassword = await hash(`${process.env.ADMIN_PASSWORD}`, 10);

    const createdAdmin = await usersCollection.insertOne({
      itemId: adminItemId,
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

    if (!createdAdmin.result.ok) {
      throw Error('Admin creation error in createInitialData');
    }

    admin = createdAdmin.ops[0];
  }

  await db.createCollection(COL_OPTIONS_GROUPS);
  await db.createCollection(COL_ATTRIBUTES);
  await db.createCollection(COL_ATTRIBUTES_GROUPS);
  await db.createCollection(COL_RUBRIC_VARIANTS);
  await db.createCollection(COL_RUBRICS);
  await db.createCollection(COL_PRODUCTS);

  return {
    ...configsPayload,
    ...localizationPayload,
    ...initialApiMessages,
    ...initialOrderStatuses,
    ...initialRolesIds,
    admin,
  };
};
