import { DEFAULT_COMPANY_SLUG, TASK_STATE_PENDING } from 'config/common';
import { TaskModel } from 'db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const tasks: TaskModel[] = [
  {
    _id: getObjectId('task a'),
    itemId: '000001',
    stateEnum: TASK_STATE_PENDING,
    productId: getObjectId('000150'),
    createdById: getObjectId('admin'),
    companySlug: DEFAULT_COMPANY_SLUG,
    variantId: getObjectId('task variant product attributes'),
    createdAt: new Date(),
    updatedAt: new Date(),
    log: [],
  },
  {
    _id: getObjectId('task b'),
    itemId: '000002',
    stateEnum: TASK_STATE_PENDING,
    productId: getObjectId('000010'),
    createdById: getObjectId('admin'),
    executorId: getObjectId('content manager'),
    companySlug: DEFAULT_COMPANY_SLUG,
    variantId: getObjectId('task variant product assets'),
    createdAt: new Date(),
    updatedAt: new Date(),
    log: [],
  },
  {
    _id: getObjectId('task c'),
    itemId: '000003',
    stateEnum: TASK_STATE_PENDING,
    productId: getObjectId('000010'),
    createdById: getObjectId('admin'),
    executorId: getObjectId('content manager'),
    companySlug: DEFAULT_COMPANY_SLUG,
    variantId: getObjectId('task variant product seo text'),
    createdAt: new Date(),
    updatedAt: new Date(),
    log: [],
  },
];

// @ts-ignore
export = tasks;
