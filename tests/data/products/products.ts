import { ProductModel } from '../../../db/dbModels';
import productSummaries from '../productSummaries/productSummaries';

const products: ProductModel[] = productSummaries.map((productSummary) => {
  const product: ProductModel = {
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
    selectedOptionsSlugs: productSummary.selectedOptionsSlugs,
    slug: productSummary.slug,
  };
  return product;
}, []);

// @ts-ignore
export = products;
