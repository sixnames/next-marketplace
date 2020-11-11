import { User, UserModel } from '../../entities/User';
import { hash } from 'bcryptjs';
import { MOCK_COMPANY_MANAGER, MOCK_COMPANY_OWNER, MOCK_SAMPLE_USER } from '@yagu/mocks';
import { createInitialDataPayloadInterface } from '../initialData/createInitialData';

type CreateTestUsersInterface = createInitialDataPayloadInterface;

export interface CreateTestUsersPayloadInterface {
  sampleUser: User;
  companyOwner: User;
  companyManager: User;
}

export const createTestUsers = async ({
  initialRolesIds,
}: CreateTestUsersInterface): Promise<CreateTestUsersPayloadInterface> => {
  // Sample user
  const sampleUserPassword = await hash(MOCK_COMPANY_OWNER.password, 10);
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
  const companyManagerPassword = await hash(MOCK_COMPANY_OWNER.password, 10);
  const companyManager = await UserModel.create({
    ...MOCK_COMPANY_MANAGER,
    role: initialRolesIds.companyManagerRoleId,
    password: companyManagerPassword,
  });

  return {
    sampleUser,
    companyOwner,
    companyManager,
  };
};
