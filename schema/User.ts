import { objectType } from 'nexus';
import { FormattedPhoneModel, RoleModel } from '../db/dbModels';
import { getDbCollections } from '../db/mongodb';
import { ROLE_SLUG_GUEST } from '../lib/config/common';
import { getFullName, getShortName } from '../lib/nameUtils';
import { phoneToRaw, phoneToReadable } from '../lib/phoneUtils';

// User type
export const User = objectType({
  name: 'User',
  definition(t) {
    t.implements('Base');
    t.implements('Timestamp');
    t.nonNull.string('name');
    t.string('lastName');
    t.string('secondName');
    t.nonNull.email('email');
    t.nonNull.string('phone');
    t.nonNull.objectId('roleId');

    // User fullName field resolver
    t.nonNull.field('fullName', {
      type: 'String',
      resolve: (source): string => {
        return getFullName(source);
      },
    });

    // User shortName field resolver
    t.nonNull.field('shortName', {
      type: 'String',
      resolve: (source): string => {
        return getShortName(source);
      },
    });

    // User formattedPhone field resolver
    t.nonNull.field('formattedPhone', {
      type: 'FormattedPhone',
      resolve: (source): FormattedPhoneModel => {
        try {
          return {
            raw: phoneToRaw(source.phone),
            readable: phoneToReadable(source.phone),
          };
        } catch (e) {
          console.log(e);
          return {
            raw: '',
            readable: '',
          };
        }
      },
    });

    // User Role field resolver
    t.nonNull.field('role', {
      type: 'Role',
      resolve: async (source): Promise<RoleModel> => {
        const collections = await getDbCollections();
        const rolesCollection = collections.rolesCollection();
        const role = await rolesCollection.findOne({ _id: source.roleId });
        if (!role) {
          console.log('User role not found. Assigning Guest role');
          const guestRole = await rolesCollection.findOne({ slug: ROLE_SLUG_GUEST });
          if (!guestRole) {
            throw Error('Guest role not found in User.role resolver');
          }
          return guestRole;
        }
        return role;
      },
    });
  },
});
