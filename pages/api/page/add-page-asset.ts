import { getDbCollections } from 'db/mongodb';
import { storeUploads } from 'lib/assetUtils/assetUtils';
import { ASSETS_DIST_PAGES, ASSETS_DIST_TEMPLATES } from 'lib/config/common';
import { parseRestApiFormData } from 'lib/restApi';
import { getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
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
      message: await getApiMessage('pages.update.error'),
    });
    return;
  }

  const { fields, files } = formData;
  const { pageId, isTemplate } = fields;
  if (!pageId) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('pages.update.notFound'),
    });
    return;
  }

  // get page
  const collections = await getDbCollections();
  const pagesCollection = collections.pagesCollection();
  const page = await pagesCollection.findOne({
    _id: new ObjectId(`${pageId}`),
  });
  if (!page) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('pages.update.notFound'),
    });
    return;
  }

  // upload asset
  const assets = await storeUploads({
    files,
    dist: isTemplate ? ASSETS_DIST_TEMPLATES : ASSETS_DIST_PAGES,
    dirName: `${pageId}`,
  });
  if (!assets) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('pages.update.error'),
    });
    return;
  }
  const asset = assets[0];

  // update page assets
  const updatedPageResult = await pagesCollection.findOneAndUpdate(
    {
      _id: new ObjectId(`${pageId}`),
    },
    {
      $addToSet: {
        assetKeys: asset,
      },
    },
    {
      returnDocument: 'after',
    },
  );
  const updatedPage = updatedPageResult.value;
  if (!updatedPageResult.ok || !updatedPage) {
    if (!assets) {
      res.status(500).send({
        success: false,
        message: await getApiMessage('pages.update.error'),
      });
      return;
    }
  }

  res.status(200).send({
    success: true,
    message: await getApiMessage('pages.update.success'),
    url: asset,
  });
};
