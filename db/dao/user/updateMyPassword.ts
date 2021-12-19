import { compare, hash } from 'bcryptjs';
import { sendPasswordUpdatedEmail } from '../../../lib/email/sendPasswordUpdatedEmail';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import {
  getRequestParams,
  getResolverValidationSchema,
  getSessionUser,
} from '../../../lib/sessionHelpers';
import { updateMyPasswordSchema } from '../../../validation/userSchema';
import { COL_USERS } from '../../collectionNames';
import { UserModel, UserPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface UpdateMyPasswordInputInterface {
  oldPassword: string;
  newPassword: string;
  newPasswordB: string;
}

export async function updateMyPassword({
  context,
  input,
}: DaoPropsInterface<UpdateMyPasswordInputInterface>): Promise<UserPayloadModel> {
  try {
    const { getApiMessage, companySlug, city, locale } = await getRequestParams(context);
    const sessionUser = await getSessionUser(context);
    const { db } = await getDatabase();
    const usersCollection = db.collection<UserModel>(COL_USERS);

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
      schema: updateMyPasswordSchema,
    });
    await validationSchema.validate(input);

    // check if user is authorised
    if (!sessionUser) {
      return {
        success: false,
        message: await getApiMessage('users.update.error'),
      };
    }

    // check if old password matches
    const { oldPassword, newPassword } = input;
    const matches = await compare(oldPassword, sessionUser.password);
    if (!matches) {
      return {
        success: false,
        message: await getApiMessage(`users.update.error`),
      };
    }

    // update user
    const password = await hash(newPassword, 10);
    const updatedUserResult = await usersCollection.findOneAndUpdate(
      { _id: sessionUser._id },
      {
        $set: {
          password,
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

    // Send email confirmation
    await sendPasswordUpdatedEmail({
      to: updatedUser.email,
      userName: updatedUser.name,
      companySiteSlug: companySlug,
      citySlug: city,
      locale,
    });

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
