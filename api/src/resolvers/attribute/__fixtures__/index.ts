import { AttributeVariantEnum } from '../../../entities/Attribute';
import { ATTRIBUTE_VARIANT_SELECT, ATTRIBUTE_VARIANT_STRING } from '../../../config';

export const stringAttribute = {
  name: [
    { key: 'ru', value: 'string attribute' },
    { key: 'en', value: 'string attribute' },
  ],
  variant: ATTRIBUTE_VARIANT_STRING as AttributeVariantEnum,
  slug: 'string attribute',
};

export const selectAttribute = {
  name: [
    { key: 'ru', value: 'select attribute' },
    { key: 'en', value: 'select attribute' },
  ],
  variant: ATTRIBUTE_VARIANT_SELECT,
};

export const optionsGroupForAttribute = {
  name: [
    { key: 'ru', value: 'group' },
    { key: 'en', value: 'group' },
  ],
};

export const anotherOptionsGroupForAttribute = {
  name: [
    { key: 'ru', value: 'groupB' },
    { key: 'en', value: 'groupB' },
  ],
};
