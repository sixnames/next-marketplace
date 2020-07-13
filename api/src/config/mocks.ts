import {
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  ATTRIBUTE_TYPE_NUMBER,
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPE_STRING,
  RUBRIC_LEVEL_ONE,
  RUBRIC_LEVEL_THREE,
  RUBRIC_LEVEL_TWO,
} from './common';

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
  },
  {
    name: [
      { key: 'ru', value: 'Красный' },
      { key: 'en', value: 'Red' },
    ],
    slug: 'krasniy',
    color: '99020b',
  },
  {
    name: [
      { key: 'ru', value: 'Розовый' },
      { key: 'en', value: 'Pink' },
    ],
    slug: 'rozoviy',
    color: 'db8ce0',
  },
];

export const MOCK_OPTIONS_WINE_TYPE = [
  {
    name: [
      { key: 'ru', value: 'Портвейн' },
      { key: 'en', value: 'Port_wine' },
    ],
    slug: 'portvein',
  },
  {
    name: [
      { key: 'ru', value: 'Херес' },
      { key: 'en', value: 'Heres' },
    ],
    slug: 'heres',
  },
  {
    name: [
      { key: 'ru', value: 'Вермут' },
      { key: 'en', value: 'Vermut' },
    ],
    slug: 'varmut',
  },
];

export const MOCK_OPTIONS_GROUP = {
  name: [
    { key: 'ru', value: 'Цвета_вина' },
    { key: 'en', value: 'Wine_colors' },
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

export const MOCK_ATTRIBUTES_GROUP = {
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

export const MOCK_ATTRIBUTES_GROUP_B = {
  name: [
    { key: 'ru', value: 'group_b' },
    { key: 'en', value: 'group_b_en' },
  ],
};

// Rubrics
export const MOCK_RUBRIC_TYPE_EQUIPMENT = {
  name: [
    { key: 'ru', value: 'Алкоголь' },
    { key: 'en', value: 'Alcohol' },
  ],
};

export const MOCK_RUBRIC_TYPE_STAGE = {
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
  catalogueName: [
    { key: 'ru', value: 'Купить вино' },
    { key: 'en', value: 'Buy a wine' },
  ],
  level: RUBRIC_LEVEL_ONE,
  parent: null,
};

export const MOCK_RUBRIC_LEVEL_TWO_A = {
  name: [
    { key: 'ru', value: 'Второй_уровень_1' },
    { key: 'en', value: 'Second_level_1' },
  ],
  catalogueName: [
    { key: 'ru', value: 'Второй_уровень_1' },
    { key: 'en', value: 'Second_level_1' },
  ],
  level: RUBRIC_LEVEL_TWO,
};

export const MOCK_RUBRIC_LEVEL_TWO_B = {
  name: [
    { key: 'ru', value: 'Второй_уровень_2' },
    { key: 'en', value: 'Second_level_2' },
  ],
  catalogueName: [
    { key: 'ru', value: 'Второй_уровень_2' },
    { key: 'en', value: 'Second_level_2' },
  ],
  level: RUBRIC_LEVEL_TWO,
};

export const MOCK_RUBRIC_LEVEL_THREE_A_A = {
  name: [
    { key: 'ru', value: 'Третий_уровень_1_1' },
    { key: 'en', value: 'Third_level_1_1' },
  ],
  catalogueName: [
    { key: 'ru', value: 'Третий_уровень_1_1' },
    { key: 'en', value: 'Third_level_1_1' },
  ],
  level: RUBRIC_LEVEL_THREE,
};

export const MOCK_RUBRIC_LEVEL_THREE_A_B = {
  name: [
    { key: 'ru', value: 'Третий_уровень_1_2' },
    { key: 'en', value: 'Third_level_1_2' },
  ],
  catalogueName: [
    { key: 'ru', value: 'Третий_уровень_1_2' },
    { key: 'en', value: 'Third_level_1_2' },
  ],
  level: RUBRIC_LEVEL_THREE,
};

export const MOCK_RUBRIC_LEVEL_THREE_B_A = {
  name: [
    { key: 'ru', value: 'Третий_уровень_2_1' },
    { key: 'en', value: 'Third_level_2_1' },
  ],
  catalogueName: [
    { key: 'ru', value: 'Третий_уровень_2_1' },
    { key: 'en', value: 'Third_level_2_1' },
  ],
  level: RUBRIC_LEVEL_THREE,
};

export const MOCK_RUBRIC_LEVEL_THREE_B_B = {
  name: [
    { key: 'ru', value: 'Третий_уровень_2_2' },
    { key: 'en', value: 'Third_level_2_2' },
  ],
  catalogueName: [
    { key: 'ru', value: 'Третий_уровень_2_2' },
    { key: 'en', value: 'Third_level_2_2' },
  ],
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
