import {
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  ATTRIBUTE_TYPE_NUMBER,
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPE_STRING,
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
  RUBRIC_LEVEL_ONE,
  RUBRIC_LEVEL_THREE,
  RUBRIC_LEVEL_TWO,
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
export const MOCK_OPTIONS_WINE_COLOR = [
  {
    name: [
      { key: 'ru', value: 'Белый' },
      { key: 'en', value: 'White' },
    ],
    slug: 'beliy',
    color: 'ffffff',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: 'ru', value: 'Белая' },
          { key: 'en', value: 'White' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: 'ru', value: 'Белый' },
          { key: 'en', value: 'White' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: 'ru', value: 'Белое' },
          { key: 'en', value: 'White' },
        ],
      },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'Красный' },
      { key: 'en', value: 'Red' },
    ],
    slug: 'krasniy',
    color: '99020b',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: 'ru', value: 'Красная' },
          { key: 'en', value: 'Red' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: 'ru', value: 'Красный' },
          { key: 'en', value: 'Red' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: 'ru', value: 'Красное' },
          { key: 'en', value: 'Red' },
        ],
      },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'Розовый' },
      { key: 'en', value: 'Pink' },
    ],
    slug: 'rozoviy',
    color: 'db8ce0',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: 'ru', value: 'Розовая' },
          { key: 'en', value: 'Pink' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: 'ru', value: 'Розовый' },
          { key: 'en', value: 'Pink' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: 'ru', value: 'Розовое' },
          { key: 'en', value: 'Pink' },
        ],
      },
    ],
  },
];

export const MOCK_OPTIONS_WINE_TYPE = [
  {
    name: [
      { key: 'ru', value: 'Портвейн' },
      { key: 'en', value: 'Port_wine' },
    ],
    slug: 'portvein',
    gender: GENDER_HE,
  },
  {
    name: [
      { key: 'ru', value: 'Херес' },
      { key: 'en', value: 'Heres' },
    ],
    slug: 'heres',
    gender: GENDER_HE,
  },
  {
    name: [
      { key: 'ru', value: 'Вермут' },
      { key: 'en', value: 'Vermut' },
    ],
    slug: 'varmut',
    gender: GENDER_HE,
  },
  {
    name: [
      { key: 'ru', value: 'Крепленое' },
      { key: 'en', value: 'Hard' },
    ],
    slug: 'kreplenoe',
    gender: GENDER_IT,
  },
];

export const MOCK_OPTIONS_GROUP_COLORS = {
  name: [
    { key: 'ru', value: 'Цвета' },
    { key: 'en', value: 'Colors' },
  ],
};

export const MOCK_OPTIONS_GROUP_WINE_TYPES = {
  name: [
    { key: 'ru', value: 'Типы_вина' },
    { key: 'en', value: 'Wine_types' },
  ],
};

// Attributes
export const MOCK_ATTRIBUTE_WINE_COLOR = {
  name: [
    { key: 'ru', value: 'Цвет_вина' },
    { key: 'en', value: 'Wine_color' },
  ],
  slug: 'tsvet_vina',
  variant: ATTRIBUTE_TYPE_MULTIPLE_SELECT,
};

export const MOCK_ATTRIBUTE_WINE_TYPE = {
  name: [
    { key: 'ru', value: 'Тип_вина' },
    { key: 'en', value: 'Wine_type' },
  ],
  slug: 'tip_vina',
  variant: ATTRIBUTE_TYPE_SELECT,
};

export const MOCK_ATTRIBUTE_STRING = {
  name: [
    { key: 'ru', value: 'Атрибут_строка' },
    { key: 'en', value: 'Attribute_string' },
  ],
  slug: 'attribute_stroka',
  variant: ATTRIBUTE_TYPE_STRING,
};

export const MOCK_ATTRIBUTE_NUMBER = {
  name: [
    { key: 'ru', value: 'Атрибут_число' },
    { key: 'en', value: 'Attribute_number' },
  ],
  slug: 'attribute_chislo',
  variant: ATTRIBUTE_TYPE_NUMBER,
};

export const MOCK_ATTRIBUTES_GROUP_WINE_FEATURES = {
  name: [
    { key: 'ru', value: 'Характеристики_вина' },
    { key: 'en', value: 'Wine_features' },
  ],
};

export const MOCK_ATTRIBUTES_GROUP_FOR_DELETE = {
  name: [
    { key: 'ru', value: 'Группа_атрибутов_для_удаления' },
    { key: 'en', value: 'Group_for_delete' },
  ],
};

export const MOCK_ATTRIBUTES_GROUP_WHISKEY_FEATURES = {
  name: [
    { key: 'ru', value: 'Характеристики_виски' },
    { key: 'en', value: 'Whiskey_features' },
  ],
};

// Rubrics
export const MOCK_RUBRIC_TYPE_ALCOHOL = {
  name: [
    { key: 'ru', value: 'Алкоголь' },
    { key: 'en', value: 'Alcohol' },
  ],
};

export const MOCK_RUBRIC_TYPE_JUICE = {
  name: [
    { key: 'ru', value: 'Соки' },
    { key: 'en', value: 'Juice' },
  ],
};

