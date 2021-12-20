import { CartModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const carts: CartModel[] = [
  {
    _id: getObjectId('defaultCart'),
    cartBookingProducts: [],
    cartDeliveryProducts: [],
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

// @ts-ignore
export = carts;
