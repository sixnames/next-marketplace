import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { phoneToRaw } from '../../../lib/phoneUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../../../lib/sessionHelpers';
import { updateUserSchema } from '../../../validation/userSchema';
import { COL_USERS } from '../../collectionNames';
import { UserModel, UserNotificationsModel, UserPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface UpdateUserInputInterface {
  _id: string;
  name: string;
  lastName?: string | null;
  secondName?: string | null;
  email: string;
  phone: string;
  roleId: string;
  notifications: UserNotificationsModel;
}

export async function updateUser({
  context,
  input,
}: DaoPropsInterface<UpdateUserInputInterface>): Promise<UserPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const usersCollection = db.collection<UserModel>(COL_USERS);

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updateUser',
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

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: updateUserSchema,
    });
    await validationSchema.validate(input);

    const { _id, ...values } = input;
    const userId = new ObjectId(_id);

    // check if already exist
    const exist = await usersCollection.findOne({
      _id: { $ne: userId },
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
      { _id: userId },
      {
        $set: {
          ...values,
          roleId: new ObjectId(values.roleId),
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
