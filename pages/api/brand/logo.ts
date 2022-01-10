import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ASSETS_DIST_BRANDS, REQUEST_METHOD_DELETE } from '../../../config/common';
import { COL_BRANDS } from '../../../db/collectionNames';
import { BrandModel } from '../../../db/dbModels';
import { getDatabase } from '../../../db/mongodb';
import { getApiMessageValue } from '../../../db/dao/messages/apiMessageUtils';
import { deleteUpload, storeUploads } from '../../../lib/assetUtils/assetUtils';
import { parseRestApiFormData } from '../../../lib/restApi';
import { getOperationPermission } from '../../../lib/sessionHelpers';

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

  // get brand
  if (!formData || !formData.fields.brandId) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'brands.update.error',
        locale,
      }),
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

  // delete
  if (req.method === REQUEST_METHOD_DELETE) {
    // remove old image
    if (brand.logo) {
      await deleteUpload(brand.logo);
    }

    const updatedBrandResult = await brandsCollection.findOneAndUpdate(
      { _id: brand._id },
      {
        $unset: {
          logo: '',
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
    return;
  }

  // update
  if (!formData.files || !formData.fields) {
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
    await deleteUpload(brand.logo);
  }

  const assets = await storeUploads({
    files: formData.files,
    dist: ASSETS_DIST_BRANDS,
    dirName: `${brand.itemId}`,
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
        logo: currentAsset,
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
