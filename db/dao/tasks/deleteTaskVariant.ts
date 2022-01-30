import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_TASK_VARIANTS } from '../../collectionNames';
import { TaskVariantModel, TaskVariantPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface DeleteTaskVariantInputInterface {
  _id: string;
}

export async function deleteTaskVariant({
  context,
  input,
}: DaoPropsInterface<DeleteTaskVariantInputInterface>): Promise<TaskVariantPayloadModel> {
  try {
    const { db } = await getDatabase();
    const taskVariantsCollection = db.collection<TaskVariantModel>(COL_TASK_VARIANTS);
    const { getApiMessage } = await getRequestParams(context);

    // check permission
    const { allow, message } = await getOperationPermission({
      slug: 'deleteTaskVariant',
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
        message: await getApiMessage('taskVariants.delete.error'),
      };
    }

    // delete
    const deletedTaskVariantResult = await taskVariantsCollection.findOneAndDelete({
      _id: new ObjectId(input._id),
    });
    if (!deletedTaskVariantResult.ok) {
      return {
        success: false,
        message: await getApiMessage('taskVariants.delete.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('taskVariants.delete.success'),
    };
  } catch (e) {
    console.log('createTaskVariant', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
