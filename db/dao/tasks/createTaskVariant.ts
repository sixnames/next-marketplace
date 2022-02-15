import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { createTaskVariantSchema } from 'validation/taskSchema';
import { COL_TASK_VARIANTS } from '../../collectionNames';
import { TaskVariantModel, TaskVariantPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface CreateTaskVariantInputInterface extends Omit<TaskVariantModel, '_id'> {}

export async function createTaskVariant({
  context,
  input,
}: DaoPropsInterface<CreateTaskVariantInputInterface>): Promise<TaskVariantPayloadModel> {
  try {
    const { db } = await getDatabase();
    const taskVariantsCollection = db.collection<TaskVariantModel>(COL_TASK_VARIANTS);
    const { getApiMessage } = await getRequestParams(context);

    // check permission
    const { allow, message } = await getOperationPermission({
      slug: 'createTaskVariant',
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
        message: await getApiMessage('taskVariants.create.error'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: createTaskVariantSchema,
    });
    await validationSchema.validate(input);

    // create
    const createdTaskVariantResult = await taskVariantsCollection.insertOne(input);
    const createdTaskVariant = await taskVariantsCollection.findOne({
      _id: createdTaskVariantResult.insertedId,
    });
    if (!createdTaskVariantResult.acknowledged || !createdTaskVariant) {
      return {
        success: false,
        message: await getApiMessage('taskVariants.create.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('taskVariants.create.success'),
      payload: createdTaskVariant,
    };
  } catch (e) {
    console.log('createTaskVariant', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
