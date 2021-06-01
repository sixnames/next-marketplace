import { COL_ROLES } from 'db/collectionNames';
import { RoleModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { arg, extendType, nonNull } from 'nexus';

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
        const { db } = await getDatabase();
        const rolesCollection = db.collection<RoleModel>(COL_ROLES);
        const role = await rolesCollection.findOne({ _id: args._id });
        return role;
      },
    });

    // Should return all roles list
    t.nonNull.list.nonNull.field('getAllRoles', {
      type: 'Role',
      description: 'Should return all roles list',
      resolve: async (): Promise<RoleModel[]> => {
        const { db } = await getDatabase();
        const rolesCollection = db.collection<RoleModel>(COL_ROLES);
        const role = await rolesCollection.find({}).toArray();
        return role;
      },
    });
  },
});
