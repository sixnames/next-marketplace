import { NextApiRequest, NextApiResponse } from 'next';
import { ASSETS_DIST_SEO } from '../../../config/common';
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
      message: await getApiMessage('configs.update.error'),
    });
    return;
  }

  const { fields, files } = formData;
  const { companySlug } = fields;
  if (!companySlug) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('configs.update.error'),
    });
    return;
  }

  // upload asset
  const assets = await storeUploads({
    files,
    dist: ASSETS_DIST_SEO,
    dirName: `${companySlug}`,
  });
  if (!assets) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('configs.update.error'),
    });
    return;
  }
  const asset = assets[0];

  res.status(200).send({
    success: true,
    message: await getApiMessage('configs.update.success'),
    url: asset,
  });
};
