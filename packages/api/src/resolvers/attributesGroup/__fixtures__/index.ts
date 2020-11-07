import { ATTRIBUTE_VARIANT_STRING, DEFAULT_LANG } from '@yagu/config';

export const attributesGroup = {
  name: [{ key: DEFAULT_LANG, value: 'group_name' }],
};

export const anotherAttributesGroup = {
  name: [{ key: DEFAULT_LANG, value: 'group_another_name' }],
};

export const attributeForGroup = {
  name: [{ key: DEFAULT_LANG, value: 'attributes_group_name' }],
  variant: ATTRIBUTE_VARIANT_STRING,
};
