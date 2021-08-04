import { DEFAULT_COUNTERS_OBJECT, ASSETS_DIST_BRANDS } from '../../../../config/common';
import { BrandModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const brands: BrandModel[] = [
  {
    _id: getObjectId('brand Brand A'),
    itemId: '000001',
    slug: 'brand_a',
    logo: `https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_BRANDS}/000001/000001.png`,
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
    logo: `https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_BRANDS}/000002/000002.png`,
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
