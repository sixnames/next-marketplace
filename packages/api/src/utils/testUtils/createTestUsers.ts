import { User, UserModel } from '../../entities/User';
import { hash } from 'bcryptjs';
import { MOCK_COMPANY_MANAGER, MOCK_COMPANY_OWNER, MOCK_SAMPLE_USER } from '@yagu/mocks';
import {
  createInitialTestData,
  CreateInitialTestDataPayloadInterface,
} from './createInitialTestData';

export interface CreateTestUsersPayloadInterface extends CreateInitialTestDataPayloadInterface {
  sampleUser: User;
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
  });

  // Company owner
  const companyOwnerPassword = await hash(MOCK_COMPANY_OWNER.password, 10);
  const companyOwner = await UserModel.create({
    ...MOCK_COMPANY_OWNER,
    role: initialRolesIds.companyOwnerRoleId,
    password: companyOwnerPassword,
  });

  // Company manager
  const companyManagerPassword = await hash(MOCK_COMPANY_MANAGER.password, 10);
  const companyManager = await UserModel.create({
    ...MOCK_COMPANY_MANAGER,
    role: initialRolesIds.companyManagerRoleId,
    password: companyManagerPassword,
  });

  return {
    ...initialTestData,
    sampleUser,
    companyOwner,
    companyManager,
  };
};
