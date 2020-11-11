import clearTestData from './clearTestData';
import createInitialData from '../initialData/createInitialData';
import { MOCK_COMPANY, MOCK_SHOP } from '@yagu/mocks';
import { CompanyModel } from '../../entities/Company';
import generateTestAsset from './generateTestAsset';
import { ASSETS_DIST_COMPANIES, ASSETS_DIST_SHOPS, ASSETS_DIST_SHOPS_LOGOS } from '../../config';
import { ShopModel } from '../../entities/Shop';
import { ShopProductModel } from '../../entities/ShopProduct';
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

    const {
      productA,
      productB,
      productC,
      productD,
      connectionProductA,
      connectionProductB,
      connectionProductC,
    } = products;

    // Users
    const { companyOwner, companyManager } = await createTestUsers({
      initialRolesIds,
    });

    // Shop products
    const shopAProductA = await ShopProductModel.create({
      available: 1,
      price: 100,
      oldPrices: [],
      product: productA.id,
    });

    const shopAProductB = await ShopProductModel.create({
      available: 3,
      price: 180,
      oldPrices: [],
      product: productB.id,
    });

    const shopAProductC = await ShopProductModel.create({
      available: 12,
      price: 1200,
      oldPrices: [],
      product: productC.id,
    });

    const shopAProductD = await ShopProductModel.create({
      available: 0,
      price: 980,
      oldPrices: [],
      product: productD.id,
    });

    const shopAConnectionProductA = await ShopProductModel.create({
      available: 32,
      price: 480,
      oldPrices: [],
      product: connectionProductA.id,
    });

    const shopAConnectionProductB = await ShopProductModel.create({
      available: 0,
      price: 680,
      oldPrices: [],
      product: connectionProductB.id,
    });

    const shopAConnectionProductC = await ShopProductModel.create({
      available: 45,
      price: 720,
      oldPrices: [],
      product: connectionProductC.id,
    });

    // Shop
    const shopLogo = await generateTestAsset({
      targetFileName: 'test-company-logo',
      dist: ASSETS_DIST_SHOPS_LOGOS,
      slug: MOCK_SHOP.slug,
    });

    const shopAAssetA = await generateTestAsset({
      targetFileName: 'test-shop-asset-0',
      dist: ASSETS_DIST_SHOPS,
      slug: MOCK_SHOP.slug,
    });

    const shopA = await ShopModel.create({
      ...MOCK_SHOP,
      logo: shopLogo,
      assets: [shopAAssetA],
      products: [
        shopAProductA.id,
        shopAProductB.id,
        shopAProductC.id,
        shopAProductD.id,
        shopAConnectionProductA.id,
        shopAConnectionProductB.id,
        shopAConnectionProductC.id,
      ],
    });

    // Company
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
