import { castEventSummaryForUi } from 'db/cast/castEventSummaryForUi';
import { AttributeModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { EventSummaryInterface, SeoContentInterface } from 'db/uiInterfaces';
import { eventSummaryRubricPipeline, summaryAttributesPipeline } from 'db/utils/constantPipelines';
import { getEventSeoContent } from 'lib/seoContentUtils';
import { ObjectId } from 'mongodb';

interface GetFullEventSummaryInterface {
  eventId: string;
  locale: string;
}

export interface GetFullEventSummaryPayloadInterface {
  summary: EventSummaryInterface;
  cardContent: SeoContentInterface | null;
}

export async function getEventFullSummary({
  eventId,
  locale,
}: GetFullEventSummaryInterface): Promise<GetFullEventSummaryPayloadInterface | null> {
  const collections = await getDbCollections();
  const eventSummariesCollection = collections.eventSummariesCollection();

  const summaryAggregationResult = await eventSummariesCollection
    .aggregate<EventSummaryInterface>([
      {
        $match: {
          _id: new ObjectId(eventId),
        },
      },

      // get rubric
      ...eventSummaryRubricPipeline,

      // get attributes
      ...summaryAttributesPipeline(),
    ])
    .toArray();
  const summary = summaryAggregationResult[0];
  if (!summary) {
    return null;
  }

  const attributes = summary.attributes.reduce((acc: AttributeModel[], productAttribute) => {
    const { attribute } = productAttribute;
    if (attribute) {
      return [...acc, attribute];
    }
    return acc;
  }, []);

  // card content
  const cardContent = await getEventSeoContent({
    eventSlug: summary.slug,
    eventId: summary._id,
    rubricSlug: summary.rubricSlug,
    companySlug: summary.companySlug,
    locale,
  });
  if (!cardContent) {
    return null;
  }

  const castedSummary = castEventSummaryForUi({
    summary,
    attributes,
    locale,
  });

  return {
    summary: castedSummary,
    cardContent,
  };
}
