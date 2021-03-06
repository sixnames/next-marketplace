import { objectType } from 'nexus';
import { FormattedPhoneModel, UserModel } from '../db/dbModels';
import { getDbCollections } from '../db/mongodb';
import { getFullName, getShortName } from '../lib/nameUtils';
import { phoneToRaw, phoneToReadable } from '../lib/phoneUtils';

export const OrderCustomer = objectType({
  name: 'OrderCustomer',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('userId');
    t.nonNull.int('itemId');
    t.nonNull.string('name');
    t.string('lastName');
    t.string('secondName');
    t.nonNull.email('email');
    t.nonNull.string('phone');

    // OrderCustomer user field resolver
    t.field('user', {
      type: 'User',
      resolve: async (source): Promise<UserModel | null> => {
        const collections = await getDbCollections();
        const usersCollection = collections.usersCollection();
        const user = await usersCollection.findOne({ _id: source.userId });
        return user;
      },
    });

    // OrderCustomer fullName field resolver
    t.nonNull.field('fullName', {
      type: 'String',
      resolve: (source): string => {
        return getFullName(source);
      },
    });

    // OrderCustomer shortName field resolver
    t.nonNull.field('shortName', {
      type: 'String',
      resolve: (source): string => {
        return getShortName(source);
      },
    });

    // OrderCustomer formattedPhone field resolver
    t.nonNull.field('formattedPhone', {
      type: 'FormattedPhone',
      resolve: (source): FormattedPhoneModel => {
        return {
          raw: phoneToRaw(source.phone),
          readable: phoneToReadable(source.phone),
        };
      },
    });
  },
});
