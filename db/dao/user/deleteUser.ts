import { COL_USERS } from 'db/collectionNames';
import { UserModel, UserPayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeleteUserInputInterface {
  _id: string;
}

export async function deleteUser({
  context,
  input,
}: DaoPropsInterface<DeleteUserInputInterface>): Promise<UserPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const usersCollection = db.collection<UserModel>(COL_USERS);

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'deleteUser',
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
        message: await getApiMessage('users.delete.error'),
      };
    }

    const _id = new ObjectId(input._id);

    // check availability
    const user = await usersCollection.findOne({ _id });
    if (!user) {
      return {
        success: false,
        message: await getApiMessage('users.delete.error'),
      };
    }

    // TODO check user companies and shops

    // delete
    const removedUserResult = await usersCollection.findOneAndDelete({ _id });
    if (!removedUserResult.ok) {
      return {
        success: false,
        message: await getApiMessage('users.delete.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('users.delete.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
