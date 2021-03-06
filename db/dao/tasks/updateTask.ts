import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { TaskPayloadModel, TaskStateModel } from '../../dbModels';
import { getDbCollections } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';
import { CreateTaskInputInterface } from './createTask';

export interface UpdateTaskInputInterface extends CreateTaskInputInterface {
  _id: string;
  stateEnum: TaskStateModel;
}

export async function updateTask({
  context,
  input,
}: DaoPropsInterface<UpdateTaskInputInterface>): Promise<TaskPayloadModel> {
  try {
    const collections = await getDbCollections();
    const tasksCollection = collections.tasksCollection();
    const { getApiMessage } = await getRequestParams(context);

    // check permission
    const { allow, message, user } = await getOperationPermission({
      slug: 'updateTask',
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
        message: await getApiMessage('tasks.update.error'),
      };
    }

    // update
    const createdTaskResult = await tasksCollection.findOneAndUpdate(
      {
        _id: new ObjectId(input._id),
      },
      {
        $set: {
          nameI18n: input.nameI18n,
          stateEnum: input.stateEnum,
          variantId: input.variantId ? new ObjectId(input.variantId) : undefined,
          executorId: input.executor ? new ObjectId(input.executor._id) : undefined,
          productId: input.product ? new ObjectId(input.product._id) : undefined,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: 'after',
      },
    );
    const createdTask = createdTaskResult.value;
    if (!createdTaskResult.ok || !createdTask) {
      return {
        success: false,
        message: await getApiMessage('tasks.update.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('tasks.update.success'),
      payload: createdTask,
    };
  } catch (e) {
    console.log('updateTask', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
