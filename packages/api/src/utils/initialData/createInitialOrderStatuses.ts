import { OrderStatus, OrderStatusModel } from '../../entities/OrderStatus';
import {
  DEFAULT_LANG,
  ORDER_STATUS_CANCELED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_DONE,
  ORDER_STATUS_NEW,
  SECONDARY_LANG,
} from '@yagu/shared';

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
  const initialOrderStatusNew = await OrderStatusModel.create({
    slug: ORDER_STATUS_NEW,
    color: '#0097a7',
    name: [
      { key: DEFAULT_LANG, value: 'Новый' },
      { key: SECONDARY_LANG, value: 'New' },
    ],
  });
  const initialOrderStatusConfirmed = await OrderStatusModel.create({
    color: '#E7C55A',
    slug: ORDER_STATUS_CONFIRMED,
    name: [
      { key: DEFAULT_LANG, value: 'Подтверждён' },
      { key: SECONDARY_LANG, value: 'Confirmed' },
    ],
  });
  const initialOrderStatusDone = await OrderStatusModel.create({
    color: '#93AF42',
    slug: ORDER_STATUS_DONE,
    name: [
      { key: DEFAULT_LANG, value: 'Выполнен' },
      { key: SECONDARY_LANG, value: 'Done' },
    ],
  });
  const initialOrderStatusCanceled = await OrderStatusModel.create({
    color: '#AAACB0',
    slug: ORDER_STATUS_CANCELED,
    name: [
      { key: DEFAULT_LANG, value: 'Отменён' },
      { key: SECONDARY_LANG, value: 'Canceled' },
    ],
  });

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
