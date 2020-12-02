import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_CITY,
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_LANG,
  DEFAULT_PRIORITY,
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
  GEO_POINT_TYPE,
  RUBRIC_LEVEL_ONE,
  RUBRIC_LEVEL_THREE,
  RUBRIC_LEVEL_TWO,
  SECONDARY_CITY,
  SECONDARY_COUNTRY,
  SECONDARY_CURRENCY,
  SECONDARY_LANG,
} from '@yagu/config';

// Users
export const ME_AS_ADMIN = {
  id: 'adminBro',
  email: 'admin@gmail.com',
  password: 'admin',
  name: 'Admin',
  secondName: 'Secondname',
  lastName: 'Lastname',
  phone: '+79990002233',
};

export const MOCK_COMPANY_OWNER = {
  email: 'company.owner@gmail.com',
  password: 'owner',
  name: 'Owner',
  secondName: 'Secondname',
  lastName: 'Lastname',
  phone: '+79990002234',
};

export const MOCK_COMPANY_MANAGER = {
  email: 'company.manager@gmail.com',
  password: 'manager',
  name: 'Manager',
  secondName: 'Secondname',
  lastName: 'Lastname',
  phone: '+79990002235',
};

export const MOCK_SAMPLE_USER = {
  email: 'sample.user@gmail.com',
  password: 'sample',
  name: 'Sample',
  secondName: 'Secondname',
  lastName: 'Lastname',
  phone: '+79990002236',
};

export const MOCK_SAMPLE_USER_B = {
  email: 'sampleb.user@gmail.com',
  password: 'sampleB',
  name: 'SampleB',
  secondName: 'SecondnameB',
  lastName: 'LastnameB',
  phone: '+79990002237',
};

// Addresses
export const MOCK_ADDRESS_A = {
  formattedAddress: 'Ленинградский пр-т., 35 строение 5, Москва, Россия, 125284',
  point: {
    lat: 55.790229,
    lng: 37.549611,
  },
};

export const MOCK_ADDRESS_B = {
  formattedAddress: '1001 КНИГА, Комсомольская пл., 12, Москва, Россия, 107140',
  point: {
    lat: 55.781155,
    lng: 37.654028,
  },
};

// Company
export const MOCK_COMPANY = {
  nameString: 'Company',
  slug: 'company',
  contacts: {
    emails: ['company1@gmail.com', 'company2@gmail.com'],
    phones: ['+78990002235', '+78890002235'],
  },
};

export const MOCK_NEW_COMPANY = {
  nameString: 'New Company',
  slug: 'new_company',
  contacts: {
    emails: ['new.company1@gmail.com', 'new.company2@gmail.com'],
    phones: ['+78990002222', '+78890001111'],
  },
};

export const MOCK_NEW_COMPANY_B = {
  nameString: 'New Company B',
  slug: 'new_company_b',
  contacts: {
    emails: ['new.companyB1@gmail.com', 'new.companyB2@gmail.com'],
    phones: ['+78990003333', '+78890004444'],
  },
};

export const MOCK_COMPANIES = [MOCK_COMPANY];

// Shop
export const MOCK_SHOP = {
  nameString: 'Shop',
  slug: 'shop',
  city: DEFAULT_CITY,
  contacts: {
    emails: ['shop1@gmail.com', 'shop2@gmail.com'],
    phones: ['+78990002245', '+78890002246'],
  },
  address: {
    formattedAddress: MOCK_ADDRESS_A.formattedAddress,
    point: {
      type: GEO_POINT_TYPE,
      coordinates: [MOCK_ADDRESS_A.point.lng, MOCK_ADDRESS_A.point.lat],
    },
  },
};

export const MOCK_SHOP_B = {
  nameString: 'Shop B',
  slug: 'shop_b',
  city: DEFAULT_CITY,
  contacts: {
    emails: ['shopB1@gmail.com', 'shopB2@gmail.com'],
    phones: ['+78111112245', '+78121112246'],
  },
  address: {
    formattedAddress: MOCK_ADDRESS_B.formattedAddress,
    point: {
      type: GEO_POINT_TYPE,
      coordinates: [MOCK_ADDRESS_B.point.lng, MOCK_ADDRESS_B.point.lat],
    },
  },
};

