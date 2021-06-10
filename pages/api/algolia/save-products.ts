import algoliasearch from 'algoliasearch';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { ProductModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { castDbData } from 'lib/ssrUtils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

  // algolia
  const algoliaClient = algoliasearch(
    `${process.env.ALGOLIA_APP_ID}`,
    `${process.env.ALGOLIA_API_KEY}`,
  );
  const shopProductsIndex = algoliaClient.initIndex('shop_products');
  const productsIndex = algoliaClient.initIndex('products');

  let error = false;

  // Shop products
  const shopProducts = await shopProductsCollection.aggregate([]).toArray();
  const castedShopProducts = castDbData(shopProducts).map((shopProduct: any) => {
    return {
      objectID: shopProduct._id,
      ...shopProduct,
    };
  });
  shopProductsIndex
    .saveObjects(castedShopProducts)
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log('Shop products error');
      console.log(e);
      error = true;
    });

  // Products
  const products = await productsCollection.aggregate([]).toArray();
  const castedProducts = castDbData(products).map((shopProduct: any) => {
    return {
      objectID: shopProduct._id,
      ...shopProduct,
    };
  });
  productsIndex
    .saveObjects(castedProducts)
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log('Shop products error');
      console.log(e);
      error = true;
    });

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
