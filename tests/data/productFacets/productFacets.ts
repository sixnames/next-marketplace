import { ProductFacetModel } from 'db/dbModels';
import productSummaries from '../productSummaries/productSummaries';

const productFacets: ProductFacetModel[] = productSummaries.map((summary) => {
  const product: ProductFacetModel = {
    _id: summary._id,
    rubricId: summary.rubricId,
    rubricSlug: summary.rubricSlug,
    itemId: summary.itemId,
    barcode: summary.barcode,
    active: summary.active,
    allowDelivery: summary.allowDelivery,
    brandCollectionSlug: summary.brandCollectionSlug,
    brandSlug: summary.brandSlug,
    manufacturerSlug: summary.manufacturerSlug,
    attributeIds: summary.attributeIds,
    filterSlugs: summary.filterSlugs,
    slug: summary.slug,
    mainImage: summary.mainImage,
  };
  return product;
}, []);

// @ts-ignore
export = productFacets;
