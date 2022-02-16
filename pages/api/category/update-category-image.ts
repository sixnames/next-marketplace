import { getDbCollections } from 'db/mongodb';
import { getApiMessageValue } from 'db/utils/apiMessageUtils';
import { deleteUpload, storeUploads } from 'lib/assetUtils/assetUtils';
import { ASSETS_DIST_CATEGORIES } from 'lib/config/common';
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
  const collections = await getDbCollections();
  const categoriesCollection = collections.categoriesCollection();
  const formData = await parseRestApiFormData(req);
  const { locale } = req.cookies;

  if (!formData || !formData.fields || !formData.fields.categoryId) {
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
    slug: 'updateCategory',
  });
  if (!allow) {
    res.status(500).send({
      success: false,
      message: message,
    });
    return;
  }

  // delete image
  if (req.method === 'DELETE') {
    const category = await categoriesCollection.findOne({
      _id: new ObjectId(`${formData.fields.categoryId}`),
    });
    if (!category) {
      res.status(500).send({
        success: false,
        message: await getApiMessageValue({
          slug: 'categories.update.error',
          locale,
        }),
      });
      return;
    }

    // remove old image
    if (category.image) {
      await deleteUpload(category.image);
    }

    const updatedCategoryResult = await categoriesCollection.findOneAndUpdate(
      { _id: category._id },
      {
        $set: {
          image: null,
        },
      },
      {
        returnDocument: 'after',
      },
    );
    const updatedCategory = updatedCategoryResult.value;
    if (!updatedCategoryResult.ok || !updatedCategory) {
      res.status(500).send({
        success: false,
        message: await getApiMessageValue({
          slug: 'categories.update.error',
          locale,
        }),
      });
      return;
    }

    res.status(200).send({
      success: true,
      message: await getApiMessageValue({
        slug: 'categories.update.success',
        locale,
      }),
    });
    return;
  }

  // add image
  if (!formData.files) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'optionsGroups.updateOption.error',
        locale,
      }),
    });
    return;
  }

  const category = await categoriesCollection.findOne({
    _id: new ObjectId(`${formData.fields.categoryId}`),
  });
  if (!category) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'categories.update.error',
        locale,
      }),
    });
    return;
  }

  // remove old image
  if (category.image) {
    await deleteUpload(category.image);
  }

  const assets = await storeUploads({
    files: formData.files,
    dist: ASSETS_DIST_CATEGORIES,
    dirName: `${category.slug}`,
  });

  if (!assets) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'categories.update.error',
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
        slug: 'categories.update.error',
        locale,
      }),
    });
    return;
  }

  const updatedCategoryResult = await categoriesCollection.findOneAndUpdate(
    { _id: category._id },
    {
      $set: {
        image: currentAsset,
      },
    },
    {
      returnDocument: 'after',
    },
  );
  const updatedCategory = updatedCategoryResult.value;
  if (!updatedCategoryResult.ok || !updatedCategory) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'categories.update.error',
        locale,
      }),
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'categories.update.success',
      locale,
    }),
  });
};
