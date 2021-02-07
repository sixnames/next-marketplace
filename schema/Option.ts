import { objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';

export const OptionVariant = objectType({
  name: 'OptionVariant',
  definition(t) {
    t.nonNull.json('value');
    t.nonNull.field('gender', {
      type: 'Gender',
    });
  },
});

export const Option = objectType({
  name: 'Option',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('slug');
    t.nonNull.json('nameI18n');
    t.string('color');
    t.string('icon');
    t.list.nonNull.field('variants', {
      type: 'OptionVariant',
    });
    t.nonNull.list.nonNull.field('options', {
      type: 'Option',
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
