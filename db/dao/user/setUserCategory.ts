import { COL_USERS } from 'db/collectionNames';
import { UserModel, UserPayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface SetUserCategoryInputInterface {
  userId: string;
  categoryId: string;
}

export async function setUserCategory({
  context,
  input,
}: DaoPropsInterface<SetUserCategoryInputInterface>): Promise<UserPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const usersCollection = db.collection<UserModel>(COL_USERS);

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'setUserCategory',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('users.update.error'),
      };
    }

    // get user
    const userId = new ObjectId(input.userId);
    const categoryId = new ObjectId(input.categoryId);
    const user = await usersCollection.findOne({ _id: userId });
    if (!user) {
      return {
        success: false,
        message: await getApiMessage('users.update.error'),
      };
    }

    let categoryIds = user.categoryIds;
    const categoryExist = categoryIds.some((_id) => {
      return _id.equals(categoryId);
    });

    // unset category id
    if (categoryExist) {
      categoryIds = categoryIds.filter((_id) => {
        return !_id.equals(categoryId);
      });
    } else {
      categoryIds.push(categoryId);
    }

    // update
    const updatedUserResult = await usersCollection.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          categoryIds,
        },
      },
    );
    if (!updatedUserResult.ok) {
      return {
        success: false,
        message: await getApiMessage('users.update.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('users.update.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
