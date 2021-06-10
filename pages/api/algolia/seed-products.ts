import algoliasearch from 'algoliasearch';
import { ALG_INDEX_PRODUCTS } from 'db/algoliaIndexes';
import { COL_PRODUCTS } from 'db/collectionNames';
import { ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { castDbData } from 'lib/ssrUtils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

  // algolia
  const algoliaClient = algoliasearch(
    `${process.env.ALGOLIA_APP_ID}`,
    `${process.env.ALGOLIA_API_KEY}`,
  );
  const productsIndex = algoliaClient.initIndex(ALG_INDEX_PRODUCTS);

  let error = false;

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
