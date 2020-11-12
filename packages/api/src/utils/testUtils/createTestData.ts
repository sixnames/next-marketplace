import { createTestRubrics } from './createTestRubrics';
import { createTestProducts } from './createTestProducts';
import { createTestShops } from './createTestShops';
import { createTestCompanies } from './createTestCompanies';

const createTestData = async () => {
  try {
    // Rubrics
    const rubrics = await createTestRubrics();

    // Products
    const products = await createTestProducts({
      ...options,
      ...attributes,
      ...rubrics,
    });

    // Shops
    const shops = await createTestShops({
      ...products,
    });

    // Companies
    await createTestCompanies({
      companyOwner,
      companyManager,
      ...shops,
    });
  } catch (e) {
    console.log('========== createTestData ERROR ==========', '\n', e);
  }
};

export default createTestData;
