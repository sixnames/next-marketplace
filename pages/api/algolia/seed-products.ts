import { COL_PRODUCTS } from 'db/collectionNames';
import { ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { saveAlgoliaObjects } from 'lib/algoliaUtils';
import { castDbData } from 'lib/ssrUtils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

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
          barcode: true,
        },
      },
    ])
    .toArray();
  const castedProducts = castDbData(products);
  const saveResult = await saveAlgoliaObjects({
    indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
    objects: castedProducts,
  });
  if (!saveResult) {
    res.status(500).send({
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
