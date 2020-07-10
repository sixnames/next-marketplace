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
      { key: 'ru', value: 'gray' },
      { key: 'en', value: 'gray_en' },
    ],
    slug: 'gray',
    color: '999999',
  },
  {
    name: [
      { key: 'ru', value: 'red' },
      { key: 'en', value: 'red_en' },
    ],
    slug: 'red',
    color: '99020b',
  },
  {
    name: [
      { key: 'ru', value: 'green' },
      { key: 'en', value: 'green_en' },
    ],
    slug: 'green',
    color: '1a9904',
  },
];

export const MOCK_OPTIONS_GROUP = {
  name: [
    { key: 'ru', value: 'colors' },
    { key: 'en', value: 'colors_en' },
  ],
};

export const MOCK_OPTIONS_GROUP_FOR_DELETE = {
  name: [
    { key: 'ru', value: 'group_for_delete' },
    { key: 'en', value: 'group_for_delete_en' },
  ],
};

// Attributes
export const MOCK_ATTRIBUTE_MULTIPLE = {
  name: [
    { key: 'ru', value: 'attribute_multiple' },
    { key: 'en', value: 'attribute_multiple_en' },
  ],
  slug: 'attribute_multiple',
  variant: ATTRIBUTE_TYPE_MULTIPLE_SELECT,
};

export const MOCK_ATTRIBUTE_SELECT = {
  name: [
    { key: 'ru', value: 'attribute_select' },
    { key: 'en', value: 'attribute_select_en' },
  ],
  slug: 'attribute_select',
  variant: ATTRIBUTE_TYPE_SELECT,
};

export const MOCK_ATTRIBUTE_STRING = {
  name: [
    { key: 'ru', value: 'attribute_string' },
    { key: 'en', value: 'attribute_string_en' },
  ],
  slug: 'attribute_string',
  variant: ATTRIBUTE_TYPE_STRING,
};

export const MOCK_ATTRIBUTE_NUMBER = {
  name: [
    { key: 'ru', value: 'attribute_number' },
    { key: 'en', value: 'attribute_number_en' },
  ],
  slug: 'attribute_number',
  variant: ATTRIBUTE_TYPE_NUMBER,
};

export const MOCK_ATTRIBUTES_GROUP = {
  name: [
    { key: 'ru', value: 'wine_features' },
    { key: 'en', value: 'wine_features_en' },
  ],
};

export const MOCK_ATTRIBUTES_GROUP_FOR_DELETE = {
  name: [
    { key: 'ru', value: 'group_for_delete' },
    { key: 'en', value: 'group_for_delete_en' },
  ],
};

export const MOCK_ATTRIBUTES_GROUP_B = {
  name: [
    { key: 'ru', value: 'group_b' },
    { key: 'en', value: 'group_b_en' },
  ],
};

// Rubrics
export const MOCK_RUBRIC_TYPE_EQUIPMENT = {
  name: [
    { key: 'ru', value: 'alcohol' },
    { key: 'en', value: 'alcohol_en' },
  ],
};

export const MOCK_RUBRIC_TYPE_STAGE = {
  name: [
    { key: 'ru', value: 'light' },
    { key: 'en', value: 'light_en' },
  ],
};

export const MOCK_RUBRIC_LEVEL_ONE = {
  name: [
    { key: 'ru', value: 'wine' },
    { key: 'en', value: 'wine_en' },
  ],
  catalogueName: [
    { key: 'ru', value: 'wine' },
    { key: 'en', value: 'wine_en' },
  ],
  level: 1,
  parent: null,
};

export const MOCK_RUBRIC_LEVEL_TWO = {
  name: [
    { key: 'ru', value: 'light_wine' },
    { key: 'en', value: 'light_wine_en' },
  ],
  catalogueName: [
    { key: 'ru', value: 'light wine' },
    { key: 'en', value: 'light wine_en' },
  ],
  level: 2,
};

