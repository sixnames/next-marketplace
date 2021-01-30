import { OrderStatusModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_ORDER_STATUSES } from 'db/collectionNames';
import {
  DEFAULT_LOCALE,
  ORDER_STATUS_CANCELED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_DONE,
  ORDER_STATUS_NEW,
  SECONDARY_LOCALE,
} from 'config/common';

export interface CreateInitialOrderStatuses {
  initialOrderStatusNew: OrderStatusModel;
  initialOrderStatusConfirmed: OrderStatusModel;
  initialOrderStatusDone: OrderStatusModel;
  initialOrderStatusCanceled: OrderStatusModel;
  initialOrderStatuses: OrderStatusModel[];
}

export const creteInitialOrderStatuses = async (): Promise<CreateInitialOrderStatuses> => {
  const db = await getDatabase();
  const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);
  const createdStatuses = await orderStatusesCollection.find({}).toArray();

  if (createdStatuses.length > 0) {
    const initialOrderStatusNew = await orderStatusesCollection.findOne({ slug: ORDER_STATUS_NEW });
    if (!initialOrderStatusNew) {
      throw Error('Find initial statuses error');
    }

    const initialOrderStatusConfirmed = await orderStatusesCollection.findOne({
      slug: ORDER_STATUS_CONFIRMED,
    });
    if (!initialOrderStatusConfirmed) {
      throw Error('Find initial statuses error');
    }

    const initialOrderStatusDone = await orderStatusesCollection.findOne({
      slug: ORDER_STATUS_DONE,
    });
    if (!initialOrderStatusDone) {
      throw Error('Find initial statuses error');
    }

    const initialOrderStatusCanceled = await orderStatusesCollection.findOne({
      slug: ORDER_STATUS_CANCELED,
    });
    if (!initialOrderStatusCanceled) {
      throw Error('Find initial statuses error');
    }

    return {
      initialOrderStatusNew,
      initialOrderStatusConfirmed,
      initialOrderStatusDone,
      initialOrderStatusCanceled,
      initialOrderStatuses: createdStatuses,
    };
  }

  const createdInitialOrderStatusNew = await orderStatusesCollection.insertOne({
    slug: ORDER_STATUS_NEW,
    color: '#0097a7',
    createdAt: new Date(),
    updatedAt: new Date(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Новый`,
      [SECONDARY_LOCALE]: `New`,
    },
  });
  if (!createdInitialOrderStatusNew.result.ok) {
    throw Error('Create initial statuses error');
  }
  const initialOrderStatusNew = createdInitialOrderStatusNew.ops[0];

  const createdInitialOrderStatusConfirmed = await orderStatusesCollection.insertOne({
    slug: ORDER_STATUS_CONFIRMED,
    color: '#E7C55A',
    createdAt: new Date(),
    updatedAt: new Date(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Подтверждён`,
      [SECONDARY_LOCALE]: `Confirmed`,
    },
  });
  if (!createdInitialOrderStatusConfirmed.result.ok) {
    throw Error('Create initial statuses error');
  }
  const initialOrderStatusConfirmed = createdInitialOrderStatusConfirmed.ops[0];

  const createdInitialOrderStatusDone = await orderStatusesCollection.insertOne({
    slug: ORDER_STATUS_DONE,
    color: '#93AF42',
    createdAt: new Date(),
    updatedAt: new Date(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Выполнен`,
      [SECONDARY_LOCALE]: `Done`,
    },
  });
  if (!createdInitialOrderStatusDone.result.ok) {
    throw Error('Create initial statuses error');
  }
  const initialOrderStatusDone = createdInitialOrderStatusDone.ops[0];

  const createdInitialOrderStatusCanceled = await orderStatusesCollection.insertOne({
    slug: ORDER_STATUS_CANCELED,
    color: '#AAACB0',
    createdAt: new Date(),
    updatedAt: new Date(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Отменён`,
      [SECONDARY_LOCALE]: `Canceled`,
    },
  });
  if (!createdInitialOrderStatusCanceled.result.ok) {
    throw Error('Create initial statuses error');
  }
  const initialOrderStatusCanceled = createdInitialOrderStatusCanceled.ops[0];

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
