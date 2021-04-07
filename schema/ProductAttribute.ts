import { getAttributeReadableValue } from 'lib/productAttributesUtils';
import { objectType } from 'nexus';
import { AttributeModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_ATTRIBUTES } from 'db/collectionNames';
import { getRequestParams } from 'lib/sessionHelpers';

export const ProductAttribute = objectType({
  name: 'ProductAttribute',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.boolean('showInCard');
    t.nonNull.boolean('showAsBreadcrumb');
    t.nonNull.objectId('attributeId');
    t.nonNull.string('attributeSlug');
    t.nonNull.field('attributeViewVariant', {
      type: 'AttributeViewVariant',
    });
    t.nonNull.field('attributeVariant', {
      type: 'AttributeVariant',
    });
    t.nonNull.json('attributeNameI18n');
    t.json('textI18n');
    t.float('number');
    t.nonNull.list.nonNull.field('selectedOptionsSlugs', {
      type: 'String',
      description: 'List of selected options slug',
    });
    t.nonNull.list.nonNull.field('selectedOptions', {
      type: 'Option',
    });

    // ProductAttribute metric field resolver
    t.field('attributeMetric', {
      type: 'Metric',
      resolve: (source) => {
        return source.attributeMetric || null;
      },
    });

    // ProductAttribute name translation field resolver
    t.nonNull.field('attributeName', {
      type: 'String',
      resolve: async (source, _args, context) => {
        if (source.attributeName) {
          return source.attributeName;
        }

        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.attributeNameI18n);
      },
    });

    // ProductAttribute text translation field resolver
    t.nonNull.field('text', {
      type: 'String',
      resolve: async (source, _args, context) => {
        if (!source.textI18n) {
          return '';
        }
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.textI18n);
      },
    });

    // ProductAttribute attribute field resolver
    t.nonNull.field('attribute', {
      type: 'Attribute',
      resolve: async (source): Promise<AttributeModel> => {
        const db = await getDatabase();
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
        const attribute = await attributesCollection.findOne({ _id: source.attributeId });
        if (!attribute) {
          throw Error('Attribute not found in ProductAttribute');
        }
        return attribute;
      },
    });

    // ProductAttribute readableValue field resolver
    t.field('readableValue', {
      type: 'String',
      resolve: async (source, _args, context): Promise<string | null> => {
        if (source.readableValue) {
          return source.readableValue;
        }

        const { locale } = await getRequestParams(context);
        return getAttributeReadableValue({
          attribute: source,
          locale,
        });
      },
    });
  },
});
