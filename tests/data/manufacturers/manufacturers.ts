import { ManufacturerModel } from 'db/dbModels';
import { DEFAULT_COUNTERS_OBJECT } from 'lib/config/common';
import { getObjectId } from 'mongo-seeding';

const manufacturers: ManufacturerModel[] = [
  {
    _id: getObjectId('manufacturer Manufacturer A'),
    itemId: '000001',
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
    nameI18n: {
      ru: 'Manufacturer B',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = manufacturers;
