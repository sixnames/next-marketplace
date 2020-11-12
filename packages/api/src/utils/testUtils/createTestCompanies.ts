import { Company, CompanyModel } from '../../entities/Company';
import { CreateTestShopsPayloadInterface } from './createTestShops';
import generateTestAsset from './generateTestAsset';
import { ASSETS_DIST_COMPANIES } from '../../config';
import { MOCK_COMPANY } from '@yagu/mocks';
import { CreateTestUsersPayloadInterface } from './createTestUsers';

interface CreateTestCompaniesInterface extends CreateTestShopsPayloadInterface {
  companyOwner: CreateTestUsersPayloadInterface['companyOwner'];
  companyManager: CreateTestUsersPayloadInterface['companyManager'];
}

export interface CreateTestCompaniesPayloadInterface {
  companyA: Company;
}

export const createTestCompanies = async ({
  shopA,
  companyOwner,
  companyManager,
}: CreateTestCompaniesInterface): Promise<CreateTestCompaniesPayloadInterface> => {
  const companyLogo = await generateTestAsset({
    targetFileName: 'test-company-logo',
    dist: ASSETS_DIST_COMPANIES,
    slug: MOCK_COMPANY.slug,
  });

  const companyA = await CompanyModel.create({
    ...MOCK_COMPANY,
    owner: companyOwner.id,
    logo: companyLogo,
    staff: [companyManager.id],
    shops: [shopA.id],
  });

  return {
    companyA,
  };
};
