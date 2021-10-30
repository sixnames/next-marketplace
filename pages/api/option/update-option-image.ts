import { ASSETS_DIST_OPTIONS } from 'config/common';
import { COL_OPTIONS } from 'db/collectionNames';
import { OptionModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getApiMessageValue } from 'lib/apiMessageUtils';
import { deleteUpload, storeUploads } from 'lib/assetUtils/assetUtils';
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
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
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

  // delete image
  if (req.method === 'DELETE') {
    const option = await optionsCollection.findOne({
      _id: new ObjectId(`${formData.fields.optionId}`),
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
    // remove old image
    if (option.image) {
      await deleteUpload(option.image);
    }

    const updatedOptionResult = await optionsCollection.findOneAndUpdate(
      { _id: option._id },
      {
        $set: {
          image: null,
        },
      },
      {
        returnDocument: 'after',
      },
    );
    const updatedOption = updatedOptionResult.value;
    if (!updatedOptionResult.ok || !updatedOption) {
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

  const option = await optionsCollection.findOne({
    _id: new ObjectId(`${formData.fields.optionId}`),
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

  // remove old image
  if (option.image) {
    await deleteUpload(option.image);
  }

  const assets = await storeUploads({
    files: formData.files,
    dist: ASSETS_DIST_OPTIONS,
    dirName: `${option.slug}`,
  });

  if (!assets) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'optionsGroups.updateOption.error',
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
        slug: 'optionsGroups.updateOption.error',
        locale,
      }),
    });
    return;
  }

  const updatedOptionResult = await optionsCollection.findOneAndUpdate(
    { _id: option._id },
    {
      $set: {
        image: currentAsset.url,
      },
    },
    {
      returnDocument: 'after',
    },
  );
  const updatedOption = updatedOptionResult.value;
  if (!updatedOptionResult.ok || !updatedOption) {
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
