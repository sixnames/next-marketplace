import { enumType, objectType } from 'nexus';
import { ORDER_LOG_VARIANTS_ENUMS } from 'config/common';
import { UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_USERS } from 'db/collectionNames';

export const OrderLogVariant = enumType({
  name: 'OrderLogVariant',
  members: ORDER_LOG_VARIANTS_ENUMS,
  description: 'Order log variant enum.',
});

export const OrderLog = objectType({
  name: 'OrderLog',
  definition(t) {
    t.nonNull.objectId('_id');
    t.implements('Timestamp');
    t.nonNull.field('variant', {
      type: 'OrderLogVariant',
    });
    t.nonNull.objectId('userId');

    // OrderLog user field resolver
    t.field('user', {
      type: 'User',
      resolve: async (source): Promise<UserModel | null> => {
        const { db } = await getDatabase();
        const usersCollection = db.collection<UserModel>(COL_USERS);
        const user = await usersCollection.findOne({ _id: source.userId });
        return user;
      },
    });
  },
});
