import { ASSETS_DIST_PAGES, ASSETS_DIST_TEMPLATES } from 'config/common';
import { COL_PAGES } from 'db/collectionNames';
import { PageModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getApiMessageValue } from 'lib/apiMessageUtils';
import { deleteUpload, storeRestApiUploads } from 'lib/assets';
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
  const pagesCollection = db.collection<PageModel>(COL_PAGES);
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

  const isMobile = formData.fields.isMobile;

  const { fields } = formData;
  const { isTemplate } = fields;
  const pageId = new ObjectId(`${formData.fields.pageId}`);

  // Check page availability
  const page = await pagesCollection.findOne({ _id: pageId });
  if (!page) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'pages.update.error',
        locale,
      }),
    });
    return;
  }

  // Delete page main banner
  if (page.mainBanner && !isMobile) {
    await deleteUpload({ filePath: page.mainBanner.url });
  }
  if (page.mainBannerMobile && isMobile) {
    await deleteUpload({ filePath: page.mainBannerMobile.url });
  }

  // Upload new company logo
  const uploadedAsset = await storeRestApiUploads({
    files: formData.files,
    itemId: `${formData.fields.pageId}`,
    dist: isTemplate ? ASSETS_DIST_TEMPLATES : ASSETS_DIST_PAGES,
    startIndex: 0,
  });
  if (!uploadedAsset) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'pages.update.error',
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
        slug: 'pages.update.error',
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

  // Update page
  const updatedPageResult = await pagesCollection.findOneAndUpdate(
    { _id: page._id },
    {
      $addToSet: {
        assetKeys: asset.url,
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
  const updatedPage = updatedPageResult.value;
  if (!updatedPageResult.ok || !updatedPage) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'pages.update.error',
        locale,
      }),
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'pages.update.success',
      locale,
    }),
  });
};
