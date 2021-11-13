import { hash } from 'bcryptjs';
import { ROLE_SLUG_GUEST } from 'config/common';
import { COL_ROLES, COL_USERS } from 'db/collectionNames';
import { RoleModel, UserModel, UserPayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { sendSignUpEmail } from 'lib/email/sendSignUpEmail';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getUserInitialNotificationsConf } from 'lib/getUserNotificationsTemplate';
import { getNextItemId } from 'lib/itemIdUtils';
import { phoneToRaw } from 'lib/phoneUtils';
import { getRequestParams, getResolverValidationSchema } from 'lib/sessionHelpers';
import { signUpSchema } from 'validation/userSchema';

export interface SignUpInputInterface {
  name: string;
  lastName?: string | null;
  secondName?: string | null;
  email: string;
  phone: string;
  password: string;
}

export async function signUp({
  context,
  input,
}: DaoPropsInterface<SignUpInputInterface>): Promise<UserPayloadModel> {
  try {
    const { getApiMessage, city, companySlug, locale } = await getRequestParams(context);
    const { db } = await getDatabase();
    const usersCollection = db.collection<UserModel>(COL_USERS);
    const rolesCollection = db.collection<RoleModel>(COL_ROLES);

    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('users.create.error'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: signUpSchema,
    });
    await validationSchema.validate(input);

    // check if already exist
    const exist = await usersCollection.findOne({
      $or: [{ email: input.email }, { phone: input.phone }],
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('users.create.duplicate'),
      };
    }

    // create password for user
    const password = await hash(input.password, 10);
    const guestRole = await rolesCollection.findOne({ slug: ROLE_SLUG_GUEST });
    if (!guestRole) {
      return {
        success: false,
        message: await getApiMessage('users.create.error'),
      };
    }

    // create
    const itemId = await getNextItemId(COL_USERS);
    const createdUserResult = await usersCollection.insertOne({
      ...input,
      phone: phoneToRaw(input.phone),
      itemId,
      password,
      roleId: guestRole._id,
      notifications: getUserInitialNotificationsConf(),
      categoryIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const createdUser = await usersCollection.findOne({
      _id: createdUserResult.insertedId,
    });
    if (!createdUserResult.acknowledged || !createdUser) {
      return {
        success: false,
        message: await getApiMessage('users.create.error'),
      };
    }

    // send user creation email confirmation
    await sendSignUpEmail({
      to: createdUser.email,
      userName: createdUser.name,
      password: input.password,
      companySiteSlug: companySlug,
      citySlug: city,
      locale,
    });

    return {
      success: true,
      message: await getApiMessage('users.create.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
