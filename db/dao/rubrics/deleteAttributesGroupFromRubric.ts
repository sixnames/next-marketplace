import { RubricPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeleteAttributesGroupFromRubricInputInterface {
  rubricId: string;
  attributesGroupId: string;
}

export async function deleteAttributesGroupFromRubric({
  context,
  input,
}: DaoPropsInterface<DeleteAttributesGroupFromRubricInputInterface>): Promise<RubricPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const rubricsCollection = collections.rubricsCollection();
  const attributesGroupsCollection = collections.attributesGroupsCollection();

  const session = collections.client.startSession();

  let mutationPayload: RubricPayloadModel = {
    success: false,
    message: await getApiMessage('rubrics.deleteAttributesGroup.error'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'updateRubric',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      // check input
      if (!input) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('rubrics.deleteAttributesGroup.error'),
        };
        await session.abortTransaction();
        return;
      }

      // get rubric and attributes group
      const attributesGroupId = new ObjectId(input.attributesGroupId);
      const rubricId = new ObjectId(input.rubricId);
      const attributesGroup = await attributesGroupsCollection.findOne({
        _id: attributesGroupId,
      });
      const rubric = await rubricsCollection.findOne({ _id: rubricId });
      if (!rubric || !attributesGroup) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('rubrics.deleteAttributesGroup.notFound'),
        };
        await session.abortTransaction();
        return;
      }

      // update rubric
      const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
        { _id: rubricId },
        {
          $pull: {
            attributesGroupIds: attributesGroup._id,
          },
        },
      );
      const updatedRubric = updatedRubricResult.value;
      if (!updatedRubricResult.ok || !updatedRubric) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('rubrics.deleteAttributesGroup.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('rubrics.deleteAttributesGroup.success'),
        payload: updatedRubric,
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('deleteAttributesGroupFromRubric error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
