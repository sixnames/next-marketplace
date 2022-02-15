import { EventPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeleteEventInputInterface {
  _id: string;
}

export async function deleteEvent({
  context,
  input,
}: DaoPropsInterface<DeleteEventInputInterface>): Promise<EventPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const eventFacetsCollection = collections.eventFacetsCollection();
  const eventSummariesCollection = collections.eventSummariesCollection();

  const session = collections.client.startSession();

  let mutationPayload: EventPayloadModel = {
    success: false,
    message: await getApiMessage(`events.delete.error`),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'deleteEvent',
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
          message: await getApiMessage('events.delete.error'),
        };
        await session.abortTransaction();
        return;
      }

      // delete
      const eventId = new ObjectId(input._id);
      const removedSummaryResult = await eventSummariesCollection.findOneAndDelete({
        _id: eventId,
      });
      const removedFacetResult = await eventFacetsCollection.findOneAndDelete({
        _id: eventId,
      });
      if (!removedSummaryResult.ok || !removedFacetResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('events.delete.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('events.delete.success'),
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('deleteEvent error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
