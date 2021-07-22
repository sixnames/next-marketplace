import { ASSETS_DIST_USERS } from 'config/common';
import { COL_USERS } from 'db/collectionNames';
import { UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getApiMessageValue } from 'lib/apiMessageUtils';
import { deleteUpload, storeRestApiUploads } from 'lib/assetUtils';
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
  // Permission
  const { allow, message } = await getOperationPermission({
    context: {
      req,
      res,
    },
    slug: 'updateUser',
  });
  if (!allow) {
    res.status(500).send({
      success: false,
      message: message,
    });
    return;
  }

  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const formData = await parseRestApiFormData(req);
  const { locale } = req.cookies;

  if (!formData || !formData.files || !formData.fields) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'companies.update.error',
        locale,
      }),
    });
    return;
  }

  const userId = new ObjectId(`${formData.fields.userId}`);

  // Check user availability
  const user = await usersCollection.findOne({ _id: userId });
  if (!user) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'users.update.error',
        locale,
      }),
    });
    return;
  }

  // Delete user logo
  if (user.avatar) {
    const removedAsset = await deleteUpload({ filePath: `${user.avatar.url}` });
    if (!removedAsset) {
      res.status(500).send({
        success: false,
        message: await getApiMessageValue({
          slug: 'users.update.error',
          locale,
        }),
      });
      return;
    }
  }

  // Upload new company logo
  const uploadedAvatar = await storeRestApiUploads({
    files: formData.files,
    itemId: user.itemId,
    dist: ASSETS_DIST_USERS,
    startIndex: 0,
  });
  if (!uploadedAvatar) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'users.update.error',
        locale,
      }),
    });
    return;
  }

  const avatar = uploadedAvatar[0];
  if (!avatar) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'users.update.error',
        locale,
      }),
    });
    return;
  }

  // Update company
  const updatedUserResult = await usersCollection.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        avatar,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: 'after',
    },
  );
  const updatedUser = updatedUserResult.value;
  if (!updatedUserResult.ok || !updatedUser) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'users.update.error',
        locale,
      }),
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'users.update.success',
      locale,
    }),
  });
};
