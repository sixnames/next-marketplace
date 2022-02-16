import { COL_TASKS } from 'db/collectionNames';
import { TaskPayloadModel, TaskVariantModel, TranslationModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface, ProductSummaryInterface, UserInterface } from 'db/uiInterfaces';
import { TASK_STATE_PENDING } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextItemId } from 'lib/itemIdUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

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
    const collections = await getDbCollections();
    const tasksCollection = collections.tasksCollection();
    const taskVariantsCollection = collections.taskVariantsCollection();
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

    // get task variant
    const variantId = input.variantId ? new ObjectId(input.variantId) : undefined;
    let variant: TaskVariantModel | null = null;
    if (variantId) {
      variant = await taskVariantsCollection.findOne({
        _id: variantId,
      });
    }

    // create
    const itemId = await getNextItemId(COL_TASKS);
    const createdTaskResult = await tasksCollection.insertOne({
      itemId,
      nameI18n: input.nameI18n,
      companySlug: input.companySlug,
      stateEnum: TASK_STATE_PENDING,
      createdById: new ObjectId(user._id),
      variantId,
      variantSlug: variant?.slug,
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