export const MOCK_NEW_SHOP = {
  nameString: 'New Shop',
  slug: 'new_shop',
  contacts: {
    emails: ['new.shop1@gmail.com', 'new.shop2@gmail.com'],
    phones: ['+78990002255', '+78890002256'],
  },
  address: {
    formattedAddress: MOCK_ADDRESS_A.formattedAddress,
    point: {
      type: GEO_POINT_TYPE,
      coordinates: [MOCK_ADDRESS_A.point.lng, MOCK_ADDRESS_A.point.lat],
    },
  },
};

export const MOCK_SHOPS = [MOCK_SHOP, MOCK_SHOP_B];

// Languages
export const ISO_LANGUAGES = [
  {
    id: DEFAULT_LANG,
    nameString: 'Russian',
    nativeName: 'ru',
  },
  {
    id: SECONDARY_LANG,
    nameString: 'English',
    nativeName: 'en',
  },
  {
    id: 'ua-UA',
    nameString: 'Украинский',
    nativeName: 'ua',
  },
  {
    id: 'pl',
    nameString: 'Польский',
    nativeName: 'pl',
  },
];

// Site config
export const SITE_CONFIGS_LOGO = {
  slug: 'siteLogo',
  nameString: 'Логотип сайта для тёмной темы',
  description: 'Полное изображение логотипа в формате SVG',
  variant: 'asset',
  order: 1,
  multi: false,
  acceptedFormats: ['image/svg+xml'],
  cities: [],
  sourceImage: 'logo.svg',
};
export const SITE_CONFIGS_LOGO_DARK = {
  slug: 'siteLogoDark',
  nameString: 'Логотип сайта для светлой темы',
  description: 'Полное изображение логотипа в формате SVG',
  variant: 'asset',
  order: 2,
  multi: false,
  acceptedFormats: ['image/svg+xml'],
  cities: [],
  sourceImage: 'logo-dark.svg',
};
export const SITE_CONFIGS_LOGO_ICON = {
  slug: 'siteLogoIcon',
  nameString: 'Иконка логотипа сайта',
  description: 'Иконка логотипа в формате SVG',
  variant: 'asset',
  order: 3,
  multi: false,
  acceptedFormats: ['image/svg+xml'],
  cities: [],
  sourceImage: 'logo-icon.svg',
};
export const SITE_CONFIGS_LOGO_NAME = {
  slug: 'siteLogoName',
  nameString: 'Текст логотипа сайта',
  description: 'Текст логотипа в формате SVG',
  variant: 'asset',
  order: 4,
  multi: false,
  multiLang: false,
  acceptedFormats: ['image/svg+xml'],
  cities: [],
  sourceImage: 'logo-name.svg',
};
export const SITE_CONFIGS_PREVIEW_IMAGE = {
  slug: 'pageDefaultPreviewImage',
  nameString: 'Дефолтное превью изображение',
  description:
    'Данное поле будет добавлено в атрибуты og:image и twitter:image если страница не имеет таковых. Нужно для корректного отображения ссылки при отправке в соцсетях и чатах.',
  variant: 'asset',
  order: 5,
  multi: false,
  acceptedFormats: ['image/jpeg'],
  cities: [],
  sourceImage: 'og-image.jpg',
};

