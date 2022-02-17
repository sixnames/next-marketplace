import { ProductFacetModel, ProductSummaryModel } from 'db/dbModels';

interface CastSummaryToFacetInterface {
  summary: ProductSummaryModel;
}

export function castSummaryToFacet({ summary }: CastSummaryToFacetInterface): ProductFacetModel {
  return {
    _id: summary._id,
    filterSlugs: summary.filterSlugs,
    attributeIds: summary.attributeIds,
    slug: summary.slug,
    active: summary.active,
    rubricId: summary.rubricId,
    rubricSlug: summary.rubricSlug,
    itemId: summary.itemId,
    allowDelivery: summary.allowDelivery,
    brandCollectionSlug: summary.brandCollectionSlug,
    brandSlug: summary.brandSlug,
    manufacturerSlug: summary.manufacturerSlug,
    barcode: summary.barcode,
    mainImage: summary.mainImage,
  };
}
