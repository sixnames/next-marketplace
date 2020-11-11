import clearTestData from './clearTestData';
import createInitialData from '../initialData/createInitialData';
import { MOCK_COMPANY } from '@yagu/mocks';
import { CompanyModel } from '../../entities/Company';
import generateTestAsset from './generateTestAsset';
import { ASSETS_DIST_COMPANIES } from '../../config';
import { createTestSecondaryCurrency } from './createTestSecondaryCurrency';
import { createTestSecondaryCity } from './createTestSecondaryCity';
import { createTestSecondaryCountry } from './createTestSecondaryCountry';
import { createTestSecondaryLanguage } from './createTestSecondaryLanguage';
import { createTestOptions } from './createTestOptions';
import { createTestAttributes } from './createTestAttributes';
import { createTestRubricVariants } from './createTestRubricVariants';
import { createTestRubrics } from './createTestRubrics';
import { createTestProducts } from './createTestProducts';
import { createTestUsers } from './createTestUsers';
import { createTestShops } from './createTestShops';

const createTestData = async () => {
  try {
    // Clear old test data
    await clearTestData();

    // Initial data
    const { initialRolesIds } = await createInitialData();

    // Currencies, countries and cities
    const { secondaryCurrency } = await createTestSecondaryCurrency();
    const { secondaryCity } = await createTestSecondaryCity();
    await createTestSecondaryCountry({
      citiesIds: [secondaryCity.id],
      currencySlug: secondaryCurrency.nameString,
    });

    // Languages
    await createTestSecondaryLanguage();

    // Options
    const options = await createTestOptions();
    const {
      optionsGroupWineVintage,
      optionsGroupWineTypes,
      optionsGroupColors,
      optionsGroupCombination,
    } = options;

    // Attributes
    const attributes = await createTestAttributes({
      optionsGroupWineVintage,
      optionsGroupWineTypes,
      optionsGroupColors,
      optionsGroupCombination,
    });

    // Rubric variants
    const rubricVariants = await createTestRubricVariants();

    // Rubrics
    const rubrics = await createTestRubrics({
      ...rubricVariants,
      ...attributes,
    });

    // Products
    const products = await createTestProducts({
      ...options,
      ...attributes,
      ...rubrics,
    });

    // Users
    const { companyOwner, companyManager } = await createTestUsers({
      initialRolesIds,
    });

    // Shops
    const { shopA } = await createTestShops({
      ...products,
    });

    // Companies
    const companyLogo = await generateTestAsset({
      targetFileName: 'test-company-logo',
      dist: ASSETS_DIST_COMPANIES,
      slug: MOCK_COMPANY.slug,
    });

    await CompanyModel.create({
      ...MOCK_COMPANY,
      owner: companyOwner.id,
      logo: companyLogo,
      staff: [companyManager.id],
      shops: [shopA.id],
    });
  } catch (e) {
    console.log('========== createTestData ERROR ==========', '\n', e);
  }
};

export default createTestData;