export const SITE_CONFIGS_INITIAL = [
  {
    slug: 'siteName',
    nameString: 'Название сайта',
    description: '',
    variant: 'string',
    order: 6,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['Site'],
          },
        ],
      },
    ],
  },
  {
    slug: 'contactEmail',
    nameString: 'Контактный Email',
    description: 'Контактный Email. Можно добавить несколько.',
    variant: 'email',
    order: 7,
    multi: true,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['email@email.com'],
          },
        ],
      },
    ],
  },
  {
    slug: 'contactPhone',
    nameString: 'Контактный телефон',
    description: 'Контактный телефон. Можно добавить несколько.',
    variant: 'tel',
    order: 8,
    multi: true,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['+79998887766'],
          },
        ],
      },
    ],
  },
  {
    slug: 'siteFoundationYear',
    nameString: 'Год основания сайта',
    description: '',
    variant: 'number',
    order: 9,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['2020'],
          },
        ],
      },
    ],
  },
  {
    slug: 'pageDefaultTitle',
    nameString: 'Дефолтный title страницы',
    description: 'Данное поле будет добавлено в атрибут title если страница не имеет такового',
    variant: 'string',
    order: 10,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['Дефолтный title страницы'],
          },
          {
            key: SECONDARY_LANG,
            value: ['Page default title'],
          },
        ],
      },
    ],
  },
  {
    slug: 'pageDefaultDescription',
    nameString: 'Дефолтный description страницы',
    description:
      'Данное поле будет добавлено в атрибут description если страница не имеет такового',
    variant: 'string',
    order: 11,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['Дефолтный description страницы'],
          },
          {
            key: SECONDARY_LANG,
            value: ['Page default description'],
          },
        ],
      },
    ],
  },
  {
    slug: 'siteThemeColor',
    nameString: 'Акцент цвет сайта',
    description:
      'Данный цвет будет использован для акцента ключевых элементов сайта. ВНИМАНИЕ! Цвет должен быть в формате RGB!',
    variant: 'string',
    order: 12,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['219, 83, 96'],
          },
        ],
      },
    ],
  },
  {
    slug: 'stickyNavVisibleOptionsCount',
    nameString: 'Количество видимых опций в выпадающем меню.',
    description: '',
    variant: 'number',
    order: 13,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['3'],
          },
        ],
      },
    ],
  },
  {
    slug: 'catalogueFilterVisibleOptionsCount',
    nameString: 'Количество видимых опций фильтре каталога.',
    description: '',
    variant: 'number',
    order: 14,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['3'],
          },
        ],
      },
    ],
  },
];

export const SITE_CONFIGS_ASSETS_All = [
  SITE_CONFIGS_LOGO,
  SITE_CONFIGS_LOGO_DARK,
  SITE_CONFIGS_LOGO_ICON,
  SITE_CONFIGS_LOGO_NAME,
  SITE_CONFIGS_PREVIEW_IMAGE,
];

export const SITE_CONFIGS_All = [...SITE_CONFIGS_ASSETS_All, ...SITE_CONFIGS_INITIAL];

// Currency
export const INITIAL_CURRENCIES = [{ nameString: DEFAULT_CURRENCY }];
export const MOCK_CURRENCIES = [...INITIAL_CURRENCIES, { nameString: SECONDARY_CURRENCY }];

// Countries and cities
export const INITIAL_COUNTRIES = [{ nameString: DEFAULT_COUNTRY }];
export const MOCK_COUNTRIES = [...INITIAL_COUNTRIES, { nameString: SECONDARY_COUNTRY }];

export const INITIAL_CITIES = [
  {
    name: [
      { key: DEFAULT_LANG, value: 'Москва' },
      { key: SECONDARY_LANG, value: 'Moscow' },
    ],
    slug: DEFAULT_CITY,
  },
];

export const MOCK_CITIES = [
  ...INITIAL_CITIES,
  {
    name: [
      { key: DEFAULT_LANG, value: 'Нью Йорк' },
      { key: SECONDARY_LANG, value: 'New York' },
    ],
    slug: SECONDARY_CITY,
  },
];

// Languages
export const INITIAL_LANGUAGES = [
  {
    key: DEFAULT_LANG,
    name: 'Русский',
    nativeName: 'ru',
    isDefault: true,
  },
];

export const MOCK_LANGUAGES = [
  ...INITIAL_LANGUAGES,
  {
    key: SECONDARY_LANG,
    name: 'Английский',
    nativeName: 'en',
    isDefault: false,
  },
];

