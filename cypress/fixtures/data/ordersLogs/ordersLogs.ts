import { DEFAULT_DIFF } from '../../../../config/common';
import { OrderLogModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const orderLogs: OrderLogModel[] = [
  {
    _id: getObjectId('order a log'),
    orderId: getObjectId('order a'),
    userId: getObjectId('admin'),
    createdAt: new Date(),
    logUser: {
      email: 'email',
      secondName: 'secondName',
      lastName: 'lastName',
      name: 'name',
      phone: 'phone',
    },
    diff: DEFAULT_DIFF,
  },
];

// @ts-ignore
export = orderLogs;
