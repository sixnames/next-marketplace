import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ASSETS_DIST_SHOPS, REQUEST_METHOD_DELETE } from '../../../config/common';
import { COL_SHOPS } from '../../../db/collectionNames';
import { ShopModel } from '../../../db/dbModels';
import { getDatabase } from '../../../db/mongodb';
import { getApiMessageValue } from '../../../lib/apiMessageUtils';
import { deleteUpload, storeUploads } from '../../../lib/assetUtils/assetUtils';
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

  // Check availability
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

  // delete asset
  if (req.method === REQUEST_METHOD_DELETE) {
    const updater = isDark
      ? {
          'mapMarker.darkTheme': null,
        }
      : {
          'mapMarker.lightTheme': null,
        };

    const updatedShopResult = await shopCollection.findOneAndUpdate(
      { _id: shop._id },
      {
        $set: updater,
      },
      {
        upsert: true,
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
    return;
  }

  // Delete old asset
  const oldAsset = isDark ? shop.mapMarker?.darkTheme : shop.mapMarker?.lightTheme;
  if (oldAsset) {
    await deleteUpload(oldAsset);
  }

  // Upload new asset
  const uploadedAsset = await storeUploads({
    files: formData.files,
    dirName: shop.itemId,
    dist: ASSETS_DIST_SHOPS,
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
        'mapMarker.darkTheme': asset,
      }
    : {
        'mapMarker.lightTheme': asset,
      };

  // Update shop
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
