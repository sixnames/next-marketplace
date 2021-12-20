import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { phoneToRaw } from '../../../lib/phoneUtils';
import { getRequestParams, getSessionUser } from '../../../lib/sessionHelpers';
import { COL_USERS } from '../../collectionNames';
import { UserModel, UserPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface UpdateMyProfileInputInterface {
  name: string;
  lastName?: string | null;
  secondName?: string | null;
  email: string;
  phone: string;
}

export async function updateMyProfile({
  context,
  input,
}: DaoPropsInterface<UpdateMyProfileInputInterface>): Promise<UserPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const sessionUser = await getSessionUser(context);
    const { db } = await getDatabase();
    const usersCollection = db.collection<UserModel>(COL_USERS);

    // check if user is authenticated
    if (!sessionUser) {
      return {
        success: false,
        message: await getApiMessage('users.update.error'),
      };
    }

    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('users.update.error'),
      };
    }

    // check if user already exist
    const exist = await usersCollection.findOne({
      _id: { $ne: sessionUser._id },
      $or: [{ email: input.email }, { phone: input.phone }],
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('users.update.duplicate'),
      };
    }

    // update
    const updatedUserResult = await usersCollection.findOneAndUpdate(
      { _id: sessionUser._id },
      {
        $set: {
          ...input,
          phone: phoneToRaw(input.phone),
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
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