export const MOCK_RUBRIC_LEVEL_TWO_TABLES = {
  name: [
    { key: 'ru', value: 'port' },
    { key: 'en', value: 'port_en' },
  ],
  catalogueName: [
    { key: 'ru', value: 'port' },
    { key: 'en', value: 'port_en' },
  ],
  level: 2,
};

export const MOCK_RUBRIC_LEVEL_THREE = {
  name: [
    { key: 'ru', value: 'light_loft' },
    { key: 'en', value: 'light_loft_en' },
  ],
  catalogueName: [
    { key: 'ru', value: 'light loft' },
    { key: 'en', value: 'loft_en' },
  ],
  level: 3,
};

export const MOCK_RUBRIC_LEVEL_THREE_B = {
  name: [
    { key: 'ru', value: 'light_bar' },
    { key: 'en', value: 'light_bar_en' },
  ],
  catalogueName: [
    { key: 'ru', value: 'light bar' },
    { key: 'en', value: 'bar_en' },
  ],
  level: 3,
};

export const MOCK_RUBRIC_LEVEL_THREE_TABLES = {
  name: [
    { key: 'ru', value: 'port_loft' },
    { key: 'en', value: 'port_loft_en' },
  ],
  catalogueName: [
    { key: 'ru', value: 'tables loft' },
    { key: 'en', value: 'loft_en' },
  ],
  level: 3,
};

export const MOCK_RUBRIC_LEVEL_THREE_TABLES_B = {
  name: [
    { key: 'ru', value: 'port_bar' },
    { key: 'en', value: 'port_bar_en' },
  ],
  catalogueName: [
    { key: 'ru', value: 'port bar' },
    { key: 'en', value: 'bar_en' },
  ],
  level: 3,
};

// Products
export const MOCK_PRODUCT = {
  name: [
    { key: 'ru', value: 'product' },
    { key: 'en', value: 'product_en' },
  ],
  cardName: [
    { key: 'ru', value: 'product' },
    { key: 'en', value: 'product_en' },
  ],
  price: 100,
  description: [
    { key: 'ru', value: 'very long item description' },
    { key: 'en', value: 'bar_en' },
  ],
};

export const MOCK_PRODUCT_FOR_DELETE = {
  name: [
    { key: 'ru', value: 'product_for_delete' },
    { key: 'en', value: 'product_for_delete_en' },
  ],
  cardName: [
    { key: 'ru', value: 'product_for_delete' },
    { key: 'en', value: 'product_for_delete_en' },
  ],
  price: 200,
  description: [
    { key: 'ru', value: 'very long item description' },
    { key: 'en', value: 'bar_en' },
  ],
};

export const MOCK_PRODUCT_B_PRODUCT = {
  name: [
    { key: 'ru', value: 'b_product' },
    { key: 'en', value: 'b_product_en' },
  ],
  cardName: [
    { key: 'ru', value: 'b_product' },
    { key: 'en', value: 'b_product_en' },
  ],
  price: 100,
  description: [
    { key: 'ru', value: 'description B' },
    { key: 'en', value: 'bar_en' },
  ],
};

export const MOCK_PRODUCT_NEW_PRODUCT = {
  name: [
    { key: 'ru', value: 'new_product' },
    { key: 'en', value: 'new_product_en' },
  ],
  cardName: [
    { key: 'ru', value: 'new_product' },
    { key: 'en', value: 'new_product_en' },
  ],
  price: 2000,
  description: [
    { key: 'ru', value: 'new description' },
    { key: 'en', value: 'bar_en' },
  ],
};

export const MOCK_PRODUCT_CREATE_PRODUCT = {
  name: [
    { key: 'ru', value: 'create_product' },
    { key: 'en', value: 'create_product_en' },
  ],
  cardName: [
    { key: 'ru', value: 'create_product' },
    { key: 'en', value: 'create_product_en' },
  ],
  price: 2000,
  description: [
    { key: 'ru', value: 'create description' },
    { key: 'en', value: 'bar_en' },
  ],
};
