import { ASSETS_DIST_OPTIONS } from 'config/common';
import { COL_BRANDS } from 'db/collectionNames';
import { BrandModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getApiMessageValue } from 'lib/apiMessageUtils';
import { deleteUpload, storeRestApiUploads } from 'lib/assetUtils/assetUtils';
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
  const { db } = await getDatabase();
  const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
  const formData = await parseRestApiFormData(req);
  const { locale } = req.cookies;

  if (!formData || !formData.files || !formData.fields || !formData.fields.brandId) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'optionsGroups.updateOption.error',
        locale,
      }),
    });
    return;
  }

  // Permission
  const { allow, message } = await getOperationPermission({
    context: {
      req,
      res,
    },
    slug: 'updateBrand',
  });
  if (!allow) {
    res.status(500).send({
      success: false,
      message: message,
    });
    return;
  }

  const brand = await brandsCollection.findOne({
    _id: new ObjectId(`${formData.fields.brandId}`),
  });
  if (!brand) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'brands.update.error',
        locale,
      }),
    });
    return;
  }

  // remove old image
  if (brand.logo) {
    await deleteUpload({ filePath: brand.logo });
  }

  const assets = await storeRestApiUploads({
    files: formData.files,
    dist: ASSETS_DIST_OPTIONS,
    itemId: `${brand.slug}`,
  });

  if (!assets) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'brands.update.error',
        locale,
      }),
    });
    return;
  }
  const currentAsset = assets[0];
  if (!currentAsset) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'brands.update.error',
        locale,
      }),
    });
    return;
  }

  const updatedBrandResult = await brandsCollection.findOneAndUpdate(
    { _id: brand._id },
    {
      $set: {
        logo: currentAsset.url,
      },
    },
    {
      returnDocument: 'after',
    },
  );
  const updatedBrand = updatedBrandResult.value;
  if (!updatedBrandResult.ok || !updatedBrand) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'brands.update.error',
        locale,
      }),
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'brands.update.success',
      locale,
    }),
  });
};
