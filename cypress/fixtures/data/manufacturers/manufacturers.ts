import { DEFAULT_COUNTERS_OBJECT } from '../../../../config/common';
import { ManufacturerModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const cities: ManufacturerModel[] = [
  {
    _id: getObjectId('manufacturer Manufacturer A'),
    itemId: '000001',
    slug: 'manufacturer_a',
    nameI18n: {
      ru: 'Manufacturer A',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('manufacturer Manufacturer B'),
    itemId: '000002',
    slug: 'manufacturer_b',
    nameI18n: {
      ru: 'Manufacturer B',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

export = cities;
