import { objectType } from 'nexus';

export const Order = objectType({
  name: 'Order',
  definition(t) {
    t.implements('Base');
    t.implements('Timestamp');
    t.string('comment');
    t.nonNull.objectId('statusId');
  },
});
