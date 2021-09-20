import { DEFAULT_COUNTERS_OBJECT } from '../../../../config/common';
import { BrandBaseModel, BrandCollectionModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const booleans: BrandBaseModel = {
  showAsBreadcrumb: true,
  showAsCatalogueBreadcrumb: true,
  showInCardTitle: true,
  showInSnippetTitle: true,
  showInCatalogueTitle: true,
};

const brandCollections: BrandCollectionModel[] = [
  {
    _id: getObjectId('brandCollection Brand collection A'),
    itemId: '000001',
    slug: 'brand_collection_a',
    brandSlug: `brand_a`,
    brandId: getObjectId('brand Brand A'),
    nameI18n: {
      ru: 'Brand collection A',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...booleans,
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('brandCollection Brand collection B'),
    itemId: '000002',
    slug: 'brand_collection_b',
    brandSlug: `brand_b`,
    brandId: getObjectId('brand Brand B'),
    nameI18n: {
      ru: 'Brand collection B',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...booleans,
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = brandCollections;
