import { TaskPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeleteTaskInputInterface {
  _id: string;
}

export async function deleteTask({
  context,
  input,
}: DaoPropsInterface<DeleteTaskInputInterface>): Promise<TaskPayloadModel> {
  try {
    const collections = await getDbCollections();
    const tasksCollection = collections.tasksCollection();
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
