import { aggregatePagination } from 'db/dao/aggregatePagination';
import { arg, objectType, queryType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import {
  FormattedPhoneModel,
  RoleModel,
  UserModel,
  UsersPaginationPayloadModel,
} from 'db/dbModels';
import { COL_ROLES, COL_USERS } from 'db/collectionNames';
import { ROLE_SLUG_GUEST } from 'config/common';
import { getFullName, getShortName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';

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
    t.nonNull.phone('phone');
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
        const { db } = await getDatabase();
        const rolesCollection = db.collection<RoleModel>(COL_ROLES);
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

export const UsersPaginationPayload = objectType({
  name: 'UsersPaginationPayload',
  definition(t) {
    t.implements('PaginationPayload');
    t.nonNull.list.nonNull.field('docs', {
      type: 'User',
    });
  },
});

// User Queries
export const UserQuery = queryType({
  definition(t) {
    // Should return paginated users
    t.nonNull.field('getAllUsers', {
      type: 'UsersPaginationPayload',
      description: 'Should return paginated users',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
      },
      resolve: async (_source, args, context): Promise<UsersPaginationPayloadModel> => {
        const { city } = await getRequestParams(context);
        const { input } = args;
        const { search } = input || { search: null };

        const regexSearch = {
          $regex: search,
          $options: 'i',
        };

        const searchStage = search
          ? [
              {
                $match: {
                  $or: [
                    {
                      email: regexSearch,
                    },
                    {
                      name: regexSearch,
                    },
                    {
                      lastName: regexSearch,
                    },
                    {
                      secondName: regexSearch,
                    },
                    {
                      phone: regexSearch,
                    },
                    {
                      itemId: regexSearch,
                    },
                  ],
                },
              },
            ]
          : [];

        const paginationResult = await aggregatePagination<UserModel>({
          input: args.input,
          collectionName: COL_USERS,
          pipeline: searchStage,
          city,
        });
        return paginationResult;
      },
    });
  },
});
