import { ObjectIdModel, ProductSummaryModel, ShopProductModel } from 'db/dbModels';
import { DEFAULT_COUNTERS_OBJECT } from 'lib/config/common';
import { noNaN } from 'lib/numbers';
import { ObjectId } from 'mongodb';

interface CastSummaryToShopProductInterface {
  summary: ProductSummaryModel;
  available?: number | null;
  price?: number | null;
  itemId: string;
  barcode: string[];
  shopId: ObjectIdModel;
  citySlug: string;
  companyId: ObjectIdModel;
  companySlug: string;
  shopProductUid?: string | null;
}

export function castSummaryToShopProduct({
  available,
  barcode,
  itemId,
  price,
  summary,
  citySlug,
  companyId,
  companySlug,
  shopId,
}: CastSummaryToShopProductInterface): ShopProductModel {
  return {
    _id: new ObjectId(),
    itemId,
    barcode,
    available: noNaN(available),
    price: noNaN(price),
    oldPrices: [],
    discountedPercent: 0,
    productId: summary._id,
    shopId,
    citySlug,
    companyId,
    companySlug,
    rubricId: summary.rubricId,
    rubricSlug: summary.rubricSlug,
    brandSlug: summary.brandSlug,
    mainImage: summary.mainImage,
    allowDelivery: summary.allowDelivery,
    brandCollectionSlug: summary.brandCollectionSlug,
    manufacturerSlug: summary.manufacturerSlug,
    filterSlugs: summary.filterSlugs,
    updatedAt: new Date(),
    createdAt: new Date(),
    ...DEFAULT_COUNTERS_OBJECT,
  };
}
