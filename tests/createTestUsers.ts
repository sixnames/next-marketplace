import { hash } from 'bcryptjs';
import {
  createInitialTestData,
  CreateInitialTestDataPayloadInterface,
} from './createInitialTestData';
import * as faker from 'faker';
import { UserModel } from 'db/dbModels';
import { createDbNode } from 'db/createDbNode';
import { COL_USERS } from 'db/collectionNames';
import { setCollectionItemId } from 'lib/itemIdUtils';

export interface CreateTestUsersPayloadInterface extends CreateInitialTestDataPayloadInterface {
  sampleUser: UserModel;
  sampleUserPassword: string;
  sampleUserB: UserModel;
  sampleUserBPassword: string;
  companyOwner: UserModel;
  companyOwnerPassword: string;
  companyManager: UserModel;
  companyManagerPassword: string;
}

export const createTestUsers = async (): Promise<CreateTestUsersPayloadInterface> => {
  // Initial data
  const initialTestData = await createInitialTestData();
  const { guestRole, companyOwnerRole, companyManagerRole } = initialTestData;

  const getUserBase = () => ({
    email: faker.internet.email(),
    name: faker.name.firstName(),
    secondName: faker.name.lastName(),
    lastName: faker.name.lastName(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Sample user
  const sampleUserPassword = 'sample';
  const sampleUserPasswordHash = await hash(sampleUserPassword, 10);
  const sampleUser = await createDbNode<UserModel>({
    collectionName: COL_USERS,
    template: {
      ...getUserBase(),
      phone: '+78889990011',
      itemId: 2,
      roleId: guestRole._id,
      password: sampleUserPasswordHash,
      archive: false,
    },
  });

  // Sample user B
  const sampleUserBPassword = 'sampleB';
  const sampleUserBPasswordHash = await hash(sampleUserBPassword, 10);
  const sampleUserB = await createDbNode<UserModel>({
    collectionName: COL_USERS,
    template: {
      ...getUserBase(),
      phone: '+78889990022',
      itemId: 3,
      roleId: guestRole._id,
      password: sampleUserBPasswordHash,
      archive: false,
    },
  });

  // Company owner
  const companyOwnerPassword = 'companyOwner';
  const companyOwnerPasswordHash = await hash(companyOwnerPassword, 10);
  const companyOwner = await createDbNode<UserModel>({
    collectionName: COL_USERS,
    template: {
      ...getUserBase(),
      phone: '+78889990033',
      itemId: 4,
      roleId: companyOwnerRole._id,
      password: companyOwnerPasswordHash,
      archive: false,
    },
  });

  // Company manager
  const companyManagerPassword = 'companyManager';
  const companyManagerPasswordHash = await hash(companyManagerPassword, 10);
  const companyManager = await createDbNode<UserModel>({
    collectionName: COL_USERS,
    template: {
      ...getUserBase(),
      phone: '+78889990044',
      itemId: 5,
      roleId: companyManagerRole._id,
      password: companyManagerPasswordHash,
      archive: false,
    },
  });

  await setCollectionItemId(COL_USERS, 5);

  return {
    ...initialTestData,
    sampleUser,
    sampleUserPassword,
    sampleUserB,
    sampleUserBPassword,
    companyOwner,
    companyOwnerPassword,
    companyManager,
    companyManagerPassword,
  };
};
