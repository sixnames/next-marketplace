import algoliasearch from 'algoliasearch';
import { ALG_INDEX_SHOP_PRODUCTS } from 'db/algoliaIndexes';
import { COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { castDbData } from 'lib/ssrUtils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

  // algolia
  const algoliaClient = algoliasearch(
    `${process.env.ALGOLIA_APP_ID}`,
    `${process.env.ALGOLIA_API_KEY}`,
  );
  const shopProductsIndex = algoliaClient.initIndex(ALG_INDEX_SHOP_PRODUCTS);

  let error = false;

  // Shop products
  const shopProducts = await shopProductsCollection
    .aggregate([
      {
        $project: {
          objectID: {
            $toString: '$_id',
          },
          itemId: true,
          originalName: true,
          nameI18n: true,
        },
      },
    ])
    .toArray();
  const castedShopProducts = castDbData(shopProducts);
  const result = await shopProductsIndex.saveObjects(castedShopProducts);
  if (result.objectIDs.length < shopProducts.length) {
    console.log('Shop products error');
    error = true;
  }

  if (error) {
    res.status(200).send({
      success: false,
      message: 'sync error',
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: 'synced',
  });
  return;
};
