import { ObjectIdModel, ProductSummaryModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { SyncParamsInterface, SyncProductInterface } from 'db/syncInterfaces';
import { summaryPipeline } from 'db/utils/constantPipelines';
import { alwaysString } from 'lib/arrayUtils';
import { DEFAULT_LOCALE } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { NextApiRequest, NextApiResponse } from 'next';

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

  const collections = await getDbCollections();
  const shopsCollection = collections.shopsCollection();
  const shopProductsCollection = collections.shopProductsCollection();

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
      ...summaryPipeline('$productId'),
    ])
    .toArray();

  const locale = DEFAULT_LOCALE;
  const shopProducts: SyncProductInterface[] = [];
  initialShopProducts.forEach((shopProduct) => {
    const { barcode, available, price, summary, shopProductUid } = shopProduct;
    if (barcode && barcode.length > 0 && summary) {
      const snippetTitle = getFieldStringLocale(summary.snippetTitleI18n, locale);

      shopProducts.push({
        id: alwaysString(shopProductUid),
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
