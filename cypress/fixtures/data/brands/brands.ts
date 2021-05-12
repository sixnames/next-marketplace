import { DEFAULT_COUNTERS_OBJECT } from '../../../../config/common';
import { BrandModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const brands: BrandModel[] = [
  {
    _id: getObjectId('brand Brand A'),
    itemId: '000001',
    slug: 'brand_a',
    nameI18n: {
      ru: 'Brand A',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('brand Brand B'),
    itemId: '000002',
    slug: 'brand_b',
    nameI18n: {
      ru: 'Brand B',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = brands;
