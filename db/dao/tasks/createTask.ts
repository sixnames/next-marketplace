import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_TASKS } from '../../collectionNames';
import { TaskModel, TaskPayloadModel, TaskStateModel, TranslationModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface CreateTaskInputInterface {
  companySlug: string;
  stateEnum: TaskStateModel;
  nameI18n?: TranslationModel | null;
  variantId?: string | null;
  executorId?: string | null;
  productId?: string | null;
}

export async function createTask({
  context,
  input,
}: DaoPropsInterface<CreateTaskInputInterface>): Promise<TaskPayloadModel> {
  try {
    const { db } = await getDatabase();
    const tasksCollection = db.collection<TaskModel>(COL_TASKS);
    const { getApiMessage } = await getRequestParams(context);

    // check permission
    const { allow, message, user } = await getOperationPermission({
      slug: 'createTask',
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
        message: await getApiMessage('tasks.create.error'),
      };
    }

    // create
    const createdTaskResult = await tasksCollection.insertOne({
      nameI18n: input.nameI18n,
      companySlug: input.companySlug,
      stateEnum: input.stateEnum,
      createdById: user._id,
      variantId: input.variantId ? new ObjectId(input.variantId) : undefined,
      executorId: input.executorId ? new ObjectId(input.executorId) : undefined,
      productId: input.productId ? new ObjectId(input.productId) : undefined,
      log: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const createdTask = await tasksCollection.findOne({
      _id: createdTaskResult.insertedId,
    });
    if (!createdTaskResult.acknowledged || !createdTask) {
      return {
        success: false,
        message: await getApiMessage('tasks.create.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('tasks.create.success'),
      payload: createdTask,
    };
  } catch (e) {
    console.log('createTask', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
