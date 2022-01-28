import { DEFAULT_COMPANY_SLUG, DEFAULT_LOCALE } from '../../../config/common';
import { TaskVariantModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

// TODO prices, slug
const taskVariants: TaskVariantModel[] = [
  {
    _id: getObjectId('task variant a'),
    slug: '',
    prices: [],
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить атрибуты',
    },
  },
  {
    _id: getObjectId('task variant b'),
    slug: '',
    prices: [],
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить картинки',
    },
  },
  {
    _id: getObjectId('task variant c'),
    slug: '',
    prices: [],
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить seo текст',
    },
  },
];

// @ts-ignore
export = taskVariants;
