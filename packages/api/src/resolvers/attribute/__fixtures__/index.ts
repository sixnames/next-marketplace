import { ATTRIBUTE_TYPE_SELECT, ATTRIBUTE_TYPE_STRING } from '@rg/config';
import { AttributeVariantEnum } from '../../../entities/Attribute';

export const stringAttribute = {
  name: [
    { key: 'ru', value: 'string attribute' },
    { key: 'en', value: 'string attribute' },
  ],
  variant: ATTRIBUTE_TYPE_STRING as AttributeVariantEnum,
  slug: 'string attribute',
};

export const selectAttribute = {
  name: [
    { key: 'ru', value: 'select attribute' },
    { key: 'en', value: 'select attribute' },
  ],
  variant: ATTRIBUTE_TYPE_SELECT,
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
