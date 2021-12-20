import { NotSyncedProductModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const carts: NotSyncedProductModel[] = [
  {
    _id: getObjectId('sync error a'),
    shopId: getObjectId('shop Shop B'),
    barcode: ['0987932498798wer9898ewr98wre9e8', '982498172348972489'],
    available: 99,
    price: 99,
    name: 'Error product',
    createdAt: new Date(),
  },
];

// @ts-ignore
export = carts;
