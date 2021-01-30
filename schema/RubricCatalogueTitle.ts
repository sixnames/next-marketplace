import { objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';

export const RubricCatalogueTitle = objectType({
  name: 'RubricCatalogueTitle',
  definition(t) {
    t.nonNull.json('defaultTitleI18n');
    t.json('prefixI18n');
    t.nonNull.json('keywordI18n');
    t.nonNull.field('gender', {
      type: 'Gender',
    });

    // RubricCatalogueTitle defaultTitle translation field resolver
    t.nonNull.field('defaultTitle', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.defaultTitleI18n);
      },
    });

    // RubricCatalogueTitle prefix translation field resolver
    t.field('prefix', {
      type: 'String',
      resolve: async (source, _args, context) => {
        if (!source.prefixI18n) {
          return null;
        }
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.prefixI18n);
      },
    });

    // RubricCatalogueTitle keyword translation field resolver
    t.nonNull.field('keyword', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.keywordI18n);
      },
    });
  },
});
