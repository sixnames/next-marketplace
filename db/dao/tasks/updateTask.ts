import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_TASKS } from '../../collectionNames';
import { TaskModel, TaskPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';
import { CreateTaskInputInterface } from './createTask';

export interface UpdateTaskInputInterface extends CreateTaskInputInterface {
  _id: string;
}

export async function updateTask({
  context,
  input,
}: DaoPropsInterface<UpdateTaskInputInterface>): Promise<TaskPayloadModel> {
  try {
    const { db } = await getDatabase();
    const tasksCollection = db.collection<TaskModel>(COL_TASKS);
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
          executorId: input.executorId ? new ObjectId(input.executorId) : undefined,
          productId: input.productId ? new ObjectId(input.productId) : undefined,
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
