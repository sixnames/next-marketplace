import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ASSETS_DIST_PRODUCTS, ASSETS_PRODUCT_IMAGE_WIDTH } from '../../../config/common';
import { COL_PRODUCT_SUMMARIES, COL_SHOP_PRODUCTS } from '../../../db/collectionNames';
import { ProductSummaryModel, ShopProductModel } from '../../../db/dbModels';
import { getDatabase } from '../../../db/mongodb';
import { getMainImage, storeUploads } from '../../../lib/assetUtils/assetUtils';
import { parseRestApiFormData } from '../../../lib/restApi';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Permission
  const { allow, message } = await getOperationPermission({
    context: {
      req,
      res,
    },
    slug: 'updateProduct',
  });
  if (!allow) {
    res.status(500).send({
      success: false,
      message: message,
    });
    return;
  }

  const { db } = await getDatabase();
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

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

  const { fields } = formData;
  const productId = new ObjectId(`${fields.productId}`);

  // Check product availability
  const summary = await productSummariesCollection.findOne({ _id: productId });
  if (!summary) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('products.update.error'),
    });
    return;
  }
  const initialAssets = summary.assets;

  // Update product assets
  const assets = await storeUploads({
    files: formData.files,
    dist: ASSETS_DIST_PRODUCTS,
    dirName: summary.itemId,
    width: ASSETS_PRODUCT_IMAGE_WIDTH,
  });
  if (!assets) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('products.update.error'),
    });
    return;
  }
  const finalAssets = [...initialAssets, ...assets];
  const mainImage = getMainImage(finalAssets);
  const updatedProductMainImageResult = await productSummariesCollection.findOneAndUpdate(
    {
      _id: productId,
    },
    {
      $set: {
        mainImage,
        assets: finalAssets,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: 'after',
    },
  );
  const updatedProductMainImage = updatedProductMainImageResult.value;
  if (!updatedProductMainImageResult.ok || !updatedProductMainImage) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('products.update.error'),
    });
    return;
  }

  const updatedShopProductsResult = await shopProductsCollection.updateMany(
    {
      productId,
    },
    {
      $set: {
        mainImage,
        updatedAt: new Date(),
      },
    },
  );
  if (!updatedShopProductsResult.acknowledged) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('products.update.error'),
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: await getApiMessage('products.update.success'),
  });
};
