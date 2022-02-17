import { CreateEventInputInterface } from 'db/dao/events/createEvent';
import { EventPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { trimTranslationField } from 'lib/i18n';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { updateEventSchema } from 'validation/eventSchema';

export interface UpdateEventInputInterface extends CreateEventInputInterface {
  _id: string;
  videos?: string[];
}

export async function updateEvent({
  context,
  input,
}: DaoPropsInterface<UpdateEventInputInterface>): Promise<EventPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const eventFacetsCollection = collections.eventFacetsCollection();
  const eventSummariesCollection = collections.eventSummariesCollection();

  const session = collections.client.startSession();

  let mutationPayload: EventPayloadModel = {
    success: false,
    message: await getApiMessage(`events.update.error`),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'updateEvent',
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
          message: await getApiMessage('events.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      // validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: updateEventSchema,
      });
      await validationSchema.validate(input);

      // update summary
      const { _id, ...values } = input;
      const eventId = new ObjectId(_id);
      const nameI18n = trimTranslationField(values.nameI18n);
      const descriptionI18n = trimTranslationField(values.descriptionI18n);
      const updatedSummaryResult = await eventSummariesCollection.findOneAndUpdate(
        {
          _id: eventId,
        },
        {
          $set: {
            descriptionI18n,
            nameI18n,
            citySlug: values.citySlug,
            address: values.address,
            seatsAvailable: values.seatsCount,
            price: values.price,
            seatsCount: values.seatsCount,
            startAt: new Date(values.startAt),
            endAt: values.endAt ? new Date(values.endAt) : null,
            updatedAt: new Date(),
          },
        },
        {
          returnDocument: 'after',
        },
      );
      const updatedSummary = updatedSummaryResult.value;
      if (!updatedSummaryResult.ok || !updatedSummary) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('events.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      // update facet
      const updatedFacetResult = await eventFacetsCollection.findOneAndUpdate(
        {
          _id: updatedSummary._id,
        },
        {
          $set: {
            price: updatedSummary.price,
            citySlug: updatedSummary.citySlug,
            endAt: updatedSummary.endAt,
            startAt: updatedSummary.startAt,
          },
        },
      );
      if (!updatedFacetResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`events.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('events.update.success'),
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('updateEvent error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
