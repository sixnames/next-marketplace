import { hash } from 'bcryptjs';
import {
  createInitialTestData,
  CreateInitialTestDataPayloadInterface,
} from './createInitialTestData';
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

  // Sample user
  const sampleUserPassword = 'sample';
  const sampleUserPasswordHash = await hash(sampleUserPassword, 10);
  const sampleUser = await createDbNode<UserModel>({
    collectionName: COL_USERS,
    template: {
      email: 'sampleUser@mail.com',
      name: 'sampleUserN',
      secondName: 'sampleUserS',
      lastName: 'sampleUserL',
      phone: '+78889990011',
      itemId: '2',
      roleId: guestRole._id,
      password: sampleUserPasswordHash,

      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Sample user B
  const sampleUserBPassword = 'sampleB';
  const sampleUserBPasswordHash = await hash(sampleUserBPassword, 10);
  const sampleUserB = await createDbNode<UserModel>({
    collectionName: COL_USERS,
    template: {
      email: 'sampleUserB@mail.com',
      name: 'sampleUserBN',
      secondName: 'sampleUserBS',
      lastName: 'sampleUserBL',
      phone: '+78889990022',
      itemId: '3',
      roleId: guestRole._id,
      password: sampleUserBPasswordHash,

      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Company owner
  const companyOwnerPassword = 'companyOwner';
  const companyOwnerPasswordHash = await hash(companyOwnerPassword, 10);
  const companyOwner = await createDbNode<UserModel>({
    collectionName: COL_USERS,
    template: {
      email: 'companyOwner@mail.com',
      name: 'companyOwnerN',
      secondName: 'companyOwnerS',
      lastName: 'companyOwnerL',
      phone: '+78889990033',
      itemId: '4',
      roleId: companyOwnerRole._id,
      password: companyOwnerPasswordHash,

      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Company manager
  const companyManagerPassword = 'companyManager';
  const companyManagerPasswordHash = await hash(companyManagerPassword, 10);
  const companyManager = await createDbNode<UserModel>({
    collectionName: COL_USERS,
    template: {
      email: 'companyManager@mail.com',
      name: 'companyManagerN',
      secondName: 'companyManagerS',
      lastName: 'companyManagerL',
      phone: '+78889990044',
      itemId: '5',
      roleId: companyManagerRole._id,
      password: companyManagerPasswordHash,

      createdAt: new Date(),
      updatedAt: new Date(),
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
