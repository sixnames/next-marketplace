import { OrderModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const carts: OrderModel[] = [
  {
    _id: getObjectId('fakeOrder'),
    itemId: '000001',
    companyId: getObjectId('fake'),
    productIds: [],
    shopId: getObjectId('fake'),
    shopItemId: '',
    shopProductIds: [],
    customerId: getObjectId('fake'),
    companyItemId: '',
    companySiteSlug: 'fake',
    comment: '',
    statusId: getObjectId(`orderStatus new`),
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

// @ts-ignore
export = carts;
