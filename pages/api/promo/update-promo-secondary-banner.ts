import { getDbCollections } from 'db/mongodb';
import { getApiMessageValue } from 'db/utils/apiMessageUtils';
import { deleteUpload, storeUploads } from 'lib/assetUtils/assetUtils';
import { ASSETS_DIST_PROMO } from 'lib/config/common';
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

  const promoId = new ObjectId(`${formData.fields.promoId}`);
  const collections = await getDbCollections();
  const promoCollection = collections.promoCollection();

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

  // Delete promo main banner
  if (promo.secondaryBanner) {
    await deleteUpload(promo.secondaryBanner);
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

  // Update promo
  const updatedPromoResult = await promoCollection.findOneAndUpdate(
    { _id: promo._id },
    {
      $addToSet: {
        assetKeys: asset,
      },
      $set: {
        secondaryBanner: asset,
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
