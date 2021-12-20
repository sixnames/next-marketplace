import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ASSETS_DIST_PROMO } from '../../../config/common';
import { COL_PROMO } from '../../../db/collectionNames';
import { PromoModel } from '../../../db/dbModels';
import { getDatabase } from '../../../db/mongodb';
import { storeUploads } from '../../../lib/assetUtils/assetUtils';
import { parseRestApiFormData } from '../../../lib/restApi';
import { getRequestParams } from '../../../lib/sessionHelpers';

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
      message: await getApiMessage('promo.update.error'),
    });
    return;
  }

  const { fields, files } = formData;
  const { promoId } = fields;
  if (!promoId) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('promo.update.error'),
    });
    return;
  }

  // get promo
  const { db } = await getDatabase();
  const promoCollection = db.collection<PromoModel>(COL_PROMO);
  const promo = await promoCollection.findOne({
    _id: new ObjectId(`${promoId}`),
  });
  if (!promo) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('promo.update.error'),
    });
    return;
  }

  // upload asset
  const assets = await storeUploads({
    files,
    dist: ASSETS_DIST_PROMO,
    dirName: `${promoId}`,
  });
  if (!assets) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('promo.update.error'),
    });
    return;
  }
  const asset = assets[0];

  // update promo assets
  const updatedPromoResult = await promoCollection.findOneAndUpdate(
    {
      _id: new ObjectId(`${promoId}`),
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
  const updatedPromo = updatedPromoResult.value;
  if (!updatedPromoResult.ok || !updatedPromo) {
    if (!assets) {
      res.status(500).send({
        success: false,
        message: await getApiMessage('promo.update.error'),
      });
      return;
    }
  }

  res.status(200).send({
    success: true,
    message: await getApiMessage('promo.update.success'),
    url: asset.url,
  });
};
