import { getDbCollections } from 'db/mongodb';
import { getApiMessageValue } from 'db/utils/apiMessageUtils';
import { deleteUpload, storeUploads } from 'lib/assetUtils/assetUtils';
import { ASSETS_DIST_SHOPS_LOGOS, ASSETS_LOGO_WIDTH } from 'lib/config/common';
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
    slug: 'updateShop',
  });
  if (!allow) {
    res.status(500).send({
      success: false,
      message: message,
    });
    return;
  }

  const collections = await getDbCollections();
  const formData = await parseRestApiFormData(req);
  const shopsCollection = collections.shopsCollection();
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
  const removedAsset = await deleteUpload(`${shop.logo}`);
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
  const assets = await storeUploads({
    files: formData.files,
    dirName: shop.itemId,
    dist: ASSETS_DIST_SHOPS_LOGOS,
    width: ASSETS_LOGO_WIDTH,
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

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'configs.updateAsset.success',
      locale,
    }),
  });
};
