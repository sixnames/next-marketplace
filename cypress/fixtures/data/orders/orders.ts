import { OrderModel } from '../../../../db/dbModels';
import { getObjectId, getObjectIds } from 'mongo-seeding';

const orders: OrderModel[] = [
  {
    _id: getObjectId('order a'),
    itemId: '000001',
    companyId: getObjectId('company Company A'),
    shopId: getObjectId('shop Shop A'),
    shopItemId: '000001',
    productIds: getObjectIds(['e63c53ab5ffb0c3f1b225f6c', 'b977fadafdb3044026f6bf72']),
    shopProductIds: getObjectIds(['143070795e9854135e3c4c95', '8eadfafd99ea2aa02162005f']),
    customerId: getObjectId('admin'),
    companyItemId: '000001',
    companySiteSlug: 'default',
    comment: 'Order comment',
    statusId: getObjectId(`orderStatus new`),
    reservationDate: new Date(),
    updatedAt: new Date('2021-07-11T09:47:09.087Z'),
    createdAt: new Date('2021-07-11T09:47:09.087Z'),
  },
];

// @ts-ignore
export = orders;
