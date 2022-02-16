import { TaskVariantModel, TaskVariantPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { createTaskVariantSchema } from 'validation/taskSchema';

export interface CreateTaskVariantInputInterface extends Omit<TaskVariantModel, '_id'> {}

export async function createTaskVariant({
  context,
  input,
}: DaoPropsInterface<CreateTaskVariantInputInterface>): Promise<TaskVariantPayloadModel> {
  try {
    const collections = await getDbCollections();
    const taskVariantsCollection = collections.taskVariantsCollection();
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
