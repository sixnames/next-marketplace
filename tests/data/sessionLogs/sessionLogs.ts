import { SessionLogModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const sessionLogs: SessionLogModel[] = [
  {
    _id: getObjectId('sessionLog fake'),
    companySlug: 'fake',
    events: [],
    userId: null,
    ipInfo: {
      hostname: null,
      ip: 'ip',
      type: 'IPv4',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
export = sessionLogs;
