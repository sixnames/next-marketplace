import { createTestProducts, CreateTestProductsPayloadInterface } from './createTestProducts';
import { Shop, ShopModel } from '../../entities/Shop';
import { ShopProduct, ShopProductModel } from '../../entities/ShopProduct';
import generateTestAsset from './generateTestAsset';
import { ASSETS_DIST_SHOPS, ASSETS_DIST_SHOPS_LOGOS } from '../../config';
import { MOCK_SHOP, MOCK_SHOP_B } from '@yagu/mocks';

export interface CreateTestShopsPayloadInterface extends CreateTestProductsPayloadInterface {
  mockShops: Shop[];
  shopA: Shop;
  shopAProductA: ShopProduct;
  shopAProductB: ShopProduct;
  shopAProductD: ShopProduct;
  shopAConnectionProductA: ShopProduct;
  shopAConnectionProductB: ShopProduct;
  shopAConnectionProductC: ShopProduct;
  shopB: Shop;
  shopBProductA: ShopProduct;
  shopBProductB: ShopProduct;
  shopBProductD: ShopProduct;
  shopBConnectionProductA: ShopProduct;
  shopBConnectionProductB: ShopProduct;
  shopBConnectionProductC: ShopProduct;
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

  const shopLogo = await generateTestAsset({
    targetFileName: 'test-company-logo',
    dist: ASSETS_DIST_SHOPS_LOGOS,
    slug: MOCK_SHOP.slug,
  });

  const shopAsset = await generateTestAsset({
    targetFileName: 'test-shop-asset-0',
    dist: ASSETS_DIST_SHOPS,
    slug: MOCK_SHOP.slug,
  });

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

  // Shop A
  const shopA = await ShopModel.create({
    ...MOCK_SHOP,
    logo: shopLogo,
    assets: [shopAsset],
    products: [
      shopAProductA.id,
      shopAProductB.id,
      shopAProductD.id,
      shopAConnectionProductA.id,
      shopAConnectionProductB.id,
      shopAConnectionProductC.id,
    ],
  });

  // Shop B products
  const shopBProductA = await ShopProductModel.create({
    available: 19,
    price: 1180,
    oldPrices: [
      {
        price: 1400,
      },
    ],
    product: productA.id,
  });

  const shopBProductB = await ShopProductModel.create({
    available: 13,
    price: 1180,
    oldPrices: [],
    product: productB.id,
  });

  const shopBProductD = await ShopProductModel.create({
    available: 2,
    price: 1980,
    oldPrices: [],
    product: productD.id,
  });

  const shopBConnectionProductA = await ShopProductModel.create({
    available: 2,
    price: 1480,
    oldPrices: [],
    product: connectionProductA.id,
  });

  const shopBConnectionProductB = await ShopProductModel.create({
    available: 3,
    price: 1680,
    oldPrices: [],
    product: connectionProductB.id,
  });

  const shopBConnectionProductC = await ShopProductModel.create({
    available: 5,
    price: 1720,
    oldPrices: [],
    product: connectionProductC.id,
  });

  // Shop B
  const shopB = await ShopModel.create({
    ...MOCK_SHOP_B,
    logo: shopLogo,
    assets: [shopAsset],
    products: [
      shopBProductA.id,
      shopBProductB.id,
      shopBProductD.id,
      shopBConnectionProductA.id,
      shopBConnectionProductB.id,
      shopBConnectionProductC.id,
    ],
  });

  const mockShops = [shopA, shopB];

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
  };
};
