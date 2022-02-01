import { ObjectId } from 'mongodb';
import { TASK_STATE_PENDING } from '../../../config/common';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_TASKS } from '../../collectionNames';
import { TaskModel, TaskPayloadModel, TranslationModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface, ProductSummaryInterface, UserInterface } from '../../uiInterfaces';

export interface CreateTaskInputInterface {
  companySlug: string;
  nameI18n?: TranslationModel | null;
  variantId?: string | null;
  executor?: UserInterface | null;
  product?: ProductSummaryInterface | null;
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
      stateEnum: TASK_STATE_PENDING,
      createdById: new ObjectId(user._id),
      variantId: input.variantId ? new ObjectId(input.variantId) : undefined,
      executorId: input.executor ? new ObjectId(input.executor._id) : undefined,
      productId: input.product ? new ObjectId(input.product._id) : undefined,
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
