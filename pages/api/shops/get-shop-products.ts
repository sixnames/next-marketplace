import { NextApiRequest, NextApiResponse } from 'next';
import { DEFAULT_LOCALE } from '../../../config/common';
import { COL_SHOP_PRODUCTS, COL_SHOPS } from '../../../db/collectionNames';
import { shopProductFieldsPipeline } from '../../../db/dao/constantPipelines';
import { ObjectIdModel, ProductSummaryModel, ShopModel } from '../../../db/dbModels';
import { getDatabase } from '../../../db/mongodb';
import { SyncParamsInterface, SyncProductInterface } from '../../../db/syncInterfaces';
import { ShopProductInterface } from '../../../db/uiInterfaces';
import { getFieldStringLocale } from '../../../lib/i18n';

interface SyncProductAggregationInterface extends Omit<SyncProductInterface, '_id'> {
  _id: ObjectIdModel;
  summary: ProductSummaryModel;
}

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

  const { token } = query;
  if (!token) {
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
      ...shopProductFieldsPipeline('$productId'),
    ])
    .toArray();

  const locale = DEFAULT_LOCALE;
  const shopProducts: SyncProductInterface[] = [];
  initialShopProducts.forEach((shopProduct) => {
    const { barcode, available, price, summary, _id } = shopProduct;
    if (barcode && barcode.length > 0 && summary) {
      const snippetTitle = getFieldStringLocale(summary.snippetTitleI18n, locale);

      shopProducts.push({
        id: _id.toHexString(),
        barcode,
        available,
        price,
        name: snippetTitle,
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
