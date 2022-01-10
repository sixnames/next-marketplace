import { BlackListProductModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const blackListProducts: BlackListProductModel[] = [
  {
    _id: getObjectId('blacklist product 1'),
    shopId: getObjectId('shop Shop A'),
    shopProductUid: '1',
    products: [
      {
        available: 10,
        price: 999,
        name: 'blacklist product 1',
        barcode: ['000001'],
      },
      {
        available: 1,
        price: 1999,
        name: 'blacklist product 1',
        barcode: ['0000019999'],
      },
    ],
  },
];

// @ts-ignore
export = blackListProducts;
