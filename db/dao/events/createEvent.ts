import { COL_EVENT_SUMMARIES } from 'db/collectionNames';
import {
  AddressModel,
  DateModel,
  EventPayloadModel,
  ObjectIdModel,
  TranslationModel,
} from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { IMAGE_FALLBACK } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextItemId } from 'lib/itemIdUtils';
import { trimTranslationField } from 'lib/productUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { createEventSchema } from 'validation/eventSchema';

export interface CreateEventInputInterface {
  _id: string;
  companySlug: string;
  companyId: ObjectIdModel;
  citySlug: string;
  rubricId: ObjectIdModel;
  startAt: DateModel;
  endAt?: DateModel | null;
  nameI18n?: TranslationModel | null;
  descriptionI18n?: TranslationModel | null;
  address: AddressModel;
  seatsCount: number;
  price?: number | null;
}

export async function createEvent({
  context,
  input,
}: DaoPropsInterface<CreateEventInputInterface>): Promise<EventPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const eventRubricsCollection = collections.eventRubricsCollection();
  const eventFacetsCollection = collections.eventFacetsCollection();
  const eventSummariesCollection = collections.eventSummariesCollection();

  const session = collections.client.startSession();

  let mutationPayload: EventPayloadModel = {
    success: false,
    message: await getApiMessage(`events.create.error`),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'createEvent',
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
          message: await getApiMessage('events.create.error'),
        };
        await session.abortTransaction();
        return;
      }

      // validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: createEventSchema,
      });
      await validationSchema.validate(input);

      // get rubric
      const rubricId = new ObjectId(input.rubricId);
      const rubric = await eventRubricsCollection.findOne({
        _id: rubricId,
      });
      if (!rubric) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('events.create.error'),
        };
        await session.abortTransaction();
        return;
      }

      // create summary
      const itemId = await getNextItemId(COL_EVENT_SUMMARIES);
      const eventId = new ObjectId();
      const nameI18n = trimTranslationField(input.nameI18n);
      const descriptionI18n = trimTranslationField(input.descriptionI18n);
      const createdEventSummaryResult = await eventSummariesCollection.insertOne({
        _id: eventId,
        itemId,
        slug: itemId,
        descriptionI18n,
        nameI18n,
        citySlug: input.citySlug,
        companyId: new ObjectId(input.companyId),
        companySlug: input.companySlug,
        mainImage: IMAGE_FALLBACK,
        filterSlugs: [],
        address: input.address,
        seatsAvailable: input.seatsCount,
        attributeIds: [],
        assets: [],
        videos: [],
        attributes: [],
        price: input.price,
        seatsCount: input.seatsCount,
        rubricId: rubric._id,
        rubricSlug: rubric.slug,
        startAt: new Date(input.startAt),
        endAt: input.endAt ? new Date(input.endAt) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const createdSummary = await eventSummariesCollection.findOne({
        _id: createdEventSummaryResult.insertedId,
      });
      if (!createdEventSummaryResult.acknowledged || !createdSummary) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('events.create.error'),
        };
        await session.abortTransaction();
        return;
      }

      // create facet
      const createdFacetResult = await eventFacetsCollection.insertOne({
        _id: createdSummary._id,
        slug: createdSummary.slug,
        itemId: createdSummary.itemId,
        filterSlugs: createdSummary.filterSlugs,
        attributeIds: createdSummary.attributeIds,
        companySlug: createdSummary.companySlug,
        companyId: createdSummary.companyId,
        citySlug: createdSummary.citySlug,
        rubricSlug: createdSummary.rubricSlug,
        rubricId: createdSummary.rubricId,
        price: createdSummary.price,
        endAt: createdSummary.endAt,
        startAt: createdSummary.startAt,
        views: {},
      });
      if (!createdFacetResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`events.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('events.create.success'),
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('createEvent error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
