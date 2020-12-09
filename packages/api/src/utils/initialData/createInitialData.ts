import {
  ADMIN_NAME,
  ADMIN_EMAIL,
  ADMIN_LAST_NAME,
  ADMIN_PHONE,
  ADMIN_PASSWORD,
} from '../../config';
import { User, UserModel } from '../../entities/User';
import { hash } from 'bcryptjs';
import createInitialApiMessages from './createInitialApiMessages';
import {
  createInitialSiteConfigs,
  CreateInitialSiteConfigsInterface,
} from './createInitialSiteConfigs';
import { createInitialRoles, CreateInitialRolesPayloadInterface } from './createInitialRoles';
import {
  createInitialLocalizationData,
  CreateInitialLocalizationDataPayloadInterface,
} from './createInitialLocalizationData';
import { MessagesGroup } from '../../entities/MessagesGroup';
import {
  CreateInitialOrderStatuses,
  creteInitialOrderStatuses,
} from './createInitialOrderStatuses';

export interface CreateInitialDataPayloadInterface
  extends CreateInitialSiteConfigsInterface,
    CreateInitialLocalizationDataPayloadInterface,
    CreateInitialOrderStatuses {
  initialRolesIds: CreateInitialRolesPayloadInterface;
  initialApiMessages: MessagesGroup[];
  admin: User;
}

async function createInitialData(): Promise<CreateInitialDataPayloadInterface> {
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
  const { adminRoleId } = initialRolesIds;

  // Create admin user
  let admin = await UserModel.findOne({ email: ADMIN_EMAIL });
  if (!admin) {
    const password = await hash(ADMIN_PASSWORD, 10);

    admin = await UserModel.create({
      name: ADMIN_NAME,
      lastName: ADMIN_LAST_NAME,
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      password,
      role: adminRoleId,
      orders: [],
    });
  }

  return {
    ...configsPayload,
    ...localizationPayload,
    ...initialOrderStatuses,
    initialRolesIds,
    initialApiMessages,
    admin,
  };
}

export default createInitialData;
