import { ASSETS_DIST_RUBRIC_DESCRIPTIONS } from 'config/common';
import { COL_RUBRIC_DESCRIPTIONS, COL_RUBRICS } from 'db/collectionNames';
import { RubricDescriptionModel, RubricModel } from 'db/dbModels';
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
      message: await getApiMessage('rubrics.update.error'),
    });
    return;
  }

  const { fields, files } = formData;
  const { rubricId, descriptionId } = fields;
  if (!rubricId || !descriptionId) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('rubrics.update.notFound'),
    });
    return;
  }

  // get page
  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const rubricDescriptionsCollection =
    db.collection<RubricDescriptionModel>(COL_RUBRIC_DESCRIPTIONS);

  const rubric = await rubricsCollection.findOne({
    _id: new ObjectId(`${rubricId}`),
  });
  if (!rubric) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('rubrics.update.notFound'),
    });
    return;
  }

  // upload asset
  const assets = await storeUploads({
    files,
    dist: ASSETS_DIST_RUBRIC_DESCRIPTIONS,
    dirName: `${rubric.slug}`,
  });
  if (!assets) {
    res.status(500).send({
      success: false,
      message: await getApiMessage('rubrics.update.error'),
    });
    return;
  }
  const asset = assets[0];

  // update description assets
  const updatedDescriptionResult = await rubricDescriptionsCollection.findOneAndUpdate(
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
        message: await getApiMessage('rubrics.update.error'),
      });
      return;
    }
  }

  res.status(200).send({
    success: true,
    message: await getApiMessage('rubrics.update.success'),
    url: asset.url,
  });
};
