import { OrderStatusModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const defaultSlug = 'orderStatus';

const orderStatuses: OrderStatusModel[] = [
  {
    _id: getObjectId(`${defaultSlug} new`),
    slug: 'pending',
    color: '#0097a7',
    nameI18n: {
      ru: 'Новый',
      en: 'New',
    },
    index: 0,
    isNew: true,
    isConfirmed: false,
    isPayed: false,
    isCanceled: false,
    isDone: false,
    isCancelationRequest: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId(`${defaultSlug} confirmed`),
    slug: 'confirmed',
    color: '#E7C55A',
    nameI18n: {
      ru: 'Подтверждён',
      en: 'Confirmed',
    },
    index: 1,
    isNew: false,
    isConfirmed: true,
    isPayed: false,
    isCanceled: false,
    isDone: false,
    isCancelationRequest: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId(`${defaultSlug} done`),
    slug: 'done',
    color: '#93AF42',
    nameI18n: {
      ru: 'Выполнен',
      en: 'Done',
    },
    index: 2,
    isNew: false,
    isConfirmed: false,
    isPayed: false,
    isCanceled: false,
    isDone: true,
    isCancelationRequest: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId(`${defaultSlug} canceled`),
    slug: 'canceled',
    color: '#AAACB0',
    nameI18n: {
      ru: 'Отменён',
      en: 'Canceled',
    },
    index: 3,
    isNew: false,
    isConfirmed: false,
    isPayed: false,
    isCanceled: true,
    isDone: false,
    isCancelationRequest: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId(`${defaultSlug} cancelationRequest`),
    slug: 'cancelationRequest',
    color: '#aa1478',
    nameI18n: {
      ru: 'Запрос на отмену',
      en: 'Cancelation request',
    },
    index: 4,
    isNew: false,
    isConfirmed: false,
    isPayed: false,
    isCanceled: false,
    isDone: false,
    isCancelationRequest: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
export = orderStatuses;
