import { COL_OPTIONS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { getApiMessageValue } from 'db/utils/apiMessageUtils';
import fs from 'fs';
import { alwaysArray } from 'lib/arrayUtils';
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
  const iconsCollection = collections.iconsCollection();
  const optionsCollection = collections.optionsCollection();
  const formData = await parseRestApiFormData(req);
  const { locale } = req.cookies;

  // Permission
  const { allow, message } = await getOperationPermission({
    context: {
      req,
      res,
    },
    slug: 'updateOption',
  });
  if (!allow) {
    res.status(500).send({
      success: false,
      message: message,
    });
    return;
  }

  // delete icon
  if (req.method === 'DELETE') {
    if (!formData || !formData.fields || !formData.fields.optionId) {
      res.status(500).send({
        success: false,
        message: await getApiMessageValue({
          slug: 'optionsGroups.updateOption.error',
          locale,
        }),
      });
      return;
    }

    const removedIconResult = await iconsCollection.findOneAndDelete({
      documentId: new ObjectId(`${formData.fields.optionId}`),
      collectionName: COL_OPTIONS,
    });
    if (!removedIconResult.ok) {
      res.status(500).send({
        success: false,
        message: await getApiMessageValue({
          slug: 'optionsGroups.updateOption.error',
          locale,
        }),
      });
      return;
    }

    res.status(200).send({
      success: true,
      message: await getApiMessageValue({
        slug: 'optionsGroups.updateOption.success',
        locale,
      }),
    });
    return;
  }

  // update icon
  if (!formData || !formData.files || !formData.fields || !formData.fields.optionId) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'optionsGroups.updateOption.error',
        locale,
      }),
    });
    return;
  }

  const assets = alwaysArray(formData.files.assets);
  const file = assets[0];
  if (!file) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'optionsGroups.updateOption.error',
        locale,
      }),
    });
    return;
  }

  const path = file.path;
  const buffer = fs.readFileSync(path);

  const icon = buffer.toString();
  const optionId = new ObjectId(`${formData.fields.optionId}`);

  const option = await optionsCollection.findOne({
    _id: optionId,
  });
  if (!option) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'optionsGroups.updateOption.error',
        locale,
      }),
    });
    return;
  }

  const createdIconResult = await iconsCollection.findOneAndUpdate(
    {
      documentId: optionId,
      collectionName: COL_OPTIONS,
    },
    {
      $set: {
        documentId: optionId,
        collectionName: COL_OPTIONS,
        icon,
      },
    },
    {
      returnDocument: 'after',
      upsert: true,
    },
  );
  const createdIcon = createdIconResult.value;
  if (!createdIconResult.ok || !createdIcon) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'optionsGroups.updateOption.error',
        locale,
      }),
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'optionsGroups.updateOption.success',
      locale,
    }),
  });
};
