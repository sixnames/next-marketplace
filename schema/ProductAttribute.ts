import { objectType } from 'nexus';
import { AttributeModel, AttributesGroupModel, OptionModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_ATTRIBUTES, COL_ATTRIBUTES_GROUPS } from 'db/collectionNames';
import { getRequestParams } from 'lib/sessionHelpers';

export const ProductAttribute = objectType({
  name: 'ProductAttribute',
  definition(t) {
    t.nonNull.boolean('showInCard');
    t.nonNull.boolean('showAsBreadcrumb');
    t.nonNull.objectId('attributeId');
    t.nonNull.objectId('attributesGroupId');
    t.nonNull.string('attributeSlug');
    t.json('textI18n');
    t.float('number');
    t.nonNull.list.nonNull.field('selectedOptionsSlugs', {
      type: 'String',
      description: 'List of selected options slug',
    });
    t.nonNull.list.nonNull.field('attributeSlugs', {
      type: 'String',
      description:
        'List of selected options slug combined with attribute slug in for of attributeSlug-optionSlug',
    });

    // ProductAttribute selectedOptions field resolver
    t.nonNull.list.nonNull.field('selectedOptions', {
      type: 'Option',
      resolve: async (_source): Promise<OptionModel[]> => {
        return [];
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
      resolve: async (_source, _args, _context): Promise<string | null> => {
        return '';
      },
    });

    // ProductAttributesGroup attributesGroup field Resolver
    t.nonNull.field('attributesGroup', {
      type: 'AttributesGroup',
      resolve: async (source): Promise<AttributesGroupModel> => {
        const db = await getDatabase();
        const attributesGroupsCollection = db.collection<AttributesGroupModel>(
          COL_ATTRIBUTES_GROUPS,
        );
        const attributesGroup = await attributesGroupsCollection.findOne({
          _id: source.attributesGroupId,
        });
        if (!attributesGroup) {
          throw Error('Attribute group not found in ProductAttribute');
        }
        return attributesGroup;
      },
    });
  },
});
