import {
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  ATTRIBUTE_TYPE_NUMBER,
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPE_STRING,
} from './common';

export const ME_AS_ADMIN = {
  id: 'adminBro',
  email: 'admin@gmail.com',
  password: 'admin',
  name: 'Admin',
  secondName: 'Secondname',
  lastName: 'Lastname',
  fullName: 'Admin Secondname Lastname',
  shortName: 'A. Lastname',
  phone: '+79990002233',
  isAdmin: true,
  isBookkeeper: false,
  isContractor: false,
  isDriver: false,
  isHelper: false,
  isLogistician: false,
  isManager: false,
  isStage: false,
  isWarehouse: false,
  isSuper: false,
};

export const MOCK_METRICS = [
  {
    name: [
      { key: 'ru', value: 'км/ч' },
      { key: 'en', value: 'km/h' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'мм' },
      { key: 'en', value: 'mm' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'шт.' },
      { key: 'en', value: 'units' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'м2' },
      { key: 'en', value: 'm2' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'мест' },
      { key: 'en', value: 'places' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'км' },
      { key: 'en', value: 'km' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'кВт' },
      { key: 'en', value: 'kw' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'руб.' },
      { key: 'en', value: 'rub.' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'лет' },
      { key: 'en', value: 'years' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'см' },
      { key: 'en', value: 'cm' },
    ],
  },
  {
    name: [
      { key: 'ru', value: '%' },
      { key: 'en', value: '%' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'м' },
      { key: 'en', value: 'm' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'часов' },
      { key: 'en', value: 'hours' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'кг' },
      { key: 'en', value: 'kg' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'чел.' },
      { key: 'en', value: 'people' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'м/с' },
      { key: 'en', value: 'm/s' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'год' },
      { key: 'en', value: 'year' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'мин.' },
      { key: 'en', value: 'minutes' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'ед.' },
      { key: 'en', value: 'units' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'мл.' },
      { key: 'en', value: 'ml' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'л/ч.' },
      { key: 'en', value: 'p/h' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'Hz' },
      { key: 'en', value: 'Hz' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'Вт' },
      { key: 'en', value: 'Wt' },
    ],
  },
  {
    name: [
      { key: 'ru', value: '°' },
      { key: 'en', value: '°' },
    ],
  },
  {
    name: [
      { key: 'ru', value: '°C' },
      { key: 'en', value: '°C' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'кд/м2' },
      { key: 'en', value: 'kd/m2' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'м3/ч' },
      { key: 'en', value: 'm3/h' },
    ],
  },
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
    { key: 'en', value: 'cy-test-colors-en' },
  ],
};
export const MOCK_OPTIONS_GROUP_FOR_DELETE = {
  name: [
    { key: 'ru', value: 'cy-test-group-for-delete' },
    { key: 'en', value: 'cy-test-group-for-delete-en' },
  ],
};

// Attributes
export const MOCK_ATTRIBUTE_MULTIPLE = {
  name: [
    { key: 'ru', value: 'cy-test-attribute-multiple' },
    { key: 'en', value: 'cy-test-attribute-multiple-en' },
  ],
  variant: ATTRIBUTE_TYPE_MULTIPLE_SELECT,
};
export const MOCK_ATTRIBUTE_SELECT = {
  name: [
    { key: 'ru', value: 'cy-test-attribute-select' },
    { key: 'en', value: 'cy-test-attribute-select-en' },
  ],
  variant: ATTRIBUTE_TYPE_SELECT,
};
export const MOCK_ATTRIBUTE_STRING = {
  name: [
    { key: 'ru', value: 'cy-test-attribute-string' },
    { key: 'en', value: 'cy-test-attribute-string-en' },
  ],
  variant: ATTRIBUTE_TYPE_STRING,
};
export const MOCK_ATTRIBUTE_NUMBER = {
  name: [
    { key: 'ru', value: 'cy-test-attribute-number' },
    { key: 'en', value: 'cy-test-attribute-number-en' },
  ],
  variant: ATTRIBUTE_TYPE_NUMBER,
};
export const MOCK_ATTRIBUTES_GROUP = {
  name: [
    { key: 'ru', value: 'cy-test-chair-features' },
    { key: 'en', value: 'cy-test-chair-features-en' },
  ],
};
export const MOCK_ATTRIBUTES_GROUP_FOR_DELETE = {
  name: [
    { key: 'ru', value: 'cy-test-group-for-delete' },
    { key: 'en', value: 'cy-test-group-for-delete-en' },
  ],
};
export const MOCK_ATTRIBUTES_GROUP_B = {
  name: [
    { key: 'ru', value: 'cy-test-group-b' },
    { key: 'en', value: 'cy-test-group-b-en' },
  ],
};

