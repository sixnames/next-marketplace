import { CartModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const cities: CartModel[] = [
  {
    _id: getObjectId('defaultCart'),
    cartProducts: [],
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

export = cities;
