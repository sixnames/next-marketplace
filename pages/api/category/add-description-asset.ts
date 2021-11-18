import { ASSETS_DIST_CATEGORY_DESCRIPTIONS } from 'config/common';
import { COL_CATEGORIES, COL_CATEGORY_DESCRIPTIONS } from 'db/collectionNames';
import { CategoryDescriptionModel, CategoryModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { storeUploads } from 'lib/assetUtils/assetUtils';
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
      message: await getApiMessage('categories.update.error'),
    });
    return;
  }

  const { fields, files } = formData;
  const { categoryId, descriptionId } = fields;
  if (!categoryId || !descriptionId) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('categories.update.notFound'),
    });
    return;
  }

  // get page
  const { db } = await getDatabase();
  const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
  const categoryDescriptionsCollection =
    db.collection<CategoryDescriptionModel>(COL_CATEGORY_DESCRIPTIONS);

  const category = await categoriesCollection.findOne({
    _id: new ObjectId(`${categoryId}`),
  });
  if (!category) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('categories.update.notFound'),
    });
    return;
  }

  // upload asset
  const assets = await storeUploads({
    files,
    dist: ASSETS_DIST_CATEGORY_DESCRIPTIONS,
    dirName: category._id.toHexString(),
  });
  if (!assets) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('categories.update.error'),
    });
    return;
  }
  const asset = assets[0];

  // update description assets
  const updatedDescriptionResult = await categoryDescriptionsCollection.findOneAndUpdate(
    {
      _id: new ObjectId(`${descriptionId}`),
    },
    {
      $addToSet: {
        assetKeys: asset.url,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
    },
  );
  const updatedDescription = updatedDescriptionResult.value;
  if (!updatedDescriptionResult.ok || !updatedDescription) {
    if (!assets) {
      res.status(500).send({
        success: false,
        message: await getApiMessage('categories.update.error'),
      });
      return;
    }
  }

  res.status(200).send({
    success: true,
    message: await getApiMessage('categories.update.success'),
    url: asset.url,
  });
};