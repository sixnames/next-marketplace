import { OrderStatusModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const defaultSlug = 'orderStatus';

const orderStatuses: OrderStatusModel[] = [
  {
    _id: getObjectId(`${defaultSlug} new`),
    slug: 'new',
    color: '#0097a7',
    nameI18n: {
      ru: 'Новый',
      en: 'New',
    },
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
export = orderStatuses;
