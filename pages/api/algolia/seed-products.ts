import algoliasearch from 'algoliasearch';
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
  const productsIndex = algoliaClient.initIndex(`${process.env.ALG_INDEX_PRODUCTS}`);

  let error = false;

  // Products
  const products = await productsCollection
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
  const castedProducts = castDbData(products);
  const result = await productsIndex.saveObjects(castedProducts);
  if (result.objectIDs.length < products.length) {
    console.log('Products error');
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
