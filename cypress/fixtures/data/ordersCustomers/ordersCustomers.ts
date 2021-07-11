import { OrderCustomerModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const orderCustomers: OrderCustomerModel[] = [
  {
    _id: getObjectId('order a customer'),
    orderId: getObjectId('order a'),
    phone: '+78889990011',
    name: 'admin',
    email: 'admin@gmail.com',
    secondName: 'Second',
    lastName: 'Site',
    itemId: '000001',
    userId: getObjectId('admin'),
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

// @ts-ignore
export = orderCustomers;