export const MOCK_METRICS = [
  {
    name: [
      { key: DEFAULT_LANG, value: 'км/ч' },
      { key: SECONDARY_LANG, value: 'km/h' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'мм' },
      { key: SECONDARY_LANG, value: 'mm' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'шт.' },
      { key: SECONDARY_LANG, value: 'units' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'м2' },
      { key: SECONDARY_LANG, value: 'm2' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'мест' },
      { key: SECONDARY_LANG, value: 'places' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'км' },
      { key: SECONDARY_LANG, value: 'km' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'кВт' },
      { key: SECONDARY_LANG, value: 'kw' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'р.' },
      { key: SECONDARY_LANG, value: 'rub.' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'лет' },
      { key: SECONDARY_LANG, value: 'years' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'см' },
      { key: SECONDARY_LANG, value: 'cm' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: '%' },
      { key: SECONDARY_LANG, value: '%' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'м' },
      { key: SECONDARY_LANG, value: 'm' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'часов' },
      { key: SECONDARY_LANG, value: 'hours' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'кг' },
      { key: SECONDARY_LANG, value: 'kg' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'чел.' },
      { key: SECONDARY_LANG, value: 'people' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'м/с' },
      { key: SECONDARY_LANG, value: 'm/s' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'год' },
      { key: SECONDARY_LANG, value: 'year' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'мин.' },
      { key: SECONDARY_LANG, value: 'minutes' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'ед.' },
      { key: SECONDARY_LANG, value: 'units' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'мл.' },
      { key: SECONDARY_LANG, value: 'ml' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'л/ч.' },
      { key: SECONDARY_LANG, value: 'p/h' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Hz' },
      { key: SECONDARY_LANG, value: 'Hz' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Вт' },
      { key: SECONDARY_LANG, value: 'Wt' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: '°' },
      { key: SECONDARY_LANG, value: '°' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: '°C' },
      { key: SECONDARY_LANG, value: '°C' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'кд/м2' },
      { key: SECONDARY_LANG, value: 'kd/m2' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'м3/ч' },
      { key: SECONDARY_LANG, value: 'm3/h' },
    ],
  },
];

// Options
export const MOCK_OPTIONS_VINTAGE = [
  {
    name: [
      { key: DEFAULT_LANG, value: '1950' },
      { key: SECONDARY_LANG, value: '1950' },
    ],
    gender: GENDER_IT,
    priorities: [],
    views: [],
    slug: '1950',
    color: '',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: DEFAULT_LANG, value: '1950' },
          { key: SECONDARY_LANG, value: '1950' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: DEFAULT_LANG, value: '1950' },
          { key: SECONDARY_LANG, value: '1950' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: DEFAULT_LANG, value: '1950' },
          { key: SECONDARY_LANG, value: '1950' },
        ],
      },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: '1978' },
      { key: SECONDARY_LANG, value: '1978' },
    ],
    gender: GENDER_IT,
    priorities: [],
    views: [],
    slug: '1978',
    color: '',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: DEFAULT_LANG, value: '1978' },
          { key: SECONDARY_LANG, value: '1978' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: DEFAULT_LANG, value: '1978' },
          { key: SECONDARY_LANG, value: '1978' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: DEFAULT_LANG, value: '1978' },
          { key: SECONDARY_LANG, value: '1978' },
        ],
      },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: '2001' },
      { key: SECONDARY_LANG, value: '2001' },
    ],
    gender: GENDER_IT,
    priorities: [],
    views: [],
    slug: '2001',
    color: '',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: DEFAULT_LANG, value: '2001' },
          { key: SECONDARY_LANG, value: '2001' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: DEFAULT_LANG, value: '2001' },
          { key: SECONDARY_LANG, value: '2001' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: DEFAULT_LANG, value: '2001' },
          { key: SECONDARY_LANG, value: '2001' },
        ],
      },
    ],
  },
];

export const MOCK_OPTIONS_WINE_COLOR = [
  {
    name: [
      { key: DEFAULT_LANG, value: 'Белый' },
      { key: SECONDARY_LANG, value: 'White' },
    ],
    gender: GENDER_HE,
    priorities: [],
    views: [],
    slug: 'beliy',
    color: 'ffffff',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: DEFAULT_LANG, value: 'Белая' },
          { key: SECONDARY_LANG, value: 'White' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: DEFAULT_LANG, value: 'Белый' },
          { key: SECONDARY_LANG, value: 'White' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: DEFAULT_LANG, value: 'Белое' },
          { key: SECONDARY_LANG, value: 'White' },
        ],
      },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Красный' },
      { key: SECONDARY_LANG, value: 'Red' },
    ],
    gender: GENDER_HE,
    priorities: [],
    views: [],
    slug: 'krasniy',
    color: '99020b',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: DEFAULT_LANG, value: 'Красная' },
          { key: SECONDARY_LANG, value: 'Red' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: DEFAULT_LANG, value: 'Красный' },
          { key: SECONDARY_LANG, value: 'Red' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: DEFAULT_LANG, value: 'Красное' },
          { key: SECONDARY_LANG, value: 'Red' },
        ],
      },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Розовый' },
      { key: SECONDARY_LANG, value: 'Pink' },
    ],
    gender: GENDER_HE,
    priorities: [],
    views: [],
    slug: 'rozoviy',
    color: 'db8ce0',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: DEFAULT_LANG, value: 'Розовая' },
          { key: SECONDARY_LANG, value: 'Pink' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: DEFAULT_LANG, value: 'Розовый' },
          { key: SECONDARY_LANG, value: 'Pink' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: DEFAULT_LANG, value: 'Розовое' },
          { key: SECONDARY_LANG, value: 'Pink' },
        ],
      },
    ],
  },
];

