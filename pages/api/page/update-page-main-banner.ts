import { getDbCollections } from 'db/mongodb';
import { getApiMessageValue } from 'db/utils/apiMessageUtils';
import { deleteUpload, storeUploads } from 'lib/assetUtils/assetUtils';
import { ASSETS_DIST_PAGES, ASSETS_DIST_TEMPLATES } from 'lib/config/common';
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

  const collections = await getDbCollections();
  const pagesCollection = isTemplate
    ? collections.pageTemplatesCollection()
    : collections.pagesCollection();

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
    await deleteUpload(page.mainBanner);
  }
  if (page.mainBannerMobile && isMobile) {
    await deleteUpload(page.mainBannerMobile);
  }

  // Upload new company logo
  const uploadedAsset = await storeUploads({
    files: formData.files,
    dirName: `${formData.fields.pageId}`,
    dist: isTemplate ? ASSETS_DIST_TEMPLATES : ASSETS_DIST_PAGES,
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
