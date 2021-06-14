import { ASSETS_DIST_PAGES } from 'config/common';
import { storeRestApiUploads } from 'lib/assets';
import { parseRestApiFormData } from 'lib/restApi';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const formData = await parseRestApiFormData(req);

  if (!formData || !formData.files || !formData.fields) {
    res.status(500).send({
      success: false,
      message: 'error',
    });
    return;
  }

  const { fields, files } = formData;

  const assets = await storeRestApiUploads({
    files,
    dist: ASSETS_DIST_PAGES,
    itemId: `${fields.page}`,
  });
  if (!assets) {
    res.status(500).send({
      success: false,
      message: 'upload error',
    });
    return;
  }
  const asset = assets[0];

  res.status(200).send({
    success: true,
    message: 'file uploaded',
    url: asset.url,
  });
};