export const MOCK_OPTIONS_WINE_VARIANT = [
  {
    name: [
      { key: DEFAULT_LANG, value: 'Портвейн' },
      { key: SECONDARY_LANG, value: 'Port_wine' },
    ],
    priorities: [],
    views: [],
    slug: 'portvein',
    gender: GENDER_HE,
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Херес' },
      { key: SECONDARY_LANG, value: 'Heres' },
    ],
    priorities: [],
    views: [],
    slug: 'heres',
    gender: GENDER_HE,
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Вермут' },
      { key: SECONDARY_LANG, value: 'Vermut' },
    ],
    priorities: [],
    views: [],
    slug: 'varmut',
    gender: GENDER_HE,
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Крепленое' },
      { key: SECONDARY_LANG, value: 'Hard' },
    ],
    priorities: [],
    views: [],
    slug: 'kreplenoe',
    gender: GENDER_IT,
  },
];

export const MOCK_OPTIONS_COMBINATION = [
  {
    name: [
      { key: DEFAULT_LANG, value: 'Белое_мясо' },
      { key: SECONDARY_LANG, value: 'White_meat' },
    ],
    icon: 'white-meat',
    priorities: [],
    views: [],
    slug: 'white_meat',
    gender: GENDER_IT,
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Суп' },
      { key: SECONDARY_LANG, value: 'Soup' },
    ],
    icon: 'soup',
    priorities: [],
    views: [],
    slug: 'soup',
    gender: GENDER_HE,
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Рыба' },
      { key: SECONDARY_LANG, value: 'Fish' },
    ],
    icon: 'fish',
    priorities: [],
    views: [],
    slug: 'fish',
    gender: GENDER_HE,
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Дары_моря' },
      { key: SECONDARY_LANG, value: 'Seafood' },
    ],
    icon: 'seafood',
    priorities: [],
    views: [],
    slug: 'seafood',
    gender: GENDER_IT,
  },
];

// Options groups
export const MOCK_OPTIONS_GROUP_COMBINATIONS = {
  name: [
    { key: DEFAULT_LANG, value: 'Сочетания' },
    { key: SECONDARY_LANG, value: 'Combinations' },
  ],
};

export const MOCK_OPTIONS_GROUP_COLORS = {
  name: [
    { key: DEFAULT_LANG, value: 'Цвета' },
    { key: SECONDARY_LANG, value: 'Colors' },
  ],
};

export const MOCK_OPTIONS_GROUP_WINE_VARIANTS = {
  name: [
    { key: DEFAULT_LANG, value: 'Типы_вина' },
    { key: SECONDARY_LANG, value: 'Wine_types' },
  ],
};

export const MOCK_OPTIONS_GROUP_WINE_VINTAGE = {
  name: [
    { key: DEFAULT_LANG, value: 'Винтаж_вина' },
    { key: SECONDARY_LANG, value: 'Wine_vintage' },
  ],
};

// Attributes
export const MOCK_ATTRIBUTE_OUTER_RATING_A = {
  name: [
    { key: DEFAULT_LANG, value: 'vivino' },
    { key: SECONDARY_LANG, value: 'vivino' },
  ],
  views: [],
  priorities: [],
  slug: 'vivino',
  variant: ATTRIBUTE_VARIANT_NUMBER,
};

export const MOCK_ATTRIBUTE_OUTER_RATING_B = {
  name: [
    { key: DEFAULT_LANG, value: 'pr' },
    { key: SECONDARY_LANG, value: 'pr' },
  ],
  views: [],
  priorities: [],
  slug: 'pr',
  variant: ATTRIBUTE_VARIANT_NUMBER,
};

export const MOCK_ATTRIBUTE_OUTER_RATING_C = {
  name: [
    { key: DEFAULT_LANG, value: 'ws' },
    { key: SECONDARY_LANG, value: 'ws' },
  ],
  views: [],
  priorities: [],
  slug: 'ws',
  variant: ATTRIBUTE_VARIANT_NUMBER,
};

