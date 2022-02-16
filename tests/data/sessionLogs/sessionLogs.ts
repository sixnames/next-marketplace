import { SessionLogModel } from 'db/dbModels';
import { DEFAULT_CITY, DEFAULT_LOCALE } from 'lib/config/common';
import { getObjectId } from 'mongo-seeding';

const sessionLogs: SessionLogModel[] = [
  {
    _id: getObjectId('sessionLog fake'),
    companySlug: 'fake',
    citySlug: DEFAULT_CITY,
    locale: DEFAULT_LOCALE,
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
