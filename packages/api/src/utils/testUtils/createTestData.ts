import { createTestProducts } from './createTestProducts';
import { createTestShops } from './createTestShops';
import { createTestCompanies } from './createTestCompanies';

const createTestData = async () => {
  try {
    // Products
    const products = await createTestProducts();

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