export const MOCK_ATTRIBUTE_WINE_COMBINATIONS = {
  name: [
    { key: DEFAULT_LANG, value: 'Сочетание' },
    { key: SECONDARY_LANG, value: 'Combinations' },
  ],
  views: [],
  priorities: [],
  slug: 'combinations',
  variant: ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
};

export const MOCK_ATTRIBUTE_WINE_VINTAGE = {
  name: [
    { key: DEFAULT_LANG, value: 'Винтаж_вина' },
    { key: SECONDARY_LANG, value: 'Wine_vintage' },
  ],
  views: [],
  priorities: [],
  slug: 'vintaz_vina',
  variant: ATTRIBUTE_VARIANT_SELECT,
};

export const MOCK_ATTRIBUTE_WINE_COLOR = {
  name: [
    { key: DEFAULT_LANG, value: 'Цвет_вина' },
    { key: SECONDARY_LANG, value: 'Wine_color' },
  ],
  views: [],
  priorities: [],
  slug: 'tsvet_vina',
  variant: ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
};

export const MOCK_ATTRIBUTE_WINE_VARIANT = {
  name: [
    { key: DEFAULT_LANG, value: 'Тип_вина' },
    { key: SECONDARY_LANG, value: 'Wine_type' },
  ],
  views: [],
  priorities: [],
  slug: 'tip_vina',
  variant: ATTRIBUTE_VARIANT_SELECT,
};

export const MOCK_ATTRIBUTE_STRING = {
  name: [
    { key: DEFAULT_LANG, value: 'Атрибут_строка' },
    { key: SECONDARY_LANG, value: 'Attribute_string' },
  ],
  views: [],
  priorities: [],
  slug: 'attribute_stroka',
  variant: ATTRIBUTE_VARIANT_STRING,
};

export const MOCK_ATTRIBUTE_NUMBER = {
  name: [
    { key: DEFAULT_LANG, value: 'Атрибут_число' },
    { key: SECONDARY_LANG, value: 'Attribute_number' },
  ],
  views: [],
  priorities: [],
  slug: 'attribute_chislo',
  variant: ATTRIBUTE_VARIANT_NUMBER,
};

export const MOCK_ATTRIBUTES_GROUP_OUTER_RATING = {
  name: [
    { key: DEFAULT_LANG, value: 'Внешний_рейтинг' },
    { key: SECONDARY_LANG, value: 'Outer_rating' },
  ],
};

export const MOCK_ATTRIBUTES_GROUP_WINE_FEATURES = {
  name: [
    { key: DEFAULT_LANG, value: 'Характеристики_вина' },
    { key: SECONDARY_LANG, value: 'Wine_features' },
  ],
};

export const MOCK_ATTRIBUTES_GROUP_FOR_DELETE = {
  name: [
    { key: DEFAULT_LANG, value: 'Группа_атрибутов_для_удаления' },
    { key: SECONDARY_LANG, value: 'Group_for_delete' },
  ],
};

export const MOCK_ATTRIBUTES_GROUP_WHISKEY_FEATURES = {
  name: [
    { key: DEFAULT_LANG, value: 'Характеристики_виски' },
    { key: SECONDARY_LANG, value: 'Whiskey_features' },
  ],
};

// Rubrics
export const MOCK_RUBRIC_VARIANT_ALCOHOL = {
  name: [
    { key: DEFAULT_LANG, value: 'Алкоголь' },
    { key: SECONDARY_LANG, value: 'Alcohol' },
  ],
};

export const MOCK_RUBRIC_VARIANT_JUICE = {
  name: [
    { key: DEFAULT_LANG, value: 'Соки' },
    { key: SECONDARY_LANG, value: 'Juice' },
  ],
};

