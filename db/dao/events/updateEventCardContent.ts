import { getDbCollections } from 'db/mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { updateCitiesSeoContent } from 'lib/seoContentUniquenessUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { EventPayloadModel } from 'db/dbModels';
import { DaoPropsInterface, SeoContentInterface } from 'db/uiInterfaces';
import { ObjectId } from 'mongodb';

export interface UpdateEventCardContentInputInterface {
  taskId?: string | null;
  seoContent: SeoContentInterface;
  companySlug: string;
  eventId: string;
}

export async function updateEventCardContent({
  context,
  input,
}: DaoPropsInterface<UpdateEventCardContentInputInterface>): Promise<EventPayloadModel> {
  try {
    const collections = await getDbCollections();
    const eventSummariesCollection = collections.eventSummariesCollection();
    const { getApiMessage } = await getRequestParams(context);
    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('events.update.error'),
      };
    }

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updateEventSeoContent',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    // get summary
    const summary = await eventSummariesCollection.findOne({
      _id: new ObjectId(input.eventId),
    });
    if (!summary) {
      return {
        success: false,
        message: await getApiMessage('events.update.error'),
      };
    }

    const { seoContent } = input;

    await updateCitiesSeoContent({
      seoContentsList: {
        [summary.citySlug]: seoContent,
      },
      companySlug: summary.companySlug,
    });

    return {
      success: true,
      message: await getApiMessage('events.update.success'),
    };
  } catch (e) {
    console.log('updateEventCardContent error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
