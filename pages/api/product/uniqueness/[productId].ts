import { COL_PRODUCTS } from 'db/collectionNames';
import { ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { parseRestApiFormData } from 'lib/restApi';
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
    const formData = await parseRestApiFormData(req);

    console.log(' ');
    console.log('req');
    console.log(req);
    console.log(' ');
    console.log('req body >>>>>>>>>');
    console.log(formData);
    console.log(' ');

    const productId = new ObjectId(`${req.query.productId}`);
    const product = await productsCollection.findOne({
      _id: productId,
    });
    if (!product) {
      res.status(200).send('ok');
      return;
    }

    const cardDescriptionInfoI18n = product.cardDescriptionInfoI18n || {};
    const body = req.body || {};
    await productsCollection.findOneAndUpdate(
      { _id: productId },
      {
        $set: {
          cardDescriptionInfoI18n: {
            ...cardDescriptionInfoI18n,
            ...body,
          },
        },
      },
    );

    res.status(200).send('ok');
  } catch (e) {
    console.log(e);
    res.status(200);
  }
};
