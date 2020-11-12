import { createTestShops } from './createTestShops';
import { createTestCompanies } from './createTestCompanies';

const createTestData = async () => {
  try {
    // Shops
    const shops = await createTestShops();

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
