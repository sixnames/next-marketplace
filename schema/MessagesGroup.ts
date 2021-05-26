import { getRequestParams } from 'lib/sessionHelpers';
import { objectType } from 'nexus';
import { MessageModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_MESSAGES_GROUPS } from 'db/collectionNames';

export const MessagesGroup = objectType({
  name: 'MessagesGroup',
  definition(t) {
    t.nonNull.objectId('_id');

    // MessagesGroup name field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context): Promise<string> => {
        const { getFieldLocale } = await getRequestParams(context);
        return getFieldLocale(source.nameI18n);
      },
    });

    // All group messages field resolver
    t.nonNull.list.nonNull.field('messages', {
      type: 'Message',
      description: 'Returns all messages for current current group',
      resolve: async (source): Promise<MessageModel[]> => {
        const db = await getDatabase();
        const messagesCollection = db.collection<MessageModel>(COL_MESSAGES_GROUPS);
        const messages = await messagesCollection
          .find({
            messagesGroupId: source._id,
          })
          .toArray();
        return messages;
      },
    });
  },
});
