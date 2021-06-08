import { DEFAULT_COUNTERS_OBJECT } from 'config/common';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { ProductModel, ShopModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { InitialSyncProductInterface, SyncParamsInterface } from 'db/syncInterfaces';
import { getCurrencyString } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

// TODO messages
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(200).send({
      success: false,
      message: 'wrong method',
    });
    return;
  }

  const body = JSON.parse(req.body || []) as InitialSyncProductInterface[] | undefined | null;
  const query = (req.query as unknown) as SyncParamsInterface | undefined | null;

  if (!body || body.length < 1 || !query) {
    res.status(200).send({
      success: false,
      message: 'no products provided',
    });
    return;
  }

  const { apiVersion, systemVersion, token } = query;
  if (!apiVersion || !systemVersion || !token) {
    res.status(200).send({
      success: false,
      message: 'no query params provided',
    });
    return;
  }

  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

  // get shop
  const shop = await shopsCollection.findOne({ token });

  if (!shop) {
    res.status(200).send({
      success: false,
      message: 'shop not found',
    });
    return;
  }

  // get products
  const barcodeList = body.map(({ barcode }) => barcode);
  const products = await productsCollection
    .find({
      barcode: {
        $in: barcodeList,
      },
    })
    .toArray();
  if (products.length < 1) {
    res.status(200).send({
      success: false,
      message: 'no products found',
    });
    return;
  }

  const shopProducts: ShopProductModel[] = [];
  for await (const product of products) {
    const bodyItem = body.find(({ barcode }) => product.barcode === barcode);
    if (!bodyItem || !bodyItem.available || !bodyItem.price) {
      break;
    }

    const { available, price } = bodyItem;

    const shopProduct: ShopProductModel = {
      _id: new ObjectId(),
      active: true,
      available,
      price,
      formattedPrice: getCurrencyString(bodyItem.price),
      formattedOldPrice: '',
      discountedPercent: 0,
      productId: product._id,
      shopId: shop._id,
      citySlug: shop.citySlug,
      oldPrices: [],
      rubricId: product.rubricId,
      rubricSlug: product.rubricSlug,
      companyId: shop.companyId,
      itemId: product.itemId,
      slug: product.slug,
      originalName: product.originalName,
      nameI18n: product.nameI18n,
      brandSlug: product.brandSlug,
      brandCollectionSlug: product.brandCollectionSlug,
      manufacturerSlug: product.manufacturerSlug,
      mainImage: product.mainImage,
      selectedOptionsSlugs: product.selectedOptionsSlugs,
      barcode: product.barcode,
      updatedAt: new Date(),
      createdAt: new Date(),
      ...DEFAULT_COUNTERS_OBJECT,
    };
    shopProducts.push(shopProduct);
  }

  const createdShopProductsResult = await shopProductsCollection.insertMany(shopProducts);
  if (!createdShopProductsResult.result.ok) {
    res.status(200).send({
      success: false,
      message: 'shop products create error',
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: 'synced',
  });
  return;
};
