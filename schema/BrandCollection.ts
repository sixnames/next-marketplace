import { objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';

export const BrandCollection = objectType({
  name: 'BrandCollection',
  definition(t) {
    t.implements('Base');
    t.implements('Timestamp');
    t.nonNull.string('slug');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');

    // BrandCollection name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // BrandCollection description translation field resolver
    t.field('description', {
      type: 'String',
      resolve: async (source, _args, context) => {
        if (!source.descriptionI18n) {
          return null;
        }
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.descriptionI18n);
      },
    });
  },
});
