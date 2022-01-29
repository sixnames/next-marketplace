import { DEFAULT_COMPANY_SLUG, DEFAULT_LOCALE } from '../../../config/common';
import {
  TASK_VARIANT_SLUG_PRODUCT_ASSETS,
  TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES,
  TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT,
} from '../../../config/constantSelects';
import { TaskVariantModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

// TODO prices, slug
const taskVariants: TaskVariantModel[] = [
  {
    _id: getObjectId('task variant a'),
    slug: TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES,
    prices: [],
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить атрибуты',
    },
  },
  {
    _id: getObjectId('task variant b'),
    slug: TASK_VARIANT_SLUG_PRODUCT_ASSETS,
    prices: [],
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить картинки',
    },
  },
  {
    _id: getObjectId('task variant c'),
    slug: TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT,
    prices: [],
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить seo текст',
    },
  },
];

// @ts-ignore
export = taskVariants;
