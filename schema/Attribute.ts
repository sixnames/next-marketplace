import { enumType, objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import {
  ATTRIBUTE_VARIANTS_ENUMS,
  ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  ATTRIBUTE_VIEW_VARIANTS_ENUMS,
} from 'config/common';
import { OptionsGroupModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_OPTIONS_GROUPS } from 'db/collectionNames';

export const AttributeVariant = enumType({
  name: 'AttributeVariant',
  members: ATTRIBUTE_VARIANTS_ENUMS,
  description: 'Attribute variant enum.',
});

export const AttributePositionInTitle = enumType({
  name: 'AttributePositionInTitle',
  members: ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  description: 'Attribute position in catalogue title enum.',
});

export const AttributeViewVariant = enumType({
  name: 'AttributeViewVariant',
  members: ATTRIBUTE_VIEW_VARIANTS_ENUMS,
  description: 'Attribute view in product card variant enum.',
});

export const Attribute = objectType({
  name: 'Attribute',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.string('slug');
    t.boolean('capitalise');
    t.boolean('notShowAsAlphabet');
    t.objectId('optionsGroupId');
    t.json('positioningInTitle');
    t.nonNull.field('variant', {
      type: 'AttributeVariant',
    });
    t.nonNull.field('viewVariant', {
      type: 'AttributeViewVariant',
    });
    t.field('metric', {
      type: 'Metric',
    });

    // Attribute name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // Attribute optionsGroup field resolver
    t.field('optionsGroup', {
      type: 'OptionsGroup',
      resolve: async (source): Promise<OptionsGroupModel | null> => {
        if (!source.optionsGroupId) {
          return null;
        }
        const { db } = await getDatabase();
        const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
        const optionsGroup = await optionsGroupsCollection.findOne({ _id: source.optionsGroupId });
        return optionsGroup;
      },
    });
  },
});
