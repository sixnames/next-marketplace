import { ASSETS_DIST_SHOPS } from 'config/common';
import { COL_SHOPS } from 'db/collectionNames';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getApiMessageValue } from 'lib/apiMessageUtils';
import { deleteUpload, storeRestApiUploads } from 'lib/assets';
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
    slug: 'updatePage',
  });
  if (!allow) {
    res.status(500).send({
      success: false,
      message: message,
    });
    return;
  }

  const { db } = await getDatabase();
  const shopCollection = db.collection<ShopModel>(COL_SHOPS);
  const formData = await parseRestApiFormData(req);
  const { locale } = req.cookies;

  if (!formData || !formData.files || !formData.fields) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'pages.update.error',
        locale,
      }),
    });
    return;
  }

  const shopId = new ObjectId(`${formData.fields.shopId}`);
  const isDark = Boolean(formData.fields.isDark);

  // Check page availability
  const shop = await shopCollection.findOne({ _id: shopId });
  if (!shop) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'shops.update.error',
        locale,
      }),
    });
    return;
  }

  // Delete page main banner
  const oldAsset = isDark ? shop.mapMarker?.darkTheme : shop.mapMarker?.lightTheme;
  if (oldAsset) {
    await deleteUpload({ filePath: oldAsset });
  }

  // Upload new company logo
  const uploadedAsset = await storeRestApiUploads({
    files: formData.files,
    itemId: shop.itemId,
    dist: ASSETS_DIST_SHOPS,
    startIndex: 0,
  });
  if (!uploadedAsset) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'shops.update.error',
        locale,
      }),
    });
    return;
  }

  const asset = uploadedAsset[0];
  if (!asset) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'shops.update.error',
        locale,
      }),
    });
    return;
  }

  const updater = isDark
    ? {
        'mapMarker.darkTheme': asset.url,
      }
    : {
        'mapMarker.lightTheme': asset.url,
      };

  // Update company
  const updatedShopResult = await shopCollection.findOneAndUpdate(
    { _id: shop._id },
    {
      $set: {
        ...updater,
        updatedAt: new Date(),
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
      slug: 'shops.update.success',
      locale,
    }),
  });
};
