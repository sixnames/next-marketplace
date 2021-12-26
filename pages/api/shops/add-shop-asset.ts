import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ASSETS_DIST_SHOPS, ASSETS_SHOP_IMAGE_WIDTH } from '../../../config/common';
import { COL_SHOPS } from '../../../db/collectionNames';
import { ShopModel } from '../../../db/dbModels';
import { getDatabase } from '../../../db/mongodb';
import { getApiMessageValue } from '../../../db/dao/messages/apiMessageUtils';
import { getMainImage, storeUploads } from '../../../lib/assetUtils/assetUtils';
import { parseRestApiFormData } from '../../../lib/restApi';
import { getOperationPermission } from '../../../lib/sessionHelpers';

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
    slug: 'updateShop',
  });
  if (!allow) {
    res.status(500).send({
      success: false,
      message: message,
    });
    return;
  }

  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);

  const formData = await parseRestApiFormData(req);
  const { locale } = req.cookies;

  if (!formData || !formData.files || !formData.fields) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'shops.update.error',
        locale,
      }),
    });
    return;
  }

  const shopId = new ObjectId(`${formData.fields.shopId}`);

  // Check shop availability
  const shop = await shopsCollection.findOne({ _id: shopId });
  if (!shop) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'shops.update.notFound',
        locale,
      }),
    });
    return;
  }

  // Update shop assets
  const assets = await storeUploads({
    files: formData.files,
    dirName: shop.itemId,
    dist: ASSETS_DIST_SHOPS,
    width: ASSETS_SHOP_IMAGE_WIDTH,
  });
  if (!assets) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'shops.update.error',
        locale,
      }),
    });
    return;
  }

  // Update shop
  const updatedShopResult = await shopsCollection.findOneAndUpdate(
    { _id: shopId },
    {
      $set: {
        updatedAt: new Date(),
      },
      $push: {
        assets: {
          $each: assets,
        },
      },
    },
    {
      returnDocument: 'after',
    },
  );
  const updatedShop = updatedShopResult.value;
  if (!updatedShopResult.ok || !updatedShop) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'shops.update.error',
        locale,
      }),
    });
    return;
  }

  const mainImage = getMainImage(updatedShop.assets);
  const updatedShopMainImageResult = await shopsCollection.findOneAndUpdate(
    { _id: shopId },
    {
      $set: {
        mainImage,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: 'after',
    },
  );
  const updatedShopMainImage = updatedShopMainImageResult.value;
  if (!updatedShopMainImageResult.ok || !updatedShopMainImage) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'shops.update.error',
        locale,
      }),
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'shops.update.success',
      locale,
    }),
  });
};
