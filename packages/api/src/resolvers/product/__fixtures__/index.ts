import { DEFAULT_LANG, SECONDARY_LANG } from '@yagu/shared';

export const testProduct = {
  name: [
    { key: DEFAULT_LANG, value: 'new_product' },
    { key: SECONDARY_LANG, value: 'new_product' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'new_product' },
    { key: SECONDARY_LANG, value: 'new_product' },
  ],
  originalName: 'new_product',
  price: 200,
  description: [
    { key: DEFAULT_LANG, value: 'very long item description' },
    { key: SECONDARY_LANG, value: 'bar' },
  ],
};

export const anotherProduct = {
  name: [
    { key: DEFAULT_LANG, value: 'another_product' },
    { key: SECONDARY_LANG, value: 'another_product' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'another_product' },
    { key: SECONDARY_LANG, value: 'another_product' },
  ],
  originalName: 'another_product',
  price: 200,
  description: [
    { key: DEFAULT_LANG, value: 'very long item description' },
    { key: SECONDARY_LANG, value: 'bar' },
  ],
};

export const rubricForProduct = {
  name: 'rubric',
  catalogueName: 'rubric',
};
