import { DRAFT_STATE_EDITING } from '../../../config/common';
import { TicketModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const tickets: TicketModel[] = [
  {
    _id: getObjectId('ticket a'),
    stateEnum: DRAFT_STATE_EDITING,
    productId: getObjectId('000010'),
    createdById: getObjectId('admin'),
    task: {
      done: false,
      variantId: getObjectId('ticket task variant a'),
    },
    log: [
      {
        prevStateEnum: DRAFT_STATE_EDITING,
        nextStateEnum: DRAFT_STATE_EDITING,
        authorId: getObjectId('admin'),
        createdAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
export = tickets;
