export const MOCK_METRICS = [
  { name: 'км/ч' },
  { name: 'мм' },
  { name: 'шт.' },
  { name: 'м2' },
  { name: 'мест' },
  { name: 'км' },
  { name: 'кВт' },
  { name: 'руб.' },
  { name: 'лет' },
  { name: 'см' },
  { name: '%' },
  { name: 'м' },
  { name: 'часов' },
  { name: 'кг' },
  { name: 'чел.' },
  { name: 'м/с' },
  { name: 'год' },
  { name: 'мин.' },
  { name: 'р.' },
  { name: 'году' },
  { name: 'ед.' },
  { name: 'мл.' },
  { name: 'л/ч.' },
  { name: 'Hz' },
  { name: 'Вт' },
  { name: '°' },
  { name: '°C' },
  { name: 'кд/м2' },
  { name: 'м3/ч' },
];

// Options
export const MOCK_OPTIONS = [
  {
    name: [
      { key: 'ru', value: 'cy-test-gray' },
      { key: 'en', value: 'cy-test-gray' },
    ],
    color: '999999',
  },
  {
    name: [
      { key: 'ru', value: 'cy-test-red' },
      { key: 'en', value: 'cy-test-red' },
    ],
    color: '99020b',
  },
  {
    name: [
      { key: 'ru', value: 'cy-test-green' },
      { key: 'en', value: 'cy-test-green' },
    ],
    color: '1a9904',
  },
];

export const MOCK_OPTIONS_GROUP = {
  name: [
    { key: 'ru', value: 'cy-test-colors' },
    { key: 'en', value: 'cy-test-colors' },
  ],
};
export const MOCK_OPTIONS_GROUP_FOR_DELETE = {
  name: [
    { key: 'ru', value: 'cy-test-group-for-delete' },
    { key: 'en', value: 'cy-test-group-for-delete' },
  ],
};

// Attributes
export const MOCK_ATTRIBUTE_MULTIPLE = {
  name: 'cy-test-attribute-multiple',
  type: 'multipleSelect',
};
export const MOCK_ATTRIBUTE_SELECT = {
  name: 'cy-test-attribute-select',
  type: 'select',
};
export const MOCK_ATTRIBUTE_STRING = {
  name: 'cy-test-attribute-string',
  type: 'string',
};
export const MOCK_ATTRIBUTE_NUMBER = {
  name: 'cy-test-attribute-number',
  type: 'number',
};
export const MOCK_ATTRIBUTES_GROUP = { name: 'cy-test-chair-features' };
export const MOCK_ATTRIBUTES_GROUP_FOR_DELETE = { name: 'cy-test-group-for-delete' };
export const MOCK_ATTRIBUTES_GROUP_B = { name: 'cy-test-group-b' };

// Rubrics
export const MOCK_RUBRIC_TYPE_EQUIPMENT = { name: 'cy-test-equipment' };
export const MOCK_RUBRIC_TYPE_STAGE = { name: 'cy-test-stage' };

export const MOCK_RUBRIC_LEVEL_ONE = {
  name: [
    { key: 'ru', value: 'cy-test-furniture' },
    { key: 'en', value: 'cy-test-furniture' },
  ],
  catalogueName: [
    { key: 'ru', value: 'furniture' },
    { key: 'en', value: 'furniture' },
  ],
  level: 1,
  parent: null,
};
export const MOCK_RUBRIC_LEVEL_TWO = {
  name: [
    { key: 'ru', value: 'cy-test-chairs' },
    { key: 'en', value: 'cy-test-chairs' },
  ],
  catalogueName: [
    { key: 'ru', value: 'chairs' },
    { key: 'en', value: 'chairs' },
  ],
  level: 2,
};
export const MOCK_RUBRIC_LEVEL_TWO_TABLES = {
  name: [
    { key: 'ru', value: 'cy-test-tables' },
    { key: 'en', value: 'cy-test-tables' },
  ],
  catalogueName: [
    { key: 'ru', value: 'tables' },
    { key: 'en', value: 'tables' },
  ],
  level: 2,
};
export const MOCK_RUBRIC_LEVEL_THREE = {
  name: [
    { key: 'ru', value: 'cy-test-chairs-loft' },
    { key: 'en', value: 'cy-test-chairs-loft' },
  ],
  catalogueName: [
    { key: 'ru', value: 'loft' },
    { key: 'en', value: 'loft' },
  ],
  level: 3,
};
export const MOCK_RUBRIC_LEVEL_THREE_B = {
  name: [
    { key: 'ru', value: 'cy-test-chairs-bar' },
    { key: 'en', value: 'cy-test-chairs-bar' },
  ],
  catalogueName: [
    { key: 'ru', value: 'bar' },
    { key: 'en', value: 'bar' },
  ],
  level: 3,
};
export const MOCK_RUBRIC_LEVEL_THREE_TABLES = {
  name: [
    { key: 'ru', value: 'cy-test-tables-loft' },
    { key: 'en', value: 'cy-test-tables-loft' },
  ],
  catalogueName: [
    { key: 'ru', value: 'loft' },
    { key: 'en', value: 'loft' },
  ],
  level: 3,
};
export const MOCK_RUBRIC_LEVEL_THREE_TABLES_B = {
  name: [
    { key: 'ru', value: 'cy-test-tables-bar' },
    { key: 'en', value: 'cy-test-tables-bar' },
  ],
  catalogueName: [
    { key: 'ru', value: 'bar' },
    { key: 'en', value: 'bar' },
  ],
  level: 3,
};

// Products
export const MOCK_PRODUCT_IMAGES = [
  './cypress/fixtures/test-image-1.jpg',
  './cypress/fixtures/test-image-2.jpg',
];

export const MOCK_PRODUCT = {
  name: 'cy-test-product',
  cardName: 'cy-test-product',
  price: 100,
  description: 'very long item description',
};

export const MOCK_PRODUCT_FOR_DELETE = {
  name: 'cy-test-product-for-delete',
  cardName: 'cy-test-product-for-delete',
  price: 200,
  description: 'very long item description',
};

export const MOCK_PRODUCT_B_PRODUCT = {
  name: 'cy-test-b-product',
  cardName: 'cy-test-b-product',
  price: 100,
  description: 'B description',
};

export const MOCK_PRODUCT_NEW_PRODUCT = {
  name: 'cy-test-new-product',
  cardName: 'cy-test-new-product',
  price: 2000,
  description: 'new description',
};
