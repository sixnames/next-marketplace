import { objectType } from 'nexus';
import { AttributesGroupModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_ATTRIBUTES_GROUPS } from 'db/collectionNames';

export const RubricAttributesGroup = objectType({
  name: 'RubricAttributesGroup',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.list.nonNull.objectId('showInCatalogueFilter');
    t.nonNull.objectId('attributesGroupId');

    // RubricAttributesGroup attributesGroup field resolver
    t.nonNull.field('attributesGroup', {
      type: 'AttributesGroup',
      resolve: async (source): Promise<AttributesGroupModel> => {
        const db = await getDatabase();
        const attributesGroupsCollection = db.collection<AttributesGroupModel>(
          COL_ATTRIBUTES_GROUPS,
        );
        const attributesGroup = await attributesGroupsCollection.findOne({
          _id: source.attributesGroupId,
        });
        if (!attributesGroup) {
          throw Error('Attributes group not found in RubricAttributesGroup');
        }
        return attributesGroup;
      },
    });
  },
});
