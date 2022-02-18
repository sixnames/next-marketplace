import { EventPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG, VIEWS_COUNTER_STEP } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams, getSessionRole } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface UpdateEventCounterInputInterface {
  eventId: string;
  companySlug?: string | null;
  citySlug: string;
}

export async function updateEventCounter({
  input,
  context,
}: DaoPropsInterface<UpdateEventCounterInputInterface>): Promise<EventPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { role } = await getSessionRole(context);
    const collections = await getDbCollections();
    const eventFacetsCollection = collections.eventFacetsCollection();

    // check input
    if (!input) {
      return {
        success: false,
        message: 'no input',
      };
    }

    // get facet
    const facet = await eventFacetsCollection.findOne({
      _id: new ObjectId(input.eventId),
    });
    if (!facet) {
      return {
        success: false,
        message: await getApiMessage('events.update.notFound'),
      };
    }

    if (!role.isStaff && facet) {
      const companySlug = input.companySlug || DEFAULT_COMPANY_SLUG;
      const citySlug = input.citySlug;

      if (!facet.views) {
        await eventFacetsCollection.findOneAndUpdate(
          {
            _id: facet._id,
          },
          {
            $set: {
              views: {
                [companySlug]: {
                  [citySlug]: VIEWS_COUNTER_STEP,
                },
              },
            },
          },
        );
      } else {
        await eventFacetsCollection.findOneAndUpdate(
          {
            _id: facet._id,
          },
          {
            $inc: {
              [`views.${companySlug}.${citySlug}`]: VIEWS_COUNTER_STEP,
            },
          },
        );
      }

      return {
        success: true,
        message: 'success',
      };
    }
    return {
      success: true,
      message: 'success',
    };
  } catch (e) {
    console.log('updateEventCounter error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
