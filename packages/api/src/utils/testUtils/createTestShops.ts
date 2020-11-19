import { createTestProducts, CreateTestProductsPayloadInterface } from './createTestProducts';
import { Shop, ShopModel } from '../../entities/Shop';
import { ShopProduct, ShopProductModel } from '../../entities/ShopProduct';
import generateTestAsset from './generateTestAsset';
import { ASSETS_DIST_SHOPS, ASSETS_DIST_SHOPS_LOGOS } from '../../config';
import { MOCK_SHOP } from '@yagu/mocks';

export interface CreateTestShopsPayloadInterface extends CreateTestProductsPayloadInterface {
  mockShops: Shop[];
  shopA: Shop;
  shopAProductA: ShopProduct;
  shopAProductB: ShopProduct;
  shopAProductD: ShopProduct;
  shopAConnectionProductA: ShopProduct;
  shopAConnectionProductB: ShopProduct;
  shopAConnectionProductC: ShopProduct;
}

export const createTestShops = async (): Promise<CreateTestShopsPayloadInterface> => {
  const productsPayload = await createTestProducts();
  const {
    productA,
    productB,
    productD,
    connectionProductA,
    connectionProductB,
    connectionProductC,
  } = productsPayload;

  // Shop A products
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
      shopAProductD.id,
      shopAConnectionProductA.id,
      shopAConnectionProductB.id,
      shopAConnectionProductC.id,
    ],
  });

  const mockShops = [shopA];

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
  };
};
