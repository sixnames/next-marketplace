import clearTestData from './clearTestData';
import createInitialData from '../initialData/createInitialData';
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
import { createTestCompanies } from './createTestCompanies';

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
    const users = await createTestUsers({
      initialRolesIds,
    });

    // Shops
    const shops = await createTestShops({
      ...products,
    });

    // Companies
    await createTestCompanies({
      ...users,
      ...shops,
    });
  } catch (e) {
    console.log('========== createTestData ERROR ==========', '\n', e);
  }
};

export default createTestData;
