import { DEFAULT_LANG, SECONDARY_LANG } from '@yagu/shared';

export const testRubric = {
  name: 'new_rubric',
  catalogueName: 'name',
};

export const anotherRubric = {
  name: 'new_another_rubric',
  catalogueName: 'another_name',
};

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
