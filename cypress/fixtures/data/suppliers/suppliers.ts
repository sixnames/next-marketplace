import { DEFAULT_COUNTERS_OBJECT } from '../../../../config/common';
import { SupplierModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const suppliers: SupplierModel[] = [
  {
    _id: getObjectId('supplier Supplier A'),
    itemId: '000001',
    nameI18n: {
      ru: 'Supplier A',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('supplier Supplier B'),
    itemId: '000002',
    nameI18n: {
      ru: 'Supplier B',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = suppliers;
