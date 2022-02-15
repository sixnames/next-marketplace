import { COL_ATTRIBUTES_GROUPS, COL_EVENT_RUBRICS } from 'db/collectionNames';
import { AttributesGroupModel, EventRubricModel, EventRubricPayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeleteAttributesGroupFromEventRubricInputInterface {
  rubricId: string;
  attributesGroupId: string;
}

export async function deleteAttributesGroupFromEventRubric({
  context,
  input,
}: DaoPropsInterface<DeleteAttributesGroupFromEventRubricInputInterface>): Promise<EventRubricPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const rubricsCollection = db.collection<EventRubricModel>(COL_EVENT_RUBRICS);
  const attributesGroupsCollection = db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);

  const session = client.startSession();

  let mutationPayload: EventRubricPayloadModel = {
    success: false,
    message: await getApiMessage('rubrics.deleteAttributesGroup.error'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'updateEventRubric',
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
    console.log('deleteAttributesGroupFromEventRubric error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
