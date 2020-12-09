import { User, UserModel } from '../../entities/User';
import { hash } from 'bcryptjs';
import {
  MOCK_COMPANY_MANAGER,
  MOCK_COMPANY_OWNER,
  MOCK_SAMPLE_USER,
  MOCK_SAMPLE_USER_B,
} from '@yagu/mocks';
import {
  createInitialTestData,
  CreateInitialTestDataPayloadInterface,
} from './createInitialTestData';

export interface CreateTestUsersPayloadInterface extends CreateInitialTestDataPayloadInterface {
  sampleUser: User;
  sampleUserB: User;
  companyOwner: User;
  companyManager: User;
}

export const createTestUsers = async (): Promise<CreateTestUsersPayloadInterface> => {
  // Initial data
  const initialTestData = await createInitialTestData();
  const { initialRolesIds } = initialTestData;

  // Sample user
  const sampleUserPassword = await hash(MOCK_SAMPLE_USER.password, 10);
  const sampleUser = await UserModel.create({
    ...MOCK_SAMPLE_USER,
    role: initialRolesIds.guestRoleId,
    password: sampleUserPassword,
    orders: [],
  });

  // Sample user B
  const sampleUserBPassword = await hash(MOCK_SAMPLE_USER_B.password, 10);
  const sampleUserB = await UserModel.create({
    ...MOCK_SAMPLE_USER_B,
    role: initialRolesIds.guestRoleId,
    password: sampleUserBPassword,
    orders: [],
  });

  // Company owner
  const companyOwnerPassword = await hash(MOCK_COMPANY_OWNER.password, 10);
  const companyOwner = await UserModel.create({
    ...MOCK_COMPANY_OWNER,
    role: initialRolesIds.companyOwnerRoleId,
    password: companyOwnerPassword,
    orders: [],
  });

  // Company manager
  const companyManagerPassword = await hash(MOCK_COMPANY_MANAGER.password, 10);
  const companyManager = await UserModel.create({
    ...MOCK_COMPANY_MANAGER,
    role: initialRolesIds.companyManagerRoleId,
    password: companyManagerPassword,
    orders: [],
  });

  return {
    ...initialTestData,
    sampleUser,
    companyOwner,
    companyManager,
    sampleUserB,
  };
};
