import { User, UserModel } from '../../entities/User';
import { hash } from 'bcryptjs';
import {
  createInitialTestData,
  CreateInitialTestDataPayloadInterface,
} from './createInitialTestData';
import * as faker from 'faker';
import { getFakePhone } from './fakerLocales';

export interface CreateTestUsersPayloadInterface extends CreateInitialTestDataPayloadInterface {
  sampleUser: User;
  sampleUserPassword: string;
  sampleUserB: User;
  sampleUserBPassword: string;
  companyOwner: User;
  companyOwnerPassword: string;
  companyManager: User;
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
    phone: getFakePhone(),
  });

  // Sample user
  const sampleUserPassword = 'sample';
  const sampleUserPasswordHash = await hash(sampleUserPassword, 10);
  const sampleUser = await UserModel.create({
    ...getUserBase(),
    role: guestRole.id,
    password: sampleUserPasswordHash,
    orders: [],
  });

  // Sample user B
  const sampleUserBPassword = 'sampleB';
  const sampleUserBPasswordHash = await hash(sampleUserBPassword, 10);
  const sampleUserB = await UserModel.create({
    ...getUserBase(),
    role: guestRole.id,
    password: sampleUserBPasswordHash,
    orders: [],
  });

  // Company owner
  const companyOwnerPassword = 'owner';
  const companyOwnerPasswordHash = await hash(companyOwnerPassword, 10);
  const companyOwner = await UserModel.create({
    ...getUserBase(),
    role: companyOwnerRole.id,
    password: companyOwnerPasswordHash,
    orders: [],
  });

  // Company manager
  const companyManagerPassword = 'manager';
  const companyManagerPasswordHash = await hash(companyManagerPassword, 10);
  const companyManager = await UserModel.create({
    ...getUserBase(),
    role: companyManagerRole.id,
    password: companyManagerPasswordHash,
    orders: [],
  });

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
