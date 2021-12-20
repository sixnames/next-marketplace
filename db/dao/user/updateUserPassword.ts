import { hash } from 'bcryptjs';
import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_USERS } from '../../collectionNames';
import { UserModel, UserPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface UpdateUserPasswordInputInterface {
  _id: string;
  newPassword: string;
}

export async function updateUserPassword({
  context,
  input,
}: DaoPropsInterface<UpdateUserPasswordInputInterface>): Promise<UserPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const usersCollection = db.collection<UserModel>(COL_USERS);

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updateUserPassword',
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
        message: await getApiMessage('users.create.error'),
      };
    }

    // update
    const userId = new ObjectId(input._id);
    const password = await hash(input.newPassword, 10);
    const updatedUserResult = await usersCollection.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          password,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' },
    );
    const updatedUser = updatedUserResult.value;
    if (!updatedUserResult.ok || !updatedUser) {
      return {
        success: false,
        message: await getApiMessage('users.update.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('users.update.success'),
      payload: updatedUser,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
