import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_OPTIONS,
  COL_ORDERS,
  COL_PRODUCTS,
  COL_USERS,
} from '../../../../db/collectionNames';
import { IdCounterModel } from '../../../../db/dbModels';

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
    collection: COL_PRODUCTS,
    counter: 999999,
  },
  {
    collection: COL_ORDERS,
    counter: 999999,
  },
];

// @ts-ignore
export = idCounters;
