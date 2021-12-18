import { DEFAULT_COUNTERS_OBJECT, ASSETS_DIST_BRANDS } from '../../../config/common';
import { BrandBaseModel, BrandModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const booleans: BrandBaseModel = {
  showAsBreadcrumb: true,
  showAsCatalogueBreadcrumb: true,
  showInCardTitle: true,
  showInSnippetTitle: true,
  showInCatalogueTitle: true,
};

const brands: BrandModel[] = [
  {
    _id: getObjectId('brand Brand A'),
    itemId: '000001',
    logo: `/assets/${ASSETS_DIST_BRANDS}/000001/000001.png`,
    nameI18n: {
      ru: 'Brand A',
    },
    url: ['https://brandA.com'],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...booleans,
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('brand Brand B'),
    itemId: '000002',
    logo: `/assets/${ASSETS_DIST_BRANDS}/000002/000002.png`,
    nameI18n: {
      ru: 'Brand B',
    },
    url: ['https://brandB.com'],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...booleans,
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = brands;
