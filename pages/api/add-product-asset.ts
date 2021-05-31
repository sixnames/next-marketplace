import { ASSETS_DIST_PRODUCTS } from 'config/common';
import { COL_PRODUCT_ASSETS, COL_PRODUCTS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { ProductAssetsModel, ProductModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getApiMessageValue } from 'lib/apiMessageUtils';
import { getMainImage, storeRestApiUploads } from 'lib/assets';
import { noNaN } from 'lib/numbers';
import { parseRestApiFormData } from 'lib/restApi';
import { getOperationPermission } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

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

  const db = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);

  const formData = await parseRestApiFormData(req);
  const { locale } = req.cookies;

  if (!formData || !formData.files || !formData.fields) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'products.update.error',
        locale,
      }),
    });
    return;
  }

  const { fields } = formData;
  const productId = new ObjectId(`${fields.productId}`);

  // Check product availability
  const product = await productsCollection.findOne({ _id: productId });
  const initialAssets = await productAssetsCollection.findOne({ productId });
  if (!product || !initialAssets) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'products.update.error',
        locale,
      }),
    });
    return;
  }

  // Update product assets
  const sortedAssets = initialAssets.assets.sort((assetA, assetB) => {
    return assetB.index - assetA.index;
  });
  const firstAsset = sortedAssets[0];
  const startIndex = noNaN(firstAsset?.index);
  const assets = await storeRestApiUploads({
    files: formData.files,
    dist: ASSETS_DIST_PRODUCTS,
    itemId: product.itemId,
    startIndex,
  });
  if (!assets) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'products.update.error',
        locale,
      }),
    });
    return;
  }
  const finalAssets = [...initialAssets.assets, ...assets];
  const mainImage = getMainImage(finalAssets);

  // Update product
  const updatedProductAssetsResult = await productAssetsCollection.findOneAndUpdate(
    {
      productId,
    },
    {
      $set: {
        assets: finalAssets,
      },
    },
    {
      returnOriginal: false,
    },
  );

  const updatedProductAssets = updatedProductAssetsResult.value;
  if (!updatedProductAssetsResult.ok || !updatedProductAssets) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'products.update.error',
        locale,
      }),
    });
    return;
  }
  const updatedProductMainImageResult = await productsCollection.findOneAndUpdate(
    {
      _id: productId,
    },
    {
      $set: {
        mainImage,
        updatedAt: new Date(),
      },
    },
    {
      returnOriginal: false,
    },
  );

  const updatedProductMainImage = updatedProductMainImageResult.value;
  if (!updatedProductMainImageResult.ok || !updatedProductMainImage) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'products.update.error',
        locale,
      }),
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
  if (!updatedShopProductsResult.result.ok) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'products.update.error',
        locale,
      }),
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'products.update.success',
      locale,
    }),
  });
};
