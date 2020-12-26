import { OrderStatus, OrderStatusModel } from '../../entities/OrderStatus';
import { MOCK_ORDER_STATUS_NEW } from '@yagu/shared';

export interface CreateInitialOrderStatuses {
  initialOrderStatusNew?: OrderStatus;
  initialOrderStatusConfirmed?: OrderStatus;
  initialOrderStatusDone?: OrderStatus;
  initialOrderStatusCanceled?: OrderStatus;
  initialOrderStatuses: OrderStatus[];
}

export const creteInitialOrderStatuses = async (): Promise<CreateInitialOrderStatuses> => {
  const createdStatuses = await OrderStatusModel.find({});

  if (createdStatuses.length > 0) {
    return {
      initialOrderStatuses: createdStatuses,
    };
  }
  const initialOrderStatusNew = await OrderStatusModel.create(MOCK_ORDER_STATUS_NEW);
  const initialOrderStatusConfirmed = await OrderStatusModel.create(MOCK_ORDER_STATUS_NEW);
  const initialOrderStatusDone = await OrderStatusModel.create(MOCK_ORDER_STATUS_NEW);
  const initialOrderStatusCanceled = await OrderStatusModel.create(MOCK_ORDER_STATUS_NEW);

  return {
    initialOrderStatusNew,
    initialOrderStatusConfirmed,
    initialOrderStatusDone,
    initialOrderStatusCanceled,
    initialOrderStatuses: [
      initialOrderStatusNew,
      initialOrderStatusConfirmed,
      initialOrderStatusDone,
      initialOrderStatusCanceled,
    ],
  };
};
