import { extendType, objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import { MessageModel } from 'db/dbModels';
import { getValidationMessages } from 'lib/apiMessageUtils';

export const Message = objectType({
  name: 'Message',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('slug');
    t.nonNull.json('messageI18n');

    // Message translation field resolver
    t.nonNull.field('message', {
      type: 'String',
      description: 'Returns message for current locale',
      resolve: async (source, _args, context): Promise<string> => {
        const { getFieldLocale } = await getRequestParams(context);
        return getFieldLocale(source.messageI18n);
      },
    });
  },
});

// Massage Queries
export const MassageQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return validation messages list
    t.nonNull.list.nonNull.field('getValidationMessages', {
      type: 'Message',
      description: 'Should return validation messages list',
      resolve: async (): Promise<MessageModel[]> => {
        const messages = await getValidationMessages();
        return messages;
      },
    });
  },
});
