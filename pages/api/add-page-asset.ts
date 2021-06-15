import { ASSETS_DIST_PAGES } from 'config/common';
import { COL_PAGES } from 'db/collectionNames';
import { PageModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { storeRestApiUploads } from 'lib/assets';
import { parseRestApiFormData } from 'lib/restApi';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

// TODO pageID
// TODO api messages
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
  const { pageId } = fields;
  if (!pageId) {
    res.status(500).send({
      success: false,
      message: 'page not found',
    });
    return;
  }

  // get page
  const { db } = await getDatabase();
  const pagesCollection = db.collection<PageModel>(COL_PAGES);
  const page = await pagesCollection.findOne({
    _id: new ObjectId(`${pageId}`),
  });
  if (!page) {
    res.status(500).send({
      success: false,
      message: 'page not found',
    });
    return;
  }

  // upload asset
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

  // update page assets
  const updatedPageResult = await pagesCollection.findOneAndUpdate(
    {
      _id: new ObjectId(`${pageId}`),
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
  const updatedPage = updatedPageResult.value;
  if (!updatedPageResult.ok || !updatedPage) {
    if (!assets) {
      res.status(500).send({
        success: false,
        message: 'page update error',
      });
      return;
    }
  }

  res.status(200).send({
    success: true,
    message: 'file uploaded',
    url: asset.url,
  });
};
