import { ASSETS_DIST_SHOPS_LOGOS } from 'config/common';
import { COL_SHOPS } from 'db/collectionNames';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getApiMessageValue } from 'lib/apiMessageUtils';
import { deleteUpload, storeRestApiUploads } from 'lib/assets';
import { parseRestApiFormData } from 'lib/restApi';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await getDatabase();
  const formData = await parseRestApiFormData(req);
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const { locale } = req.cookies;

  if (!formData || !formData.files || !formData.fields) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'configs.updateAsset.error',
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

  // Delete shop logo
  const removedAsset = await deleteUpload({ filePath: `${shop.logo.url}` });
  if (!removedAsset) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'shops.update.error',
        locale,
      }),
    });
    return;
  }

  // Upload new shop logo
  const assets = await storeRestApiUploads({
    files: formData.files,
    itemId: shop.itemId,
    dist: ASSETS_DIST_SHOPS_LOGOS,
    startIndex: 0,
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
        logo: assets[0],
      },
    },
    {
      returnOriginal: false,
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

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'configs.updateAsset.success',
      locale,
    }),
  });
};
