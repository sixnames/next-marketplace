import { getRequestParams } from 'lib/sessionHelpers';
import { objectType } from 'nexus';

export const RubricOption = objectType({
  name: 'RubricOption',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('slug');
    t.nonNull.json('nameI18n');
    t.string('color');
    t.string('icon');
    t.nonNull.json('views');
    t.nonNull.json('priorities');
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

export const RubricAttribute = objectType({
  name: 'RubricAttribute',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.boolean('showInCatalogueFilter');
    t.nonNull.boolean('showInCatalogueNav');
    t.nonNull.json('nameI18n');
    t.string('slug');
    t.objectId('optionsGroupId');
    t.nonNull.json('views');
    t.nonNull.json('priorities');
    t.json('positioningInTitle');
    t.nonNull.list.nonNull.field('options', {
      type: 'RubricOption',
    });
    t.nonNull.field('variant', {
      type: 'AttributeVariant',
    });
    t.nonNull.field('viewVariant', {
      type: 'AttributeViewVariant',
    });
    t.field('metric', {
      type: 'Metric',
    });
  },
});

export const RubricAttributesGroup = objectType({
  name: 'RubricAttributesGroup',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.list.nonNull.objectId('attributesIds');
    t.nonNull.list.nonNull.field('attributes', {
      type: 'RubricAttribute',
    });

    // AttributesGroup name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });
  },
});
