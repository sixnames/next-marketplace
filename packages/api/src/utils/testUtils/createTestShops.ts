import { createTestProducts, CreateTestProductsPayloadInterface } from './createTestProducts';
import { Shop, ShopModel } from '../../entities/Shop';
import { ShopProduct, ShopProductModel } from '../../entities/ShopProduct';
import generateTestAsset from './generateTestAsset';
import { ASSETS_DIST_SHOPS, ASSETS_DIST_SHOPS_LOGOS } from '../../config';
import { DEFAULT_CITY, MOCK_ADDRESS_A, MOCK_ADDRESS_B } from '@yagu/shared';
import { fakerEn, getFakePhone } from './fakerLocales';
import { generateSlug } from '../slug';

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
    // rubricLevelOneA,
    // attributesGroupWineFeatures,
    // attributeString,
    // attributeWineCombinations,
    // attributeNumber,
    // optionsSlugsCombination,
    // attributeWineType,
    // optionsSlugsWineType,
  } = productsPayload;

  // Shop A
  const shopAName = fakerEn.commerce.productName();
  const shopASlug = generateSlug(shopAName);

  const shopLogo = await generateTestAsset({
    targetFileName: 'test-company-logo',
    dist: ASSETS_DIST_SHOPS_LOGOS,
    slug: shopASlug,
  });

  const shopAsset = await generateTestAsset({
    targetFileName: 'test-shop-asset-0',
    dist: ASSETS_DIST_SHOPS,
    slug: shopASlug,
  });

  // Shop A products
  const shopAProductA = await ShopProductModel.create({
    available: 20,
    price: 100,
    oldPrices: [],
    product: productA.id,
    city: DEFAULT_CITY,
  });

  const shopAProductB = await ShopProductModel.create({
    available: 3,
    price: 180,
    oldPrices: [],
    product: productB.id,
    city: DEFAULT_CITY,
  });

  const shopAProductD = await ShopProductModel.create({
    available: 0,
    price: 980,
    oldPrices: [],
    product: productD.id,
    city: DEFAULT_CITY,
  });

  const shopAConnectionProductA = await ShopProductModel.create({
    available: 32,
    price: 480,
    oldPrices: [],
    product: connectionProductA.id,
    city: DEFAULT_CITY,
  });

  const shopAConnectionProductB = await ShopProductModel.create({
    available: 0,
    price: 680,
    oldPrices: [],
    product: connectionProductB.id,
    city: DEFAULT_CITY,
  });

  const shopAConnectionProductC = await ShopProductModel.create({
    available: 45,
    price: 720,
    oldPrices: [],
    product: connectionProductC.id,
    city: DEFAULT_CITY,
  });

  const shopA = await ShopModel.create({
    nameString: shopAName,
    slug: shopASlug,
    city: DEFAULT_CITY,
    contacts: {
      emails: [fakerEn.internet.email(), fakerEn.internet.email()],
      phones: [getFakePhone(), getFakePhone()],
    },
    address: {
      formattedAddress: MOCK_ADDRESS_A.formattedAddress,
      point: {
        coordinates: [MOCK_ADDRESS_A.point.lng, MOCK_ADDRESS_A.point.lat],
      },
    },
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

  // Create 100 mock products
  /*let n = 0;
  while (n < 100) {
    const name = `product-${n}`;
    const shopAMoreProduct = await ProductModel.create(
      await generateTestProduct({
        priority: 10,
        slug: name,
        name: [
          { key: DEFAULT_LANG, value: name },
          { key: SECONDARY_LANG, value: name },
        ],
        cardName: [
          { key: DEFAULT_LANG, value: name },
          { key: SECONDARY_LANG, value: name },
        ],
        // views: [{ key: DEFAULT_CITY, counter: n + 100 }],
        views: [{ key: DEFAULT_CITY, counter: 10 }],
        price: 100,
        description: [
          { key: DEFAULT_LANG, value: name },
          { key: SECONDARY_LANG, value: name },
        ],
        rubrics: [rubricLevelOneA.id],
        attributesGroups: [
          {
            node: attributesGroupWineFeatures.id,
            showInCard: true,
            attributes: [
              {
                node: attributeWineType.id,
                showInCard: true,
                key: attributeWineType.slug,
                value: [optionsSlugsWineType[2]],
                viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as ProductAttributeViewVariantEnum,
              },
              {
                node: attributeString.id,
                showInCard: true,
                key: attributeString.slug,
                value: ['Very long string attribute.'],
                viewVariant: ATTRIBUTE_VIEW_VARIANT_TEXT as ProductAttributeViewVariantEnum,
              },
              {
                node: attributeWineCombinations.id,
                showInCard: true,
                key: attributeWineCombinations.slug,
                value: optionsSlugsCombination,
                viewVariant: ATTRIBUTE_VIEW_VARIANT_ICON as ProductAttributeViewVariantEnum,
              },
              {
                node: attributeNumber.id,
                showInCard: true,
                key: attributeNumber.slug,
                value: ['123'],
                viewVariant: ATTRIBUTE_VIEW_VARIANT_TEXT as ProductAttributeViewVariantEnum,
              },
            ],
          },
        ],
      }),
    );

    const shopMoreProduct = await ShopProductModel.create({
      available: 20,
      price: 100 + n,
      oldPrices: [],
      product: shopAMoreProduct.id,
      city: DEFAULT_CITY,
    });

    await ShopModel.findByIdAndUpdate(shopA.id, {
      $push: {
        products: shopMoreProduct.id,
      },
    });
    ///////
    n++;
  }*/

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
    city: DEFAULT_CITY,
  });

  const shopBProductB = await ShopProductModel.create({
    available: 13,
    price: 1180,
    oldPrices: [],
    product: productB.id,
    city: DEFAULT_CITY,
  });

  const shopBProductD = await ShopProductModel.create({
    available: 2,
    price: 1980,
    oldPrices: [],
    product: productD.id,
    city: DEFAULT_CITY,
  });

  const shopBConnectionProductA = await ShopProductModel.create({
    available: 2,
    price: 1480,
    oldPrices: [],
    product: connectionProductA.id,
    city: DEFAULT_CITY,
  });

  const shopBConnectionProductB = await ShopProductModel.create({
    available: 3,
    price: 1680,
    oldPrices: [],
    product: connectionProductB.id,
    city: DEFAULT_CITY,
  });

  const shopBConnectionProductC = await ShopProductModel.create({
    available: 5,
    price: 1720,
    oldPrices: [],
    product: connectionProductC.id,
    city: DEFAULT_CITY,
  });

  // Shop B
  const shopBName = fakerEn.commerce.productName();
  const shopB = await ShopModel.create({
    nameString: shopBName,
    slug: generateSlug(shopBName),
    city: DEFAULT_CITY,
    contacts: {
      emails: [fakerEn.internet.email(), fakerEn.internet.email()],
      phones: [getFakePhone(), getFakePhone()],
    },
    address: {
      formattedAddress: MOCK_ADDRESS_B.formattedAddress,
      point: {
        coordinates: [MOCK_ADDRESS_B.point.lng, MOCK_ADDRESS_B.point.lat],
      },
    },
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
