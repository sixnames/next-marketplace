import { enumType, objectType } from 'nexus';
import {
  ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  ATTRIBUTE_VARIANTS_ENUMS,
  ATTRIBUTE_VIEW_VARIANTS_ENUMS,
} from '../config/common';

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
  },
});
