import { DEFAULT_LOCALE } from '../../../config/common';
import { TicketTaskVariantModel, TicketTaskVariantPricesModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const prices: TicketTaskVariantPricesModel = {
  symbol: 1,
  picture: 3,
  attribute: 4,
};

const ticketTaskVariants: TicketTaskVariantModel[] = [
  {
    _id: getObjectId('ticket task variant a'),
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить атрибуты',
    },
    prices,
  },
  {
    _id: getObjectId('ticket task variant b'),
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить картинки',
    },
    prices,
  },
  {
    _id: getObjectId('ticket task variant c'),
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить seo текст',
    },
    prices,
  },
];

// @ts-ignore
export = ticketTaskVariants;
