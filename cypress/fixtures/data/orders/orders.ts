import { OrderModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const carts: OrderModel[] = [
  {
    _id: getObjectId('defaultOrder'),
    itemId: '000001',
    companyIds: [],
    productIds: [],
    shopIds: [],
    shopProductIds: [],
    customerId: getObjectId('admin'),
    companySlug: 'default',
    comment: '',
    statusId: getObjectId(`orderStatus new`),
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

// @ts-ignore
export = carts;
