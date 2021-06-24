import { NotSyncedProductModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const carts: NotSyncedProductModel[] = [
  {
    _id: getObjectId('fakeOrder'),
    shopId: getObjectId('fake'),
    barcode: '0',
    available: 0,
    price: 0,
    name: '',
    createdAt: new Date(),
  },
];

// @ts-ignore
export = carts;
