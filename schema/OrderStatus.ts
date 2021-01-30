import { objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';

export const OrderStatus = objectType({
  name: 'OrderStatus',
  definition(t) {
    t.nonNull.objectId('_id');
    t.implements('Timestamp');
    t.nonNull.string('slug');
    t.nonNull.json('nameI18n');
    t.nonNull.string('color');

    // OrderStatus name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });
  },
});
