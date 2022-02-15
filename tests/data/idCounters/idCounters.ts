import {
  COL_ATTRIBUTES,
  COL_BLOG_POSTS,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CATEGORIES,
  COL_COMPANIES,
  COL_MANUFACTURERS,
  COL_OPTIONS,
  COL_ORDERS,
  COL_PRODUCT_SUMMARIES,
  COL_PROMO,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_SUPPLIERS,
  COL_TASKS,
  COL_USERS,
  COL_EVENT_SUMMARIES,
} from 'db/collectionNames';
import { IdCounterModel } from 'db/dbModels';

const idCounters: IdCounterModel[] = [
  {
    collection: COL_USERS,
    counter: 999999,
  },
  {
    collection: COL_OPTIONS,
    counter: 999999,
  },
  {
    collection: COL_BRAND_COLLECTIONS,
    counter: 999999,
  },
  {
    collection: COL_BRANDS,
    counter: 999999,
  },
  {
    collection: COL_MANUFACTURERS,
    counter: 999999,
  },
  {
    collection: COL_SUPPLIERS,
    counter: 999999,
  },
  {
    collection: COL_PRODUCT_SUMMARIES,
    counter: 999999,
  },
  {
    collection: COL_SHOP_PRODUCTS,
    counter: 999999,
  },
  {
    collection: COL_ORDERS,
    counter: 999999,
  },
  {
    collection: COL_COMPANIES,
    counter: 999999,
  },
  {
    collection: COL_SHOPS,
    counter: 999999,
  },
  {
    collection: COL_CATEGORIES,
    counter: 999999,
  },
  {
    collection: COL_PROMO,
    counter: 999999,
  },
  {
    collection: COL_ATTRIBUTES,
    counter: 999999,
  },
  {
    collection: COL_BLOG_POSTS,
    counter: 999999,
  },
  {
    collection: COL_TASKS,
    counter: 999999,
  },
  {
    collection: COL_EVENT_SUMMARIES,
    counter: 999999,
  },
];

// @ts-ignore
export = idCounters;
