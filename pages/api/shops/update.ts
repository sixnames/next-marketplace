import { COL_PRODUCTS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { ProductModel, ShopModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SyncProductInterface, SyncParamsInterface } from 'db/syncInterfaces';
import { getUpdatedShopProductPrices } from 'lib/shopUtils';
import { NextApiRequest, NextApiResponse } from 'next';

// TODO messages
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PATCH') {
    res.status(405).send({
      success: false,
      message: 'wrong method',
    });
    return;
  }

  const body = JSON.parse(req.body || []) as SyncProductInterface[] | undefined | null;
  const query = req.query as unknown as SyncParamsInterface | undefined | null;

  if (!body || body.length < 1 || !query) {
    res.status(400).send({
      success: false,
      message: 'no products provided',
    });
    return;
  }

  const { apiVersion, systemVersion, token } = query;
  if (!apiVersion || !systemVersion || !token) {
    res.status(400).send({
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
    res.status(401).send({
      success: false,
      message: 'shop not found',
    });
    return;
  }

  // get products
  const barcodeList = body.reduce((acc: string[], { barcode }) => {
    if (barcode && barcode.length > 0) {
      return [...acc, ...barcode];
    }
    return acc;
  }, []);

  const products = await productsCollection
    .find({
      barcode: {
        $in: barcodeList,
      },
    })
    .toArray();
  if (products.length < 1) {
    res.status(500).send({
      success: false,
      message: 'no products found',
    });
    return;
  }

  const updatedShopProducts: ShopProductModel[] = [];
  for await (const product of products) {
    const bodyItem = body.find(({ barcode }) => product.barcode?.includes(`${barcode}`));
    if (!bodyItem || !bodyItem.available || !bodyItem.price || !bodyItem.barcode) {
      continue;
    }

    const { barcode } = bodyItem;
    if (!barcode || barcode.length < 1) {
      continue;
    }

    const shopProduct = await shopProductsCollection.findOne({
      shopId: shop._id,
      barcode: {
        $in: bodyItem.barcode,
      },
    });

    if (!shopProduct) {
      continue;
    }

    const { discountedPercent, oldPrice, oldPriceUpdater } = getUpdatedShopProductPrices({
      shopProduct,
      newPrice: bodyItem.price,
    });

    const updatedShopProductResult = await shopProductsCollection.findOneAndUpdate(
      {
        _id: shopProduct._id,
      },
      {
        $set: {
          available: bodyItem.available,
          price: bodyItem.price,
          oldPrice,
          discountedPercent,
          updatedAt: new Date(),
        },
        ...oldPriceUpdater,
      },
      {
        returnDocument: 'after',
      },
    );
    const updatedShopProduct = updatedShopProductResult.value;

    if (updatedShopProductResult.ok && updatedShopProduct) {
      updatedShopProducts.push(updatedShopProduct);
    }
  }

  if (updatedShopProducts.length !== products.length) {
    res.status(500).send({
      success: false,
      message: 'not all products updated',
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: 'synced',
  });
  return;
};
