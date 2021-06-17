import {
  ASSETS_DIST_CONFIGS,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_CITY,
  DEFAULT_LOCALE,
} from 'config/common';
import { COL_CONFIGS } from 'db/collectionNames';
import { ConfigModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getApiMessageValue } from 'lib/apiMessageUtils';
import { storeRestApiUploads } from 'lib/assets';
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
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const formData = await parseRestApiFormData(req);
  const { locale } = req.cookies;

  if (!formData || !formData.files || !formData.fields) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'configs.updateAsset.error',
        locale,
      }),
    });
    return;
  }

  const { fields } = formData;
  const { _id, ...config }: ConfigModel = JSON.parse(`${fields.config}`);

  // Permission
  const { allow, message } = await getOperationPermission({
    context: {
      req,
      res,
    },
    slug: config.companySlug === DEFAULT_COMPANY_SLUG ? 'updateConfig' : 'updateCompanyConfig',
  });
  if (!allow) {
    res.status(500).send({
      success: false,
      message: message,
    });
    return;
  }

  const assets = await storeRestApiUploads({
    files: formData.files,
    dist: `${ASSETS_DIST_CONFIGS}/${config.companySlug}`,
    itemId: `${fields.slug}`,
  });
  if (!assets) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'configs.updateAsset.error',
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
        slug: 'configs.updateAsset.error',
        locale,
      }),
    });
    return;
  }

  const updatedConfigResult = await configsCollection.findOneAndUpdate(
    { _id: new ObjectId(_id) },
    {
      $set: {
        ...config,
        cities: {
          [DEFAULT_CITY]: {
            [DEFAULT_LOCALE]: [currentAsset.url],
          },
        },
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
    },
  );
  const updatedConfig = updatedConfigResult.value;
  if (!updatedConfigResult.ok || !updatedConfig) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'configs.updateAsset.error',
        locale,
      }),
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'configs.updateAsset.success',
      locale,
    }),
  });
};
