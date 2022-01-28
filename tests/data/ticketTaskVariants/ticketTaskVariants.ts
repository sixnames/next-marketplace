import { DEFAULT_COMPANY_SLUG, DEFAULT_LOCALE } from '../../../config/common';
import { TicketTaskVariantModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const ticketTaskVariants: TicketTaskVariantModel[] = [
  {
    _id: getObjectId('ticket task variant a'),
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить атрибуты',
    },
  },
  {
    _id: getObjectId('ticket task variant b'),
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить картинки',
    },
  },
  {
    _id: getObjectId('ticket task variant c'),
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить seo текст',
    },
  },
];

// @ts-ignore
export = ticketTaskVariants;
