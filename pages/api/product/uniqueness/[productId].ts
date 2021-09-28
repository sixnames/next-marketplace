import { COL_PRODUCTS } from 'db/collectionNames';
import { ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { db } = await getDatabase();
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

    console.log('');
    console.log('response query');
    console.log(JSON.stringify(req.query, null, 2));
    console.log('');
    console.log('response body');
    console.log(JSON.stringify(req.body || {}, null, 2));
    console.log('');

    const productId = new ObjectId(`${req.query.productId}`);
    await productsCollection.findOneAndUpdate(
      { _id: productId },
      {
        $set: {
          cardDescriptionInfoI18n: req.body,
        },
      },
    );

    res.status(200).send('ok');
  } catch (e) {
    console.log(e);
    res.status(200);
  }
};
