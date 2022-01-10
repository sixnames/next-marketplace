import { SyncIntersectModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const shops: SyncIntersectModel[] = [
  {
    _id: getObjectId('sync intersect A'),
    products: [],
    shopId: getObjectId('fake shop'),
  },
];

// @ts-ignore
export = shops;
