import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_TASKS } from '../../collectionNames';
import { TaskModel, TaskPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface DeleteTaskInputInterface {
  _id: string;
}

export async function deleteTask({
  context,
  input,
}: DaoPropsInterface<DeleteTaskInputInterface>): Promise<TaskPayloadModel> {
  try {
    const { db } = await getDatabase();
    const tasksCollection = db.collection<TaskModel>(COL_TASKS);
    const { getApiMessage } = await getRequestParams(context);

    // check permission
    const { allow, message, user } = await getOperationPermission({
      slug: 'deleteTask',
      context,
    });
    if (!allow || !user) {
      return {
        success: false,
        message,
      };
    }

    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('tasks.delete.error'),
      };
    }

    // delete
    const createdTaskResult = await tasksCollection.findOneAndDelete({
      _id: new ObjectId(input._id),
    });
    if (!createdTaskResult.ok) {
      return {
        success: false,
        message: await getApiMessage('tasks.delete.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('tasks.delete.success'),
    };
  } catch (e) {
    console.log('deleteTask', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
