import { getDatabase } from 'db/mongodb';
import { recalculateRubricProductCounters } from 'lib/rubricUtils';
import { createTestProducts, CreateTestProductsPayloadInterface } from './createTestProducts';
import {
  ASSETS_DIST_COMPANIES,
  ASSETS_DIST_SHOPS,
  ASSETS_DIST_SHOPS_LOGOS,
  DEFAULT_CITY,
} from 'config/common';
import { generateSlug } from 'lib/slugUtils';
import { CompanyModel, ShopModel, ShopProductModel } from 'db/dbModels';
import { MOCK_ADDRESS_A, MOCK_ADDRESS_B } from 'tests/mockData';
import { COL_COMPANIES, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { setCollectionItemId } from 'lib/itemIdUtils';
import { updateProductShopsData } from 'lib/productShopsUtils';
import { ObjectId } from 'mongodb';
import path from 'path';
import { findOrCreateTestAsset } from 'lib/s3';

export interface CreateTestShopsPayloadInterface extends CreateTestProductsPayloadInterface {
  mockShops: ShopModel[];
  shopA: ShopModel;
  shopAProductA: ShopProductModel;
  shopAProductB: ShopProductModel;
  shopAProductD: ShopProductModel;
  shopAConnectionProductA: ShopProductModel;
  shopAConnectionProductB: ShopProductModel;
  shopAConnectionProductC: ShopProductModel;
  shopB: ShopModel;
  shopBProductA: ShopProductModel;
  shopBProductB: ShopProductModel;
  shopBProductD: ShopProductModel;
  shopBConnectionProductA: ShopProductModel;
  shopBConnectionProductB: ShopProductModel;
  shopBConnectionProductC: ShopProductModel;
  companyA: CompanyModel;
  mockCompanies: CompanyModel[];
}

export const createTestShops = async (): Promise<CreateTestShopsPayloadInterface> => {
  const db = await getDatabase();
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

  const productsPayload = await createTestProducts();
  const {
    rubricA,
    rubricB,
    rubricC,
    rubricD,
    productA,
    productB,
    productC,
    productD,
    productF,
    connectionProductA,
    connectionProductB,
    connectionProductC,
    companyOwner,
    companyManager,
  } = productsPayload;

  const companyAId = new ObjectId('604cad85b604c1c320c328a4');

  // Shops assets paths
  const shopLogoLocalFilePath = path.join(
    process.cwd(),
    'tests',
    'mockAssets',
    'test-company-logo.png',
  );
  const shopAssetALocalFilePath = path.join(
    process.cwd(),
    'tests',
    'mockAssets',
    'test-shop-0.png',
  );
  const shopAssetBLocalFilePath = path.join(
    process.cwd(),
    'tests',
    'mockAssets',
    'test-shop-0.png',
  );

  // Shop A products
  const shopAId = new ObjectId('604cad85b604c1c320c328a5');

  const shopAProductAId = new ObjectId('604cad85b604c1c320c328a6');
  const shopAProductA: ShopProductModel = {
    _id: shopAProductAId,
    available: 20,
    price: 100,
    oldPrices: [],
    productId: productA._id,
    citySlug: DEFAULT_CITY,
    shopId: shopAId,
    rubricId: productA.rubricId,
    companyId: companyAId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const shopAProductBId = new ObjectId('604cad85b604c1c320c328a7');
  const shopAProductB: ShopProductModel = {
    _id: shopAProductBId,
    available: 3,
    price: 180,
    oldPrices: [],
    productId: productB._id,
    citySlug: DEFAULT_CITY,
    shopId: shopAId,
    rubricId: productB.rubricId,
    companyId: companyAId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const shopAProductDId = new ObjectId('604cad85b604c1c320c328a8');
  const shopAProductD: ShopProductModel = {
    _id: shopAProductDId,
    available: 0,
    price: 980,
    oldPrices: [],
    productId: productD._id,
    citySlug: DEFAULT_CITY,
    shopId: shopAId,
    rubricId: productD.rubricId,
    companyId: companyAId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const shopAConnectionProductAId = new ObjectId('604cad85b604c1c320c328a9');
  const shopAConnectionProductA: ShopProductModel = {
    _id: shopAConnectionProductAId,
    available: 32,
    price: 480,
    oldPrices: [],
    productId: connectionProductA._id,
    citySlug: DEFAULT_CITY,
    shopId: shopAId,
    rubricId: connectionProductA.rubricId,
    companyId: companyAId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const shopAConnectionProductBId = new ObjectId('604cad85b604c1c320c328aa');
  const shopAConnectionProductB: ShopProductModel = {
    _id: shopAConnectionProductBId,
    available: 0,
    price: 680,
    oldPrices: [],
    productId: connectionProductB._id,
    citySlug: DEFAULT_CITY,
    shopId: shopAId,
    rubricId: connectionProductB.rubricId,
    companyId: companyAId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const shopAConnectionProductCId = new ObjectId('604cad85b604c1c320c328ab');
  const shopAConnectionProductC: ShopProductModel = {
    _id: shopAConnectionProductCId,
    available: 45,
    price: 720,
    oldPrices: [],
    productId: connectionProductC._id,
    citySlug: DEFAULT_CITY,
    shopId: shopAId,
    rubricId: connectionProductC.rubricId,
    companyId: companyAId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Shop A assets
  const shopAItemId = '1';
  const shopALogoUrl = await findOrCreateTestAsset({
    localFilePath: shopLogoLocalFilePath,
    dist: `${ASSETS_DIST_SHOPS_LOGOS}/${shopAItemId}`,
    fileName: shopAItemId,
  });
  const shopAAssetAUrl = await findOrCreateTestAsset({
    localFilePath: shopAssetALocalFilePath,
    dist: `${ASSETS_DIST_SHOPS}/${shopAItemId}`,
    fileName: 0,
  });

  // Shop A
  const shopAName = 'shopA';
  const shopA: ShopModel = {
    _id: shopAId,

    itemId: shopAItemId,
    name: shopAName,
    slug: generateSlug(shopAName),
    companyId: companyAId,
    citySlug: DEFAULT_CITY,
    contacts: {
      emails: [`shopA@mail.com`, 'shopAB@mail.com'],
      phones: ['+78889990055', '+78889990066'],
    },
    address: {
      formattedAddress: MOCK_ADDRESS_A.formattedAddress,
      point: {
        type: 'Point',
        coordinates: [MOCK_ADDRESS_A.point.lng, MOCK_ADDRESS_A.point.lat],
      },
    },
    logo: {
      index: 0,
      url: shopALogoUrl,
    },
    assets: [{ index: 0, url: shopAAssetAUrl }],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Shop B products
  const shopBId = new ObjectId('604cad85b604c1c320c328ac');

  const shopBProductAId = new ObjectId('604cad85b604c1c320c328ad');
  const shopBProductA: ShopProductModel = {
    _id: shopBProductAId,
    available: 19,
    price: 1180,
    oldPrices: [
      {
        price: 1400,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    productId: productA._id,
    citySlug: DEFAULT_CITY,
    shopId: shopBId,
    rubricId: productA.rubricId,
    companyId: companyAId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const shopBProductBId = new ObjectId('604cad85b604c1c320c328ae');
  const shopBProductB: ShopProductModel = {
    _id: shopBProductBId,
    available: 13,
    price: 1180,
    oldPrices: [],
    productId: productB._id,
    citySlug: DEFAULT_CITY,
    shopId: shopBId,
    rubricId: productB.rubricId,
    companyId: companyAId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const shopBProductDId = new ObjectId('604cad85b604c1c320c328af');
  const shopBProductD: ShopProductModel = {
    _id: shopBProductDId,
    available: 2,
    price: 1980,
    oldPrices: [],
    productId: productD._id,
    citySlug: DEFAULT_CITY,
    shopId: shopBId,
    rubricId: productD.rubricId,
    companyId: companyAId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const shopBConnectionProductAId = new ObjectId('604cad85b604c1c320c328b0');
  const shopBConnectionProductA: ShopProductModel = {
    _id: shopBConnectionProductAId,
    available: 2,
    price: 1480,
    oldPrices: [],
    productId: connectionProductA._id,
    citySlug: DEFAULT_CITY,
    shopId: shopBId,
    rubricId: connectionProductA.rubricId,
    companyId: companyAId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const shopBConnectionProductBId = new ObjectId('604cad85b604c1c320c328b1');
  const shopBConnectionProductB: ShopProductModel = {
    _id: shopBConnectionProductBId,
    available: 3,
    price: 1680,
    oldPrices: [],
    productId: connectionProductB._id,
    citySlug: DEFAULT_CITY,
    shopId: shopBId,
    rubricId: connectionProductB.rubricId,
    companyId: companyAId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const shopBConnectionProductCId = new ObjectId('604cad85b604c1c320c328b2');
  const shopBConnectionProductC: ShopProductModel = {
    _id: shopBConnectionProductCId,
    available: 5,
    price: 1720,
    oldPrices: [],
    productId: connectionProductC._id,
    citySlug: DEFAULT_CITY,
    shopId: shopBId,
    rubricId: connectionProductC.rubricId,
    companyId: companyAId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Shop B
  const shopBItemId = '2';
  const shopBLogoUrl = await findOrCreateTestAsset({
    localFilePath: shopLogoLocalFilePath,
    dist: `${ASSETS_DIST_SHOPS_LOGOS}/${shopBItemId}`,
    fileName: shopBItemId,
  });
  const shopBAssetAUrl = await findOrCreateTestAsset({
    localFilePath: shopAssetALocalFilePath,
    dist: `${ASSETS_DIST_SHOPS}/${shopBItemId}`,
    fileName: 0,
  });
  const shopBAssetBUrl = await findOrCreateTestAsset({
    localFilePath: shopAssetBLocalFilePath,
    dist: `${ASSETS_DIST_SHOPS}/${shopBItemId}`,
    fileName: 1,
  });

  const shopBName = 'shopB';
  const shopB: ShopModel = {
    _id: shopBId,

    itemId: shopBItemId,
    name: shopBName,
    companyId: companyAId,
    slug: generateSlug(shopBName),
    citySlug: DEFAULT_CITY,
    contacts: {
      emails: [`shopB@mail.com`, 'shopBB@mail.com'],
      phones: ['+78889990077', '+78889990088'],
    },
    address: {
      formattedAddress: MOCK_ADDRESS_B.formattedAddress,
      point: {
        type: 'Point',
        coordinates: [MOCK_ADDRESS_B.point.lng, MOCK_ADDRESS_B.point.lat],
      },
    },
    logo: {
      index: 0,
      url: shopBLogoUrl,
    },
    assets: [
      { index: 0, url: shopBAssetAUrl },
      { index: 1, url: shopBAssetBUrl },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Company A
  const companyName = 'companyA';
  const companySlug = generateSlug(companyName);
  const companyItemId = '1';
  const companyLocalFilePath = path.join(
    process.cwd(),
    'tests',
    'mockAssets',
    'test-company-logo.png',
  );
  const companyLogoUrl = await findOrCreateTestAsset({
    localFilePath: companyLocalFilePath,
    dist: `${ASSETS_DIST_COMPANIES}/${companyItemId}`,
    fileName: companyItemId,
  });

  const companyA: CompanyModel = {
    _id: companyAId,

    itemId: companyItemId,
    name: companyName,
    slug: companySlug,
    contacts: {
      emails: [`companyA@mail.com`, 'companyAB@mail.com'],
      phones: ['+78889990099', '+78889990199'],
    },
    ownerId: companyOwner._id,
    logo: {
      url: companyLogoUrl,
      index: 0,
    },
    staffIds: [companyManager._id],
    shopsIds: [shopAId, shopBId],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Insert all
  const createdMockShops = await shopsCollection.insertMany([shopA, shopB]);
  const mockShops = createdMockShops.ops;
  await setCollectionItemId(COL_SHOPS, 2);

  await shopProductsCollection.insertMany([
    shopAProductA,
    shopAProductB,
    shopAProductD,
    shopAConnectionProductA,
    shopAConnectionProductB,
    shopAConnectionProductC,
    shopBProductA,
    shopBProductB,
    shopBProductD,
    shopBConnectionProductA,
    shopBConnectionProductB,
    shopBConnectionProductC,
  ]);

  const createdMockCompanies = await companiesCollection.insertMany([companyA]);
  const mockCompanies = createdMockCompanies.ops;
  await setCollectionItemId(COL_COMPANIES, 1);

  // Update products shops data
  const updatedProductA = await updateProductShopsData({ productId: productA._id });
  const updatedProductB = await updateProductShopsData({ productId: productB._id });
  const updatedProductC = await updateProductShopsData({ productId: productC._id });
  const updatedProductD = await updateProductShopsData({ productId: productD._id });
  const updatedProductF = await updateProductShopsData({ productId: productF._id });
  const updatedConnectionProductA = await updateProductShopsData({
    productId: connectionProductA._id,
  });
  const updatedConnectionProductB = await updateProductShopsData({
    productId: connectionProductB._id,
  });
  const updatedConnectionProductC = await updateProductShopsData({
    productId: connectionProductC._id,
  });

  // Recalculate rubrics counters
  const rubricsIds = [rubricA._id, rubricB._id, rubricC._id, rubricD._id];
  for await (const rubricId of rubricsIds) {
    await recalculateRubricProductCounters({ rubricId });
  }

  return {
    ...productsPayload,
    mockShops,
    shopA,
    shopAProductA,
    shopAProductB,
    shopAProductD,
    shopAConnectionProductA,
    shopAConnectionProductB,
    shopAConnectionProductC,
    shopB,
    shopBProductA,
    shopBProductB,
    shopBProductD,
    shopBConnectionProductA,
    shopBConnectionProductB,
    shopBConnectionProductC,
    companyA,
    mockCompanies,
    productA: updatedProductA,
    productB: updatedProductB,
    productC: updatedProductC,
    productD: updatedProductD,
    productF: updatedProductF,
    connectionProductA: updatedConnectionProductA,
    connectionProductB: updatedConnectionProductB,
    connectionProductC: updatedConnectionProductC,
  };
};
