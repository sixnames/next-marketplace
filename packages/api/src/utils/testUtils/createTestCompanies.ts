import { Company, CompanyModel } from '../../entities/Company';
import { createTestShops, CreateTestShopsPayloadInterface } from './createTestShops';
import generateTestAsset from './generateTestAsset';
import { ASSETS_DIST_COMPANIES } from '../../config';
import { fakerEn, getFakePhone } from './fakerLocales';
import { generateSlug } from '../slug';

export interface CreateTestCompaniesPayloadInterface extends CreateTestShopsPayloadInterface {
  companyA: Company;
  mockCompanies: Company[];
}

export const createTestCompanies = async (): Promise<CreateTestCompaniesPayloadInterface> => {
  const shopsPayload = await createTestShops();
  const { shopA, shopB, companyOwner, companyManager } = shopsPayload;

  const companyName = fakerEn.company.companyName();
  const companySlug = generateSlug(companyName);

  const companyLogo = await generateTestAsset({
    targetFileName: 'test-company-logo',
    dist: ASSETS_DIST_COMPANIES,
    slug: companySlug,
  });

  const companyA = await CompanyModel.create({
    nameString: companyName,
    slug: companySlug,
    contacts: {
      emails: [fakerEn.internet.email(), fakerEn.internet.email()],
      phones: [getFakePhone(), getFakePhone()],
    },
    owner: companyOwner.id,
    logo: companyLogo,
    staff: [companyManager.id],
    shops: [shopA.id, shopB.id],
  });

  const mockCompanies = [companyA];

  return {
    ...shopsPayload,
    mockCompanies,
    companyA,
  };
};
