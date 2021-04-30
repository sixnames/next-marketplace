import {
  ASSETS_DIST_CONFIGS,
  COOKIE_COMPANY_SLUG,
  DEFAULT_CITY,
  DEFAULT_LOCALE,
} from 'config/common';
import { COL_CONFIGS } from 'db/collectionNames';
import { AssetModel, ConfigModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import Formidable, { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import { getApiMessageValue } from 'lib/apiMessageUtils';
import { alwaysArray } from 'lib/arrayUtils';
import { uploadFileToS3 } from 'lib/s3';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import mime from 'mime-types';

interface StoreUploadsAsset {
  buffer: Buffer;
  ext: string | false;
}

export interface StoreUploadsInterface {
  files: StoreUploadsAsset[];
  itemId: number | string;
  dist: string;
  startIndex?: number;
}

export async function storeUploads({ files, itemId, dist, startIndex = 0 }: StoreUploadsInterface) {
  try {
    const filePath = `${dist}/${itemId}`;
    const assets: AssetModel[] = [];

    for await (const [index, file] of files.entries()) {
      const fileIndex = index + 1;
      const finalStartIndex = startIndex + 1;
      const finalIndex = finalStartIndex + fileIndex;
      const { buffer, ext } = file;
      const fileName = `${itemId}-${finalIndex}${ext ? `.${ext}` : ''}`;

      if (!buffer) {
        return null;
      }

      // Upload Buffer to the S3
      const url = await uploadFileToS3({
        buffer,
        filePath,
        fileName,
      });

      assets.push({ index: finalIndex, url });
    }

    return assets;
  } catch (e) {
    console.log(e);
    return [];
  }
}

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

interface DataInterface {
  fields: Formidable.Fields;
  files: Formidable.Files;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await getDatabase();
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);

  // parse form with a Promise wrapper
  const data: DataInterface = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });

  const files: StoreUploadsAsset[] = [];
  for await (const file of alwaysArray(data?.files?.assets)) {
    const buffer = await fs.readFile(file.path);
    files.push({
      buffer,
      ext: mime.extension(file.type),
    });
  }

  const assets = await storeUploads({
    files,
    dist: `${ASSETS_DIST_CONFIGS}/${req.cookies[COOKIE_COMPANY_SLUG]}`,
    itemId: `${data?.fields.slug}`,
  });
  if (!assets) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'configs.updateAsset.error',
        locale: req.cookies.locale,
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
        locale: req.cookies.locale,
      }),
    });
    return;
  }

  const updatedConfigResult = await configsCollection.findOneAndUpdate(
    { _id: new ObjectId(`${data?.fields.configId}`) },
    {
      $set: {
        cities: {
          [DEFAULT_CITY]: {
            [DEFAULT_LOCALE]: [currentAsset.url],
          },
        },
      },
    },
    {
      upsert: true,
      returnOriginal: false,
    },
  );
  const updatedConfig = updatedConfigResult.value;
  if (!updatedConfigResult.ok || !updatedConfig) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'configs.updateAsset.error',
        locale: req.cookies.locale,
      }),
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'configs.updateAsset.success',
      locale: req.cookies.locale,
    }),
  });
};
