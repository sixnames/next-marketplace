import { AttributeVariantEnum } from '../../../entities/Attribute';
import {
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_LANG,
  SECONDARY_LANG,
} from '@yagu/config';

export const stringAttribute = {
  name: [
    { key: DEFAULT_LANG, value: 'string attribute' },
    { key: SECONDARY_LANG, value: 'string attribute' },
  ],
  views: [],
  priorities: [],
  variant: ATTRIBUTE_VARIANT_STRING as AttributeVariantEnum,
  slug: 'string attribute',
};

export const selectAttribute = {
  name: [
    { key: DEFAULT_LANG, value: 'select attribute' },
    { key: SECONDARY_LANG, value: 'select attribute' },
  ],
  views: [],
  priorities: [],
  variant: ATTRIBUTE_VARIANT_SELECT,
};

export const optionsGroupForAttribute = {
  name: [
    { key: DEFAULT_LANG, value: 'group' },
    { key: SECONDARY_LANG, value: 'group' },
  ],
};

export const anotherOptionsGroupForAttribute = {
  name: [
    { key: DEFAULT_LANG, value: 'groupB' },
    { key: SECONDARY_LANG, value: 'groupB' },
  ],
};
