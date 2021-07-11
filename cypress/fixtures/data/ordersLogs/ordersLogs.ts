import { OrderLogModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const orderLogs: OrderLogModel[] = [
  {
    _id: getObjectId('order a log'),
    orderId: getObjectId('order a'),
    userId: getObjectId('admin'),
    statusId: getObjectId(`orderStatus new`),
    variant: 'status' as any,
    createdAt: new Date(),
  },
];

// @ts-ignore
export = orderLogs;
