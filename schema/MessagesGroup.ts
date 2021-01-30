import { objectType } from 'nexus';
import { MessageModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_MESSAGES_GROUPS } from 'db/collectionNames';

export const MessagesGroup = objectType({
  name: 'MessagesGroup',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('name');
    t.nonNull.list.nonNull.objectId('messagesIds');

    // All group messages field resolver
    t.nonNull.list.nonNull.field('messages', {
      type: 'Message',
      description: 'Returns all messages for current current group',
      resolve: async (source): Promise<MessageModel[]> => {
        const db = await getDatabase();
        const messagesCollection = db.collection<MessageModel>(COL_MESSAGES_GROUPS);
        const messages = await messagesCollection
          .find({
            _id: {
              $in: source.messagesIds,
            },
          })
          .toArray();
        return messages;
      },
    });
  },
});
