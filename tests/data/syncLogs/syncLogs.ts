import { SyncLogModel } from 'db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const syncLogs: SyncLogModel[] = [
  {
    _id: getObjectId('sync log A'),
    variant: 'success',
    message: 'success',
    token: '000001',
    createdAt: new Date(),
  },
];

// @ts-ignore
export = syncLogs;
