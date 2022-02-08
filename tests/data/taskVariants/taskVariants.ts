import { DEFAULT_COMPANY_SLUG, DEFAULT_LOCALE } from 'config/common';
import {
  TASK_PRICE_ACTION_ADDED,
  TASK_PRICE_ACTION_DELETED,
  TASK_PRICE_ACTION_UPDATED,
  TASK_PRICE_SLUG_PRODUCT_ASSETS,
  TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_NUMBER,
  TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_SELECT,
  TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_STRING,
  TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_SELECT,
  TASK_PRICE_SLUG_PRODUCT_BRANDS,
  TASK_PRICE_SLUG_PRODUCT_CATEGORIES,
  TASK_PRICE_SLUG_PRODUCT_SEO_CONTENT,
  TASK_PRICE_SLUG_PRODUCT_VARIANTS,
  TASK_PRICE_TARGET_FIELD,
  TASK_PRICE_TARGET_SYMBOL,
  TASK_VARIANT_SLUG_PRODUCT_ASSETS,
  TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES,
  TASK_VARIANT_SLUG_PRODUCT_BRANDS,
  TASK_VARIANT_SLUG_PRODUCT_CATEGORIES,
  TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT,
  TASK_VARIANT_SLUG_PRODUCT_VARIANTS,
} from 'config/constantSelects';
import { TaskVariantModel } from 'db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const taskVariants: TaskVariantModel[] = [
  {
    _id: getObjectId('task variant product attributes'),
    slug: TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить атрибуты',
    },
    prices: [
      {
        action: TASK_PRICE_ACTION_ADDED,
        price: 10,
        slug: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_SELECT,
        target: TASK_PRICE_TARGET_FIELD,
      },
      {
        action: TASK_PRICE_ACTION_DELETED,
        price: 0,
        slug: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_SELECT,
        target: TASK_PRICE_TARGET_FIELD,
      },
      {
        action: TASK_PRICE_ACTION_UPDATED,
        price: 5,
        slug: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_SELECT,
        target: TASK_PRICE_TARGET_FIELD,
      },

      {
        action: TASK_PRICE_ACTION_ADDED,
        price: 15,
        slug: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_SELECT,
        target: TASK_PRICE_TARGET_FIELD,
      },
      {
        action: TASK_PRICE_ACTION_DELETED,
        price: 0,
        slug: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_SELECT,
        target: TASK_PRICE_TARGET_FIELD,
      },
      {
        action: TASK_PRICE_ACTION_UPDATED,
        price: 5,
        slug: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_SELECT,
        target: TASK_PRICE_TARGET_FIELD,
      },

      {
        action: TASK_PRICE_ACTION_ADDED,
        price: 5,
        slug: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_NUMBER,
        target: TASK_PRICE_TARGET_FIELD,
      },
      {
        action: TASK_PRICE_ACTION_DELETED,
        price: 0,
        slug: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_NUMBER,
        target: TASK_PRICE_TARGET_FIELD,
      },
      {
        action: TASK_PRICE_ACTION_UPDATED,
        price: 5,
        slug: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_NUMBER,
        target: TASK_PRICE_TARGET_FIELD,
      },

      {
        action: TASK_PRICE_ACTION_ADDED,
        price: 2,
        slug: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_STRING,
        target: TASK_PRICE_TARGET_SYMBOL,
      },
      {
        action: TASK_PRICE_ACTION_DELETED,
        price: 0,
        slug: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_STRING,
        target: TASK_PRICE_TARGET_SYMBOL,
      },
      {
        action: TASK_PRICE_ACTION_UPDATED,
        price: 2,
        slug: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_STRING,
        target: TASK_PRICE_TARGET_SYMBOL,
      },
    ],
  },
  {
    _id: getObjectId('task variant product assets'),
    slug: TASK_VARIANT_SLUG_PRODUCT_ASSETS,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить картинки',
    },
    prices: [
      {
        action: TASK_PRICE_ACTION_ADDED,
        price: 50,
        slug: TASK_PRICE_SLUG_PRODUCT_ASSETS,
        target: TASK_PRICE_TARGET_SYMBOL,
      },
      {
        action: TASK_PRICE_ACTION_DELETED,
        price: 0,
        slug: TASK_PRICE_SLUG_PRODUCT_ASSETS,
        target: TASK_PRICE_TARGET_SYMBOL,
      },
      {
        action: TASK_PRICE_ACTION_UPDATED,
        price: 10,
        slug: TASK_PRICE_SLUG_PRODUCT_ASSETS,
        target: TASK_PRICE_TARGET_SYMBOL,
      },
    ],
  },
  {
    _id: getObjectId('task variant product seo text'),
    slug: TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить seo текст',
    },
    prices: [
      {
        action: TASK_PRICE_ACTION_ADDED,
        price: 50,
        slug: TASK_PRICE_SLUG_PRODUCT_SEO_CONTENT,
        target: TASK_PRICE_TARGET_SYMBOL,
      },
      {
        action: TASK_PRICE_ACTION_DELETED,
        price: 0,
        slug: TASK_PRICE_SLUG_PRODUCT_SEO_CONTENT,
        target: TASK_PRICE_TARGET_SYMBOL,
      },
      {
        action: TASK_PRICE_ACTION_UPDATED,
        price: 10,
        slug: TASK_PRICE_SLUG_PRODUCT_SEO_CONTENT,
        target: TASK_PRICE_TARGET_SYMBOL,
      },
    ],
  },
  {
    _id: getObjectId('task variant product categories'),
    slug: TASK_VARIANT_SLUG_PRODUCT_CATEGORIES,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить категории',
    },
    prices: [
      {
        action: TASK_PRICE_ACTION_ADDED,
        price: 50,
        slug: TASK_PRICE_SLUG_PRODUCT_CATEGORIES,
        target: TASK_PRICE_TARGET_FIELD,
      },
      {
        action: TASK_PRICE_ACTION_DELETED,
        price: 0,
        slug: TASK_PRICE_SLUG_PRODUCT_CATEGORIES,
        target: TASK_PRICE_TARGET_FIELD,
      },
      {
        action: TASK_PRICE_ACTION_UPDATED,
        price: 10,
        slug: TASK_PRICE_SLUG_PRODUCT_CATEGORIES,
        target: TASK_PRICE_TARGET_FIELD,
      },
    ],
  },
  {
    _id: getObjectId('task variant product variants'),
    slug: TASK_VARIANT_SLUG_PRODUCT_VARIANTS,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить связи',
    },
    prices: [
      {
        action: TASK_PRICE_ACTION_ADDED,
        price: 50,
        slug: TASK_PRICE_SLUG_PRODUCT_VARIANTS,
        target: TASK_PRICE_TARGET_FIELD,
      },
      {
        action: TASK_PRICE_ACTION_DELETED,
        price: 0,
        slug: TASK_PRICE_SLUG_PRODUCT_VARIANTS,
        target: TASK_PRICE_TARGET_FIELD,
      },
      {
        action: TASK_PRICE_ACTION_UPDATED,
        price: 10,
        slug: TASK_PRICE_SLUG_PRODUCT_VARIANTS,
        target: TASK_PRICE_TARGET_FIELD,
      },
    ],
  },
  {
    _id: getObjectId('task variant product brand'),
    slug: TASK_VARIANT_SLUG_PRODUCT_BRANDS,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Назначить бренд / коллекцию / производителя',
    },
    prices: [
      {
        action: TASK_PRICE_ACTION_ADDED,
        price: 50,
        slug: TASK_PRICE_SLUG_PRODUCT_BRANDS,
        target: TASK_PRICE_TARGET_FIELD,
      },
      {
        action: TASK_PRICE_ACTION_DELETED,
        price: 0,
        slug: TASK_PRICE_SLUG_PRODUCT_BRANDS,
        target: TASK_PRICE_TARGET_FIELD,
      },
      {
        action: TASK_PRICE_ACTION_UPDATED,
        price: 10,
        slug: TASK_PRICE_SLUG_PRODUCT_BRANDS,
        target: TASK_PRICE_TARGET_FIELD,
      },
    ],
  },
];

// @ts-ignore
export = taskVariants;
