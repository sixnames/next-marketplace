import { objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';

export const Option = objectType({
  name: 'Option',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('slug');
    t.nonNull.json('nameI18n');
    t.string('color');
    t.string('icon');
    t.nonNull.json('variants');
    t.field('gender', {
      type: 'Gender',
    });

    // Option name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });
  },
});
