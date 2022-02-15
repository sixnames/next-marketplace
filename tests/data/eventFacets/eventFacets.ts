import { EventFacetModel } from 'db/dbModels';
import eventSummaries from '../eventSummaries/eventSummaries';

const eventFacets: EventFacetModel[] = eventSummaries.map((summary) => {
  const product: EventFacetModel = {
    _id: summary._id,
    rubricId: summary.rubricId,
    rubricSlug: summary.rubricSlug,
    itemId: summary.itemId,
    attributeIds: summary.attributeIds,
    filterSlugs: summary.filterSlugs,
    slug: summary.slug,
    companySlug: summary.companySlug,
    companyId: summary.companyId,
    citySlug: summary.citySlug,
    endAt: summary.endAt,
    startAt: summary.startAt,
  };
  return product;
}, []);

// @ts-ignore
export = eventFacets;
