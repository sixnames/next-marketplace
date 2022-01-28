import { DEFAULT_COMPANY_SLUG, TICKET_STATE_EDITING } from '../../../config/common';
import { TicketModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const tickets: TicketModel[] = [
  {
    _id: getObjectId('ticket a'),
    stateEnum: TICKET_STATE_EDITING,
    productId: getObjectId('000010'),
    createdById: getObjectId('admin'),
    companySlug: DEFAULT_COMPANY_SLUG,
    task: {
      done: false,
      variantId: getObjectId('ticket task variant a'),
    },
    log: [
      {
        _id: getObjectId('ticket a log a'),
        createdById: getObjectId('admin'),
        prevStateEnum: TICKET_STATE_EDITING,
        nextStateEnum: TICKET_STATE_EDITING,
        createdAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
export = tickets;
