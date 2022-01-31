import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../../../lib/sessionHelpers';
import { updateTaskVariantSchema } from '../../../validation/taskVariantSchema';
import { COL_TASK_VARIANTS } from '../../collectionNames';
import { TaskVariantModel, TaskVariantPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';
import { CreateTaskVariantInputInterface } from './createTaskVariant';

export interface UpdateTaskVariantInputInterface extends CreateTaskVariantInputInterface {
  _id: string;
}

export async function updateTaskVariant({
  context,
  input,
}: DaoPropsInterface<UpdateTaskVariantInputInterface>): Promise<TaskVariantPayloadModel> {
  try {
    const { db } = await getDatabase();
    const taskVariantsCollection = db.collection<TaskVariantModel>(COL_TASK_VARIANTS);
    const { getApiMessage } = await getRequestParams(context);

    // check permission
    const { allow, message } = await getOperationPermission({
      slug: 'updateTaskVariant',
      context,
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
        message: await getApiMessage('taskVariants.update.error'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: updateTaskVariantSchema,
    });
    await validationSchema.validate(input);

    // update
    const { _id, ...values } = input;
    const updatedTaskVariantResult = await taskVariantsCollection.findOneAndUpdate(
      {
        _id: new ObjectId(_id),
      },
      {
        $set: {
          ...values,
        },
      },
      {
        returnDocument: 'after',
      },
    );
    const updatedTaskVariant = updatedTaskVariantResult.value;
    if (!updatedTaskVariantResult.ok || !updatedTaskVariant) {
      return {
        success: false,
        message: await getApiMessage('taskVariants.update.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('taskVariants.update.success'),
      payload: updatedTaskVariant,
    };
  } catch (e) {
    console.log('createTaskVariant', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
