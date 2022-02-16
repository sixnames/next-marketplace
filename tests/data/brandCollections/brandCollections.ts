import { BrandBaseModel, BrandCollectionModel } from 'db/dbModels';
import { DEFAULT_COUNTERS_OBJECT } from 'lib/config/common';
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
    brandSlug: `000001`,
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
    brandSlug: `000002`,
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