export const MOCK_RUBRIC_LEVEL_ONE = {
  name: [
    { key: 'ru', value: 'Вино' },
    { key: 'en', value: 'Wine' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: 'ru', value: 'Купить вино' },
      { key: 'en', value: 'Buy a wine' },
    ],
    prefix: [
      { key: 'ru', value: 'Купить' },
      { key: 'en', value: 'Buy a' },
    ],
    keyword: [
      { key: 'ru', value: 'вино' },
      { key: 'en', value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_ONE,
  parent: null,
};

export const MOCK_RUBRIC_LEVEL_TWO_A = {
  name: [
    { key: 'ru', value: 'Второй_уровень_1' },
    { key: 'en', value: 'Second_level_1' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: 'ru', value: 'Второй уровень 1' },
      { key: 'en', value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: 'ru', value: 'Второй уровень 1' },
      { key: 'en', value: 'wine' },
    ],
    gender: GENDER_SHE,
  },
  level: RUBRIC_LEVEL_TWO,
};

export const MOCK_RUBRIC_LEVEL_TWO_B = {
  name: [
    { key: 'ru', value: 'Второй_уровень_2' },
    { key: 'en', value: 'Second_level_2' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: 'ru', value: 'Второй уровень 2' },
      { key: 'en', value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: 'ru', value: 'Второй уровень 2' },
      { key: 'en', value: 'wine' },
    ],
    gender: GENDER_HE,
  },
  level: RUBRIC_LEVEL_TWO,
};

export const MOCK_RUBRIC_LEVEL_THREE_A_A = {
  name: [
    { key: 'ru', value: 'Третий_уровень_1_1' },
    { key: 'en', value: 'Third_level_1_1' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: 'ru', value: 'Третий уровень 1_1' },
      { key: 'en', value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: 'ru', value: 'Третий уровень 1_1' },
      { key: 'en', value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
};

export const MOCK_RUBRIC_LEVEL_THREE_A_B = {
  name: [
    { key: 'ru', value: 'Третий_уровень_1_2' },
    { key: 'en', value: 'Third_level_1_2' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: 'ru', value: 'Третий уровень 1_2' },
      { key: 'en', value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: 'ru', value: 'Третий уровень 1_2' },
      { key: 'en', value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
};

export const MOCK_RUBRIC_LEVEL_THREE_B_A = {
  name: [
    { key: 'ru', value: 'Третий_уровень_2_1' },
    { key: 'en', value: 'Third_level_2_1' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: 'ru', value: 'Третий уровень 2_1' },
      { key: 'en', value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: 'ru', value: 'Третий уровень 2_1' },
      { key: 'en', value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
};

export const MOCK_RUBRIC_LEVEL_THREE_B_B = {
  name: [
    { key: 'ru', value: 'Третий_уровень_2_2' },
    { key: 'en', value: 'Third_level_2_2' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: 'ru', value: 'Третий уровень 2_2' },
      { key: 'en', value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: 'ru', value: 'Третий уровень 2_2' },
      { key: 'en', value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
};

// Products
export const MOCK_PRODUCT_A = {
  name: [
    { key: 'ru', value: 'Вино_Brancott_Estate' },
    { key: 'en', value: 'Wine_Brancott_Estate' },
  ],
  cardName: [
    { key: 'ru', value: 'Вино Brancott Estate Marlborough Sauvignon Blanc' },
    { key: 'en', value: 'Wine Brancott Estate Marlborough Sauvignon Blanc' },
  ],
  price: 100,
  description: [
    { key: 'ru', value: 'Очень длинное описание товара' },
    { key: 'en', value: 'Very long product description' },
  ],
};

export const MOCK_PRODUCT_B = {
  name: [
    { key: 'ru', value: 'Вино_Campo_Viejо' },
    { key: 'en', value: 'Wine_Campo_Viejо' },
  ],
  cardName: [
    { key: 'ru', value: 'Вино Campo Viejо Tempranillo Rioja DOC' },
    { key: 'en', value: 'Wine Campo Viejо Tempranillo Rioja DOC' },
  ],
  price: 200,
  description: [
    { key: 'ru', value: 'Очень длинное описание товара' },
    { key: 'en', value: 'Very long product description' },
  ],
};

export const MOCK_PRODUCT_C = {
  name: [
    { key: 'ru', value: 'Вино_Val_de_Vie' },
    { key: 'en', value: 'Wine_Val_de_Vie' },
  ],
  cardName: [
    { key: 'ru', value: 'Вино Val de Vie, "Barista" Pinotage' },
    { key: 'en', value: 'Wine Val de Vie, "Barista" Pinotage' },
  ],
  price: 50,
  description: [
    { key: 'ru', value: 'Очень длинное описание товара' },
    { key: 'en', value: 'Very long product description' },
  ],
};

export const MOCK_PRODUCT_NEW = {
  name: [
    { key: 'ru', value: 'Вино_Sogrape_Vinhos' },
    { key: 'en', value: 'Wine_Sogrape_Vinhos' },
  ],
  cardName: [
    { key: 'ru', value: 'Вино Sogrape Vinhos, Gazela Vinho Verde DOC' },
    { key: 'en', value: 'Wine Sogrape Vinhos, Gazela Vinho Verde DOC' },
  ],
  price: 2000,
  description: [
    { key: 'ru', value: 'Очень длинное описание товара' },
    { key: 'en', value: 'Very long product description' },
  ],
};

export const MOCK_PRODUCT_CREATE = {
  name: [
    { key: 'ru', value: 'Вино_Luis_Felipe_Edwards' },
    { key: 'en', value: 'Wine_Luis_Felipe_Edwards' },
  ],
  cardName: [
    { key: 'ru', value: 'Вино Luis Felipe Edwards, "Reserva" Shiraz' },
    { key: 'en', value: 'Вино Luis Felipe Edwards, "Reserva" Shiraz' },
  ],
  price: 2000,
  description: [
    { key: 'ru', value: 'Очень длинное описание товара' },
    { key: 'en', value: 'Very long product description' },
  ],
};
