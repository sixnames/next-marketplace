import { ASSETS_DIST_PRODUCT_CARD_CONTENT } from 'config/common';
import { COL_PRODUCT_CARD_CONTENTS, COL_PRODUCTS } from 'db/collectionNames';
import { ProductCardContentModel, ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { storeUploads } from 'lib/assetUtils/assetUtils';
import { parseRestApiFormData } from 'lib/restApi';
import { getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const formData = await parseRestApiFormData(req);
  const { getApiMessage } = await getRequestParams({
    req,
    res,
  });

  if (!formData || !formData.files || !formData.fields) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('products.update.error'),
    });
    return;
  }

  const { fields, files } = formData;
  const { productId, productCardContentId } = fields;
  if (!productId || !productCardContentId) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('products.update.notFound'),
    });
    return;
  }

  // get page
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const productCardContentsCollection =
    db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);

  const product = await productsCollection.findOne({
    _id: new ObjectId(`${productId}`),
  });
  if (!product) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('products.update.notFound'),
    });
    return;
  }

  // upload asset
  const assets = await storeUploads({
    files,
    dist: ASSETS_DIST_PRODUCT_CARD_CONTENT,
    dirName: `${product.itemId}`,
  });
  if (!assets) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('products.update.error'),
    });
    return;
  }
  const asset = assets[0];

  // update page assets
  const updatedProductCardContentResult = await productCardContentsCollection.findOneAndUpdate(
    {
      _id: new ObjectId(`${productCardContentId}`),
    },
    {
      $addToSet: {
        assetKeys: asset.url,
      },
    },
    {
      returnDocument: 'after',
    },
  );
  const updatedProductCardContent = updatedProductCardContentResult.value;
  if (!updatedProductCardContentResult.ok || !updatedProductCardContent) {
    if (!assets) {
      res.status(500).send({
        success: false,
        message: await getApiMessage('pages.update.error'),
      });
      return;
    }
  }

  res.status(200).send({
    success: true,
    message: await getApiMessage('products.update.success'),
    url: asset.url,
  });
};
