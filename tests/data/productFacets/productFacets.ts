import { ProductFacetModel } from '../../../db/dbModels';
import productSummaries from '../productSummaries/productSummaries';

const productFacets: ProductFacetModel[] = productSummaries.map((productSummary) => {
  const product: ProductFacetModel = {
    _id: productSummary._id,
    rubricId: productSummary.rubricId,
    rubricSlug: productSummary.rubricSlug,
    itemId: productSummary.itemId,
    barcode: productSummary.barcode,
    active: productSummary.active,
    allowDelivery: productSummary.allowDelivery,
    brandCollectionSlug: productSummary.brandCollectionSlug,
    brandSlug: productSummary.brandSlug,
    manufacturerSlug: productSummary.manufacturerSlug,
    attributeIds: productSummary.attributeIds,
    filterSlugs: productSummary.filterSlugs,
    slug: productSummary.slug,
    mainImage: productSummary.mainImage,
  };
  return product;
}, []);

// @ts-ignore
export = productFacets;
