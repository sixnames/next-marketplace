import { arg, extendType, nonNull } from 'nexus';
import { RoleModel } from '../db/dbModels';
import { getDbCollections } from '../db/mongodb';

export const RoleQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return role by give id
    t.field('getRole', {
      type: 'Role',
      description: 'Should return role by give id',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args): Promise<RoleModel | null> => {
        const collections = await getDbCollections();
        const rolesCollection = collections.rolesCollection();
        const role = await rolesCollection.findOne({ _id: args._id });
        return role;
      },
    });

    // Should return all roles list
    t.nonNull.list.nonNull.field('getAllRoles', {
      type: 'Role',
      description: 'Should return all roles list',
      resolve: async (): Promise<RoleModel[]> => {
        const collections = await getDbCollections();
        const rolesCollection = collections.rolesCollection();
        const role = await rolesCollection.find({}).toArray();
        return role;
      },
    });
  },
});
