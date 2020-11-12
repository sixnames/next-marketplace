import { Company, CompanyModel } from '../../entities/Company';
import { createTestShops, CreateTestShopsPayloadInterface } from './createTestShops';
import generateTestAsset from './generateTestAsset';
import { ASSETS_DIST_COMPANIES } from '../../config';
import { MOCK_COMPANY } from '@yagu/mocks';

export interface CreateTestCompaniesPayloadInterface extends CreateTestShopsPayloadInterface {
  companyA: Company;
}

export const createTestCompanies = async (): Promise<CreateTestCompaniesPayloadInterface> => {
  const shopsPayload = await createTestShops();
  const { shopA, companyOwner, companyManager } = shopsPayload;

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
    ...shopsPayload,
    companyA,
  };
};
