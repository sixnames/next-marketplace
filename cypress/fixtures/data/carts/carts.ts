import { CartModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const carts: CartModel[] = [
  {
    _id: getObjectId('defaultCart'),
    cartProducts: [],
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

// @ts-ignore
export = carts;
