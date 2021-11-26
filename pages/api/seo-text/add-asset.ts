import { ASSETS_DIST_SEO_TEXTS } from 'config/common';
import { storeUploads } from 'lib/assetUtils/assetUtils';
import { parseRestApiFormData } from 'lib/restApi';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface FieldsInterface {
  seoTextId: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const formData = await parseRestApiFormData(req);

  if (!formData || !formData.files || !formData.fields) {
    res.status(500).send({
      success: false,
      message: 'No fields or no files provided',
    });
    return;
  }

  const { files } = formData;
  const fields = formData.fields as unknown as FieldsInterface;

  // upload asset
  const assets = await storeUploads({
    files,
    dist: ASSETS_DIST_SEO_TEXTS,
    dirName: fields.seoTextId,
  });
  if (!assets) {
    res.status(500).send({
      success: false,
      message: 'Store uploads error',
    });
    return;
  }
  const asset = assets[0];

  res.status(200).send({
    success: true,
    message: 'success',
    url: asset.url,
  });
};