export const MOCK_RUBRIC_LEVEL_ONE = {
  name: [
    { key: DEFAULT_LANG, value: 'Вино' },
    { key: SECONDARY_LANG, value: 'Wine' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Купить вино' },
      { key: SECONDARY_LANG, value: 'Buy a wine' },
    ],
    prefix: [
      { key: DEFAULT_LANG, value: 'Купить' },
      { key: SECONDARY_LANG, value: 'Buy a' },
    ],
    keyword: [
      { key: DEFAULT_LANG, value: 'вино' },
      { key: SECONDARY_LANG, value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_ONE,
  priority: DEFAULT_PRIORITY,
  parent: null,
};

export const MOCK_RUBRIC_LEVEL_ONE_B = {
  name: [
    { key: DEFAULT_LANG, value: 'Шампанское и игристое' },
    { key: SECONDARY_LANG, value: 'Champagne' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Купить шампанское' },
      { key: SECONDARY_LANG, value: 'Buy a champagne' },
    ],
    prefix: [
      { key: DEFAULT_LANG, value: 'Купить' },
      { key: SECONDARY_LANG, value: 'Buy a' },
    ],
    keyword: [
      { key: DEFAULT_LANG, value: 'шампанское' },
      { key: SECONDARY_LANG, value: 'champagne' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_ONE,
  priority: DEFAULT_PRIORITY,
  parent: null,
};

export const MOCK_RUBRIC_LEVEL_ONE_C = {
  name: [
    { key: DEFAULT_LANG, value: 'Виски' },
    { key: SECONDARY_LANG, value: 'Whiskey' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Купить Виски' },
      { key: SECONDARY_LANG, value: 'Buy a Whiskey' },
    ],
    prefix: [
      { key: DEFAULT_LANG, value: 'Купить' },
      { key: SECONDARY_LANG, value: 'Buy a' },
    ],
    keyword: [
      { key: DEFAULT_LANG, value: 'Виски' },
      { key: SECONDARY_LANG, value: 'Whiskey' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_ONE,
  priority: DEFAULT_PRIORITY,
  parent: null,
};

export const MOCK_RUBRIC_LEVEL_ONE_D = {
  name: [
    { key: DEFAULT_LANG, value: 'Коньяк' },
    { key: SECONDARY_LANG, value: 'Cognac' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Купить коньяк' },
      { key: SECONDARY_LANG, value: 'Buy a cognac' },
    ],
    prefix: [
      { key: DEFAULT_LANG, value: 'Купить' },
      { key: SECONDARY_LANG, value: 'Buy a' },
    ],
    keyword: [
      { key: DEFAULT_LANG, value: 'коньяк' },
      { key: SECONDARY_LANG, value: 'cognac' },
    ],
    gender: GENDER_HE,
  },
  level: RUBRIC_LEVEL_ONE,
  priority: DEFAULT_PRIORITY,
  parent: null,
};

export const MOCK_RUBRIC_LEVEL_TWO_A = {
  name: [
    { key: DEFAULT_LANG, value: 'Второй_уровень_1' },
    { key: SECONDARY_LANG, value: 'Second_level_1' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Второй уровень 1' },
      { key: SECONDARY_LANG, value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: DEFAULT_LANG, value: 'Второй уровень 1' },
      { key: SECONDARY_LANG, value: 'wine' },
    ],
    gender: GENDER_SHE,
  },
  level: RUBRIC_LEVEL_TWO,
  priority: DEFAULT_PRIORITY,
};

export const MOCK_RUBRIC_LEVEL_TWO_B = {
  name: [
    { key: DEFAULT_LANG, value: 'Второй_уровень_2' },
    { key: SECONDARY_LANG, value: 'Second_level_2' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Второй уровень 2' },
      { key: SECONDARY_LANG, value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: DEFAULT_LANG, value: 'Второй уровень 2' },
      { key: SECONDARY_LANG, value: 'wine' },
    ],
    gender: GENDER_HE,
  },
  level: RUBRIC_LEVEL_TWO,
  priority: DEFAULT_PRIORITY,
};

export const MOCK_RUBRIC_LEVEL_THREE_A_A = {
  name: [
    { key: DEFAULT_LANG, value: 'Третий_уровень_1_1' },
    { key: SECONDARY_LANG, value: 'Third_level_1_1' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Третий уровень 1_1' },
      { key: SECONDARY_LANG, value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: DEFAULT_LANG, value: 'Третий уровень 1_1' },
      { key: SECONDARY_LANG, value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
  priority: DEFAULT_PRIORITY,
};

export const MOCK_RUBRIC_LEVEL_THREE_A_B = {
  name: [
    { key: DEFAULT_LANG, value: 'Третий_уровень_1_2' },
    { key: SECONDARY_LANG, value: 'Third_level_1_2' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Третий уровень 1_2' },
      { key: SECONDARY_LANG, value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: DEFAULT_LANG, value: 'Третий уровень 1_2' },
      { key: SECONDARY_LANG, value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
  priority: DEFAULT_PRIORITY,
};

export const MOCK_RUBRIC_LEVEL_THREE_B_A = {
  name: [
    { key: DEFAULT_LANG, value: 'Третий_уровень_2_1' },
    { key: SECONDARY_LANG, value: 'Third_level_2_1' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Третий уровень 2_1' },
      { key: SECONDARY_LANG, value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: DEFAULT_LANG, value: 'Третий уровень 2_1' },
      { key: SECONDARY_LANG, value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
  priority: DEFAULT_PRIORITY,
};

export const MOCK_RUBRIC_LEVEL_THREE_B_B = {
  name: [
    { key: DEFAULT_LANG, value: 'Третий_уровень_2_2' },
    { key: SECONDARY_LANG, value: 'Third_level_2_2' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Третий уровень 2_2' },
      { key: SECONDARY_LANG, value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: DEFAULT_LANG, value: 'Третий уровень 2_2' },
      { key: SECONDARY_LANG, value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
  priority: DEFAULT_PRIORITY,
};

// Products
const productDescription = [
  { key: DEFAULT_LANG, value: 'Очень длинное описание товара' },
  { key: SECONDARY_LANG, value: 'Very long product description' },
];

export const MOCK_PRODUCT_A = {
  priority: 10,
  slug: 'productA',
  name: [
    { key: DEFAULT_LANG, value: 'productA' },
    { key: SECONDARY_LANG, value: 'productA' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productA' },
    { key: SECONDARY_LANG, value: 'Card_name_productA' },
  ],
  price: 100,
  description: productDescription,
};

export const MOCK_PRODUCT_B = {
  priority: 9,
  slug: 'productB',
  name: [
    { key: DEFAULT_LANG, value: 'productB' },
    { key: SECONDARY_LANG, value: 'productB' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productB' },
    { key: SECONDARY_LANG, value: 'Card_name_productB' },
  ],
  price: 200,
  description: productDescription,
};

export const MOCK_PRODUCT_C = {
  priority: 1,
  slug: 'productC',
  name: [
    { key: DEFAULT_LANG, value: 'productC' },
    { key: SECONDARY_LANG, value: 'productC' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productC' },
    { key: SECONDARY_LANG, value: 'Card_name_productC' },
  ],
  price: 50,
  description: productDescription,
};

export const MOCK_PRODUCT_D = {
  priority: 1,
  slug: 'productD',
  name: [
    { key: DEFAULT_LANG, value: 'productD' },
    { key: SECONDARY_LANG, value: 'productD' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productD' },
    { key: SECONDARY_LANG, value: 'Card_name_productD' },
  ],
  price: 1150,
  description: productDescription,
};

export const MOCK_PRODUCT_E = {
  priority: 1,
  slug: 'productE',
  name: [
    { key: DEFAULT_LANG, value: 'productE' },
    { key: SECONDARY_LANG, value: 'productE' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productE' },
    { key: SECONDARY_LANG, value: 'Card_name_productE' },
  ],
  price: 500,
  description: productDescription,
};

export const MOCK_PRODUCT_F = {
  priority: 1,
  slug: 'productF',
  name: [
    { key: DEFAULT_LANG, value: 'productF' },
    { key: SECONDARY_LANG, value: 'productF' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productF' },
    { key: SECONDARY_LANG, value: 'Card_name_productF' },
  ],
  price: 500,
  description: productDescription,
};

export const MOCK_PRODUCT_NEW = {
  name: [
    { key: DEFAULT_LANG, value: 'productNew' },
    { key: SECONDARY_LANG, value: 'productNew' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productNew' },
    { key: SECONDARY_LANG, value: 'Card_name_productNew' },
  ],
  price: 2000,
  description: productDescription,
};

export const MOCK_PRODUCT_CREATE = {
  name: [
    { key: DEFAULT_LANG, value: 'productCreate' },
    { key: SECONDARY_LANG, value: 'productCreate' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Card_name_productCreate' },
    { key: SECONDARY_LANG, value: 'Card_name_productCreate' },
  ],
  price: 2000,
  description: productDescription,
};
