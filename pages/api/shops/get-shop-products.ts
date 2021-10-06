import { COL_PRODUCTS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { ProductModel, ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SyncParamsInterface, SyncProductInterface } from 'db/syncInterfaces';
import { ShopProductInterface } from 'db/uiInterfaces';
import { NextApiRequest, NextApiResponse } from 'next';

interface SyncProductAggregationInterface extends SyncProductInterface {
  product: ProductModel;
}

// TODO messages
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).send({
      success: false,
      message: 'wrong method',
    });
    return;
  }

  const query = req.query as unknown as SyncParamsInterface | undefined | null;

  if (!query) {
    res.status(400).send({
      success: false,
      message: 'no query params provided',
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
  const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);

  // get shop
  const shop = await shopsCollection.findOne({ token });

  if (!shop) {
    res.status(401).send({
      success: false,
      message: 'shop not found',
    });
    return;
  }

  // get shop products
  const initialShopProducts = await shopProductsCollection
    .aggregate<SyncProductAggregationInterface>([
      {
        $match: {
          shopId: shop._id,
        },
      },
      {
        $group: {
          _id: '$productId',
          barcode: {
            $addToSet: '$barcode',
          },
          price: {
            $first: '$price',
          },
          available: {
            $first: '$available',
          },
        },
      },
      {
        $lookup: {
          from: COL_PRODUCTS,
          as: 'product',
          localField: '_id',
          foreignField: '_id',
        },
      },
      {
        $addFields: {
          product: {
            $arrayElemAt: ['$product', 0],
          },
        },
      },
    ])
    .toArray();

  const shopProducts: SyncProductInterface[] = [];
  initialShopProducts.forEach((shopProduct) => {
    const { barcode, available, price, product } = shopProduct;
    if (barcode && product) {
      shopProducts.push({
        barcode,
        available,
        price,
        name: product.originalName,
      });
    }
  });
  res.status(200).send({
    success: true,
    message: 'synced',
    shopProducts,
  });
  return;
};
