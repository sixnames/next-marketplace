import { ProductFacetModel } from '../../../db/dbModels';
import productSummaries from '../productSummaries/productSummaries';

const productFacets: ProductFacetModel[] = productSummaries.map((productSummary) => {
  const product: ProductFacetModel = {
    _id: productSummary._id,
    categorySlugs: productSummary.categorySlugs,
    rubricId: productSummary.rubricId,
    rubricSlug: productSummary.rubricSlug,
    itemId: productSummary.itemId,
    barcode: productSummary.barcode,
    active: productSummary.active,
    allowDelivery: productSummary.allowDelivery,
    brandCollectionSlug: productSummary.brandCollectionSlug,
    brandSlug: productSummary.brandSlug,
    manufacturerSlug: productSummary.manufacturerSlug,
    selectedAttributesIds: productSummary.selectedAttributesIds,
    filterSlugs: productSummary.filterSlugs,
    slug: productSummary.slug,
  };
  return product;
}, []);

// @ts-ignore
export = productFacets;
