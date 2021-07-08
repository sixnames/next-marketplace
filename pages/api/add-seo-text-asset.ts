import { ASSETS_DIST_SEO } from 'config/common';
import { storeRestApiUploads } from 'lib/assets';
import { parseRestApiFormData } from 'lib/restApi';
import { getRequestParams } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

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

  console.log(formData);

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
  const assets = await storeRestApiUploads({
    files,
    dist: ASSETS_DIST_SEO,
    itemId: `${companySlug}`,
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
    url: asset.url,
  });
};