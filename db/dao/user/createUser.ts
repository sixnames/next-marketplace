import { hash } from 'bcryptjs';
import { COL_USERS } from 'db/collectionNames';
import { UserModel, UserPayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import generator from 'generate-password';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getUserInitialNotificationsConf } from 'lib/getUserNotificationsTemplate';
import { getNextItemId } from 'lib/itemIdUtils';
import { phoneToRaw } from 'lib/phoneUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { createUserSchema } from 'validation/userSchema';

export interface CreateUserInputInterface {
  name: string;
  lastName?: string | null;
  secondName?: string | null;
  email: string;
  phone: string;
  roleId: string;
}

export async function createUser({
  context,
  input,
}: DaoPropsInterface<CreateUserInputInterface>): Promise<UserPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const usersCollection = db.collection<UserModel>(COL_USERS);

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'createUser',
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

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: createUserSchema,
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

    // create password
    const newPassword = generator.generate({
      length: 10,
      numbers: true,
    });
    const password = await hash(newPassword, 10);

    // create
    const itemId = await getNextItemId(COL_USERS);
    const createdUserResult = await usersCollection.insertOne({
      ...input,
      roleId: new ObjectId(input.roleId),
      phone: phoneToRaw(input.phone),
      itemId,
      password,
      notifications: getUserInitialNotificationsConf(),
      categoryIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (!createdUserResult.acknowledged) {
      return {
        success: false,
        message: await getApiMessage('users.create.error'),
      };
    }

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
