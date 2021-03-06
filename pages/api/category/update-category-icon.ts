import { COL_CATEGORIES } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { getApiMessageValue } from 'db/utils/apiMessageUtils';
import fs from 'fs';
import { alwaysArray } from 'lib/arrayUtils';
import { REQUEST_METHOD_DELETE } from 'lib/config/common';
import { parseRestApiFormData } from 'lib/restApi';
import { getOperationPermission } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { optimize } from 'svgo';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const collections = await getDbCollections();
  const iconsCollection = collections.iconsCollection();
  const categoriesCollection = collections.categoriesCollection();
  const formData = await parseRestApiFormData(req);
  const { locale } = req.cookies;

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

  // delete icon
  if (req.method === REQUEST_METHOD_DELETE) {
    if (!formData || !formData.fields || !formData.fields.categoryId) {
      res.status(500).send({
        success: false,
        message: await getApiMessageValue({
          slug: 'categories.update.error',
          locale,
        }),
      });
      return;
    }

    const removedIconResult = await iconsCollection.findOneAndDelete({
      documentId: new ObjectId(`${formData.fields.categoryId}`),
      collectionName: COL_CATEGORIES,
    });
    if (!removedIconResult.ok) {
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

  // update icon
  if (!formData || !formData.files || !formData.fields || !formData.fields.categoryId) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'categories.update.error',
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
        slug: 'categories.update.error',
        locale,
      }),
    });
    return;
  }

  const path = file.path;
  const buffer = fs.readFileSync(path);

  const icon = buffer.toString();
  const optimizedIcon = await optimize(icon, {
    plugins: [
      'removeDimensions',
      'cleanupIDs',
      {
        name: 'prefixIds',
        // @ts-ignore
        params: {
          prefix: () => {
            const date = new Date().getTime();
            return `ico-${date}`;
          },
        },
      },
    ],
  });
  const categoryId = new ObjectId(`${formData.fields.categoryId}`);

  const category = await categoriesCollection.findOne({
    _id: categoryId,
  });
  if (!category || !optimizedIcon || optimizedIcon.error) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'categories.update.error',
        locale,
      }),
    });
    return;
  }

  const trulyOptimizedIcon = optimizedIcon as unknown as any;
  const createdIconResult = await iconsCollection.findOneAndUpdate(
    {
      documentId: categoryId,
      collectionName: COL_CATEGORIES,
    },
    {
      $set: {
        documentId: categoryId,
        collectionName: COL_CATEGORIES,
        icon: trulyOptimizedIcon.data,
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
