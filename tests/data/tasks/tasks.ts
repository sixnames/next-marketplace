import { DEFAULT_COMPANY_SLUG, TASK_STATE_EDITING } from '../../../config/common';
import { TaskModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const tasks: TaskModel[] = [
  {
    _id: getObjectId('task a'),
    stateEnum: TASK_STATE_EDITING,
    productId: getObjectId('000010'),
    createdById: getObjectId('admin'),
    companySlug: DEFAULT_COMPANY_SLUG,
    done: false,
    variantId: getObjectId('task variant a'),
    log: [
      {
        _id: getObjectId('task a log a'),
        createdById: getObjectId('admin'),
        prevStateEnum: TASK_STATE_EDITING,
        nextStateEnum: TASK_STATE_EDITING,
        createdAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
export = tasks;
