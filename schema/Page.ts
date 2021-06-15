import { PAGE_STATE_ENUMS } from 'config/common';
import { getRequestParams } from 'lib/sessionHelpers';
import { enumType, objectType } from 'nexus';

export const PageState = enumType({
  name: 'PageState',
  members: PAGE_STATE_ENUMS,
  description: 'Page state enum.',
});

export const Page = objectType({
  name: 'Page',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.int('index');
    t.nonNull.string('slug');
    t.nonNull.string('content');
    t.nonNull.objectId('pagesGroupId');
    t.nonNull.list.nonNull.string('assetKeys');
    t.nonNull.field('state', {
      type: 'PageState',
    });

    // Page name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });
  },
});
