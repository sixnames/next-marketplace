import { DEFAULT_LOCALE } from 'config/common';
import { COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { shopProductFieldsPipeline } from 'db/dao/constantPipelines';
import { ObjectIdModel, ProductModel, ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SyncParamsInterface, SyncProductInterface } from 'db/syncInterfaces';
import { ShopProductInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { generateSnippetTitle } from 'lib/titleUtils';
import { NextApiRequest, NextApiResponse } from 'next';

interface SyncProductAggregationInterface extends Omit<SyncProductInterface, '_id'> {
  _id: ObjectIdModel;
  product: ProductModel;
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
      ...shopProductFieldsPipeline('$productId'),
    ])
    .toArray();

  const locale = DEFAULT_LOCALE;
  const shopProducts: SyncProductInterface[] = [];
  initialShopProducts.forEach((shopProduct) => {
    const { barcode, available, price, product, _id } = shopProduct;
    if (barcode && barcode.length > 0 && product) {
      const snippetTitle = generateSnippetTitle({
        locale,
        brand: product.brand,
        rubricName: getFieldStringLocale(product.rubric?.nameI18n, locale),
        showRubricNameInProductTitle: product.rubric?.showRubricNameInProductTitle,
        showCategoryInProductTitle: product.rubric?.showCategoryInProductTitle,
        attributes: product.attributes || [],
        categories: product.categories,
        titleCategoriesSlugs: product.titleCategoriesSlugs,
        originalName: `${product.originalName}`,
        defaultGender: `${product.gender}`,
      });

      shopProducts.push({
        _id: _id.toHexString(),
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
