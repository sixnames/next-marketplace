import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ASSETS_DIST_PROMO } from '../../../config/common';
import { COL_PROMO } from '../../../db/collectionNames';
import { PromoModel } from '../../../db/dbModels';
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
    slug: 'updatePromo',
  });
  if (!allow) {
    res.status(500).send({
      success: false,
      message: message,
    });
    return;
  }

  const formData = await parseRestApiFormData(req);
  const { locale } = req.cookies;

  if (!formData || !formData.files || !formData.fields) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'promo.update.error',
        locale,
      }),
    });
    return;
  }

  const isMobile = formData.fields.isMobile;
  const promoId = new ObjectId(`${formData.fields.promoId}`);

  const { db } = await getDatabase();
  const promoCollection = db.collection<PromoModel>(COL_PROMO);

  // Check availability
  const promo = await promoCollection.findOne({ _id: promoId });
  if (!promo) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'promo.update.error',
        locale,
      }),
    });
    return;
  }

  // Delete main banner
  if (promo.mainBanner && !isMobile) {
    await deleteUpload(promo.mainBanner);
  }
  if (promo.mainBannerMobile && isMobile) {
    await deleteUpload(promo.mainBannerMobile);
  }

  // Upload new company logo
  const uploadedAsset = await storeUploads({
    files: formData.files,
    dirName: `${formData.fields.promoId}`,
    dist: ASSETS_DIST_PROMO,
  });
  if (!uploadedAsset) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'promo.update.error',
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
        slug: 'promo.update.error',
        locale,
      }),
    });
    return;
  }

  const updater = isMobile
    ? {
        mainBannerMobile: asset,
      }
    : {
        mainBanner: asset,
      };

  // Update promo
  const updatedPromoResult = await promoCollection.findOneAndUpdate(
    { _id: promo._id },
    {
      $addToSet: {
        assetKeys: asset,
      },
      $set: {
        ...updater,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: 'after',
    },
  );
  const updatedPromo = updatedPromoResult.value;
  if (!updatedPromoResult.ok || !updatedPromo) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'promo.update.error',
        locale,
      }),
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'promo.update.success',
      locale,
    }),
  });
};
