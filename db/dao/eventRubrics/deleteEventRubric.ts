import { EventRubricPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeleteEventRubricInputInterface {
  _id: string;
}

export async function deleteEventRubric({
  context,
  input,
}: DaoPropsInterface<DeleteEventRubricInputInterface>): Promise<EventRubricPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const rubricsCollection = collections.eventRubricsCollection();
  const eventsCollection = collections.eventSummariesCollection();
  const eventFacetsCollection = collections.eventFacetsCollection();
  const session = collections.client.startSession();

  let mutationPayload: EventRubricPayloadModel = {
    success: false,
    message: await getApiMessage('rubrics.delete.error'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'deleteRubric',
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
          message: await getApiMessage('rubrics.delete.error'),
        };
        await session.abortTransaction();
        return;
      }

      // get rubric
      const rubricId = new ObjectId(input._id);
      const rubric = await rubricsCollection.findOne({ _id: rubricId });
      if (!rubric) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('rubrics.delete.notFound'),
        };
        await session.abortTransaction();
        return;
      }

      // delete rubric events
      const removedEventsResult = await eventsCollection.deleteMany({
        rubricId,
      });
      const removedEventFacetsResult = await eventFacetsCollection.deleteMany({
        rubricId,
      });
      if (!removedEventsResult.acknowledged || !removedEventFacetsResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('rubrics.deleteProduct.error'),
        };
        await session.abortTransaction();
        return;
      }

      // delete rubric
      const removedRubricsResult = await rubricsCollection.deleteOne({
        _id: rubricId,
      });
      if (!removedRubricsResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('rubrics.delete.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('rubrics.delete.success'),
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('deleteEventRubric error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