// Rubrics
export const MOCK_RUBRIC_TYPE_EQUIPMENT = {
  name: [
    { key: 'ru', value: 'cy-test-equipment' },
    { key: 'en', value: 'cy-test-equipment-en' },
  ],
};
export const MOCK_RUBRIC_TYPE_STAGE = {
  name: [
    { key: 'ru', value: 'cy-test-stage' },
    { key: 'en', value: 'cy-test-stage-en' },
  ],
};

export const MOCK_RUBRIC_LEVEL_ONE = {
  name: [
    { key: 'ru', value: 'cy-test-furniture' },
    { key: 'en', value: 'cy-test-furniture-en' },
  ],
  catalogueName: [
    { key: 'ru', value: 'furniture' },
    { key: 'en', value: 'furniture-en' },
  ],
  level: 1,
  parent: null,
};
export const MOCK_RUBRIC_LEVEL_TWO = {
  name: [
    { key: 'ru', value: 'cy-test-chairs' },
    { key: 'en', value: 'cy-test-chairs-en' },
  ],
  catalogueName: [
    { key: 'ru', value: 'chairs' },
    { key: 'en', value: 'chairs-en' },
  ],
  level: 2,
};
export const MOCK_RUBRIC_LEVEL_TWO_TABLES = {
  name: [
    { key: 'ru', value: 'cy-test-tables' },
    { key: 'en', value: 'cy-test-tables-en' },
  ],
  catalogueName: [
    { key: 'ru', value: 'tables' },
    { key: 'en', value: 'tables-en' },
  ],
  level: 2,
};
export const MOCK_RUBRIC_LEVEL_THREE = {
  name: [
    { key: 'ru', value: 'cy-test-chairs-loft' },
    { key: 'en', value: 'cy-test-chairs-loft-en' },
  ],
  catalogueName: [
    { key: 'ru', value: 'loft' },
    { key: 'en', value: 'loft-en' },
  ],
  level: 3,
};
export const MOCK_RUBRIC_LEVEL_THREE_B = {
  name: [
    { key: 'ru', value: 'cy-test-chairs-bar' },
    { key: 'en', value: 'cy-test-chairs-bar-en' },
  ],
  catalogueName: [
    { key: 'ru', value: 'bar' },
    { key: 'en', value: 'bar-en' },
  ],
  level: 3,
};
export const MOCK_RUBRIC_LEVEL_THREE_TABLES = {
  name: [
    { key: 'ru', value: 'cy-test-tables-loft' },
    { key: 'en', value: 'cy-test-tables-loft-en' },
  ],
  catalogueName: [
    { key: 'ru', value: 'loft' },
    { key: 'en', value: 'loft-en' },
  ],
  level: 3,
};
export const MOCK_RUBRIC_LEVEL_THREE_TABLES_B = {
  name: [
    { key: 'ru', value: 'cy-test-tables-bar' },
    { key: 'en', value: 'cy-test-tables-bar-en' },
  ],
  catalogueName: [
    { key: 'ru', value: 'bar' },
    { key: 'en', value: 'bar-en' },
  ],
  level: 3,
};

// Products
export const MOCK_PRODUCT = {
  name: [
    { key: 'ru', value: 'cy-test-product' },
    { key: 'en', value: 'cy-test-product-en' },
  ],
  cardName: [
    { key: 'ru', value: 'cy-test-product' },
    { key: 'en', value: 'cy-test-product-en' },
  ],
  price: 100,
  description: [
    { key: 'ru', value: 'very long item description' },
    { key: 'en', value: 'bar-en' },
  ],
};

export const MOCK_PRODUCT_FOR_DELETE = {
  name: [
    { key: 'ru', value: 'cy-test-product-for-delete' },
    { key: 'en', value: 'cy-test-product-for-delete-en' },
  ],
  cardName: [
    { key: 'ru', value: 'cy-test-product-for-delete' },
    { key: 'en', value: 'cy-test-product-for-delete-en' },
  ],
  price: 200,
  description: [
    { key: 'ru', value: 'very long item description' },
    { key: 'en', value: 'bar-en' },
  ],
};

export const MOCK_PRODUCT_B_PRODUCT = {
  name: [
    { key: 'ru', value: 'cy-test-b-product' },
    { key: 'en', value: 'cy-test-b-product-en' },
  ],
  cardName: [
    { key: 'ru', value: 'cy-test-b-product' },
    { key: 'en', value: 'cy-test-b-product-en' },
  ],
  price: 100,
  description: [
    { key: 'ru', value: 'B description' },
    { key: 'en', value: 'bar-en' },
  ],
};

export const MOCK_PRODUCT_NEW_PRODUCT = {
  name: [
    { key: 'ru', value: 'cy-test-new-product' },
    { key: 'en', value: 'cy-test-new-product-en' },
  ],
  cardName: [
    { key: 'ru', value: 'cy-test-new-product' },
    { key: 'en', value: 'cy-test-new-product-en' },
  ],
  price: 2000,
  description: [
    { key: 'ru', value: 'new description' },
    { key: 'en', value: 'bar-en' },
  ],
};
