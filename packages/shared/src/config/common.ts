// Time
export const ONE_SECOND = 1000;
export const ONE_MINUTE = ONE_SECOND * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;

// Cookies
export const LANG_COOKIE_KEY = 'lang';
export const CART_COOKIE_KEY = 'cart';

// Internationalization
export const THEME_COOKIE_KEY = 'theme';
export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';

export const DEFAULT_LANG = 'ru-RU';
export const SECONDARY_LANG = 'en-EN';

export const CITY_COOKIE_KEY = 'city';
export const LANG_COOKIE_HEADER = 'accept-language';
export const LANG_NOT_FOUND_FIELD_MESSAGE = 'Field translation not found';
export const LANG_DEFAULT_TITLE_SEPARATOR = ' или ';
export const LANG_SECONDARY_TITLE_SEPARATOR = ' or ';

// Cities
export const DEFAULT_COUNTRY = 'Россия';
export const SECONDARY_COUNTRY = 'USA';
export const DEFAULT_CITY = 'moscow';
export const SECONDARY_CITY = 'ny';
export const DEFAULT_CURRENCY = 'р.';
export const SECONDARY_CURRENCY = '$';

// GENDER
export const GENDER_SHE = 'she';
export const GENDER_HE = 'he';
export const GENDER_IT = 'it';
export const GENDER_ENUMS = [GENDER_HE, GENDER_SHE, GENDER_IT];

// Addresses
export const GEO_POINT_TYPE = 'Point';

// Admin
export const ADMIN_NAME = 'admin';
export const ADMIN_LAST_NAME = 'site';
export const ADMIN_EMAIL = 'admin@gmail.com';
export const ADMIN_PHONE = '+79998884433';
export const ADMIN_PASSWORD = 'admin';

// Roles
export const ROLE_SLUG_GUEST = 'guest';
export const ROLE_SLUG_ADMIN = 'admin';
export const ROLE_SLUG_COMPANY_OWNER = 'companyOwner';
export const ROLE_SLUG_COMPANY_MANAGER = 'companyManager';
export const OPERATION_TYPE_CREATE = 'create';
export const OPERATION_TYPE_READ = 'read';
export const OPERATION_TYPE_UPDATE = 'update';
export const OPERATION_TYPE_DELETE = 'delete';
export const OPERATION_TYPE_ENUM = [
  OPERATION_TYPE_CREATE,
  OPERATION_TYPE_READ,
  OPERATION_TYPE_UPDATE,
  OPERATION_TYPE_DELETE,
];
export const ROLE_EMPTY_CUSTOM_FILTER = '{}';

export const OPERATION_TYPES_LIST = [
  { id: OPERATION_TYPE_CREATE, nameString: 'Создание' },
  { id: OPERATION_TYPE_READ, nameString: 'Чтение' },
  { id: OPERATION_TYPE_UPDATE, nameString: 'Изменение' },
  { id: OPERATION_TYPE_DELETE, nameString: 'Удаление' },
];

export const ROUTE_APP = '/app';
export const ROUTE_APP_NAV_GROUP = 'app';
export const ROUTE_CMS = `${ROUTE_APP}/cms`;
export const QUERY_DATA_LAYOUT_FILTER = 'isFilterVisible';
export const QUERY_DATA_LAYOUT_FILTER_VALUE = '1';
export const QUERY_DATA_LAYOUT_FILTER_ENABLED = `?${QUERY_DATA_LAYOUT_FILTER}=${QUERY_DATA_LAYOUT_FILTER_VALUE}`;

export const appRoute = {
  slug: 'app',
  name: [
    {
      key: DEFAULT_LANG,
      value: 'Главная',
    },
    {
      key: SECONDARY_LANG,
      value: 'Main',
    },
  ],
  order: 0,
  icon: 'cart',
  path: ROUTE_APP,
  navGroup: ROUTE_APP_NAV_GROUP,
  children: [],
};

export const cmsRoute = {
  slug: 'cms',
  name: [
    {
      key: DEFAULT_LANG,
      value: 'CMS',
    },
    {
      key: SECONDARY_LANG,
      value: 'CMS',
    },
  ],
  order: 999,
  icon: 'gear',
  navGroup: ROUTE_APP_NAV_GROUP,
  path: '',
  children: [
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Заказы',
        },
        {
          key: SECONDARY_LANG,
          value: 'Orders',
        },
      ],
      slug: 'cms-orders',
      path: `${ROUTE_CMS}/orders${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Товары',
        },
        {
          key: SECONDARY_LANG,
          value: 'Products',
        },
      ],
      slug: 'cms-products',
      path: `${ROUTE_CMS}/products${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Рубрикатор',
        },
        {
          key: SECONDARY_LANG,
          value: 'Rubrics',
        },
      ],
      slug: 'cms-rubrics',
      path: `${ROUTE_CMS}/rubrics${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Компании',
        },
        {
          key: SECONDARY_LANG,
          value: 'Companies',
        },
      ],
      slug: 'cms-companies',
      path: `${ROUTE_CMS}/companies${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Магазины',
        },
        {
          key: SECONDARY_LANG,
          value: 'Shops',
        },
      ],
      slug: 'cms-shops',
      path: `${ROUTE_CMS}/shops${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Типы рубрик',
        },
        {
          key: SECONDARY_LANG,
          value: 'Rubric variants',
        },
      ],
      slug: 'cms-rubric-variants',
      path: `${ROUTE_CMS}/rubric-variants`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Группы атрибутов',
        },
        {
          key: SECONDARY_LANG,
          value: 'Attributes groups',
        },
      ],
      slug: 'cms-attributes-groups',
      path: `${ROUTE_CMS}/attributes-groups${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Группы опций',
        },
        {
          key: SECONDARY_LANG,
          value: 'Options groups',
        },
      ],
      slug: 'cms-options-groups',
      path: `${ROUTE_CMS}/options-groups${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Языки сайта',
        },
        {
          key: SECONDARY_LANG,
          value: 'Site languages',
        },
      ],
      slug: 'cms-languages',
      path: `${ROUTE_CMS}/languages`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Настройки сайта',
        },
        {
          key: SECONDARY_LANG,
          value: 'Site settings',
        },
      ],
      slug: 'cms-config',
      path: `${ROUTE_CMS}/config`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Роли',
        },
        {
          key: SECONDARY_LANG,
          value: 'Roles',
        },
      ],
      slug: 'cms-roles',
      path: `${ROUTE_CMS}/roles${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
  ],
};

export const INITIAL_APP_NAVIGATION = [appRoute, cmsRoute];

export const ROLE_RULES_TEMPLATE = [
  {
    nameString: 'Атрибуты',
    entity: 'Attribute',
  },
  {
    nameString: 'Группы атрибутов',
    entity: 'AttributesGroup',
  },
  {
    nameString: 'Настройки сайта',
    entity: 'Config',
  },
  {
    nameString: 'Города',
    entity: 'City',
  },
  {
    nameString: 'Страны',
    entity: 'Country',
  },
  {
    nameString: 'Валюта',
    entity: 'Currency',
  },
  {
    nameString: 'Языки',
    entity: 'Language',
  },
  {
    nameString: 'Сообщения системы',
    entity: 'Message',
  },
  {
    nameString: 'Единицы измерения',
    entity: 'Metric',
  },
  {
    nameString: 'Опции',
    entity: 'Option',
  },
  {
    nameString: 'Группы опций',
    entity: 'OptionsGroup',
  },
  {
    nameString: 'Товары',
    entity: 'Product',
  },
  {
    nameString: 'Роли',
    entity: 'Role',
  },
  {
    nameString: 'Рубрики',
    entity: 'Rubric',
  },
  {
    nameString: 'Типы рубрик',
    entity: 'RubricVariant',
  },
  {
    nameString: 'Пользователи',
    entity: 'User',
  },
  {
    nameString: 'Компании',
    entity: 'Company',
  },
  {
    nameString: 'Магазин',
    entity: 'Shop',
  },
  {
    nameString: 'Товар магазина',
    entity: 'ShopProduct',
  },
  {
    nameString: 'Заказ',
    entity: 'Order',
  },
  {
    nameString: 'Бренд',
    entity: 'Brand',
  },
  {
    nameString: 'Линейка бренда',
    entity: 'BrandCollection',
  },
  {
    nameString: 'Производитель',
    entity: 'Manufacturer',
  },
];

export const ROLE_RULE_OPERATIONS_TEMPLATE = [
  {
    operationType: OPERATION_TYPE_CREATE,
    customFilter: ROLE_EMPTY_CUSTOM_FILTER,
    order: 0,
  },
  {
    operationType: OPERATION_TYPE_READ,
    customFilter: ROLE_EMPTY_CUSTOM_FILTER,
    order: 1,
  },
  {
    operationType: OPERATION_TYPE_UPDATE,
    customFilter: ROLE_EMPTY_CUSTOM_FILTER,
    order: 2,
  },
  {
    operationType: OPERATION_TYPE_DELETE,
    customFilter: ROLE_EMPTY_CUSTOM_FILTER,
    order: 3,
  },
];

export const ROLE_TEMPLATE_ADMIN = {
  name: [
    { key: DEFAULT_LANG, value: 'Админ' },
    { key: SECONDARY_LANG, value: 'Admin' },
  ],
  description: 'Администратор сайта',
  slug: ROLE_SLUG_ADMIN,
  isStuff: true,
};

export const ROLE_TEMPLATE_GUEST = {
  name: [
    { key: DEFAULT_LANG, value: 'Гость' },
    { key: SECONDARY_LANG, value: 'Guest' },
  ],
  description: 'Роль назначается новым или не авторизованным пользователям',
  slug: ROLE_SLUG_GUEST,
  isStuff: false,
};

export const ROLE_TEMPLATE_COMPANY_OWNER = {
  name: [
    { key: DEFAULT_LANG, value: 'Владелец компании' },
    { key: SECONDARY_LANG, value: 'Company owner' },
  ],
  description: 'Владелец компании',
  slug: ROLE_SLUG_COMPANY_OWNER,
  isStuff: false,
};

export const ROLE_TEMPLATE_COMPANY_MANAGER = {
  name: [
    { key: DEFAULT_LANG, value: 'Сотрудник компании' },
    { key: SECONDARY_LANG, value: 'Company manager' },
  ],
  description: 'Сотрудник компании',
  slug: ROLE_SLUG_COMPANY_MANAGER,
  isStuff: false,
};

// CONFIG VARIANTS
export const CONFIG_VARIANT_STRING = 'string';
export const CONFIG_VARIANT_NUMBER = 'number';
export const CONFIG_VARIANT_PHONE = 'tel';
export const CONFIG_VARIANT_EMAIL = 'email';
export const CONFIG_VARIANT_ASSET = 'asset';

export const CONFIG_VARIANTS_ENUMS = [
  CONFIG_VARIANT_STRING,
  CONFIG_VARIANT_NUMBER,
  CONFIG_VARIANT_PHONE,
  CONFIG_VARIANT_EMAIL,
  CONFIG_VARIANT_ASSET,
];

export const CONFIG_VARIANTS_LIST = [
  { id: CONFIG_VARIANT_STRING, nameString: 'Строка' },
  { id: CONFIG_VARIANT_NUMBER, nameString: 'Число' },
  { id: CONFIG_VARIANT_PHONE, nameString: 'Телефон' },
  { id: CONFIG_VARIANT_EMAIL, nameString: 'Email' },
  { id: CONFIG_VARIANT_ASSET, nameString: 'Изображение' },
];

// OPTIONS GROUP VARIANTS
export const OPTIONS_GROUP_VARIANT_TEXT = 'text';
export const OPTIONS_GROUP_VARIANT_ICON = 'icon';
export const OPTIONS_GROUP_VARIANT_COLOR = 'color';

export const OPTIONS_GROUP_VARIANT_ENUMS = [
  OPTIONS_GROUP_VARIANT_TEXT,
  OPTIONS_GROUP_VARIANT_ICON,
  OPTIONS_GROUP_VARIANT_COLOR,
];

// ATTRIBUTE VARIANTS
export const ATTRIBUTE_VARIANT_SELECT = 'select';
export const ATTRIBUTE_VARIANT_MULTIPLE_SELECT = 'multipleSelect';
export const ATTRIBUTE_VARIANT_STRING = 'string';
export const ATTRIBUTE_VARIANT_NUMBER = 'number';

export const ATTRIBUTE_VARIANTS_ENUMS = [
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  ATTRIBUTE_VARIANT_NUMBER,
];

export const ATTRIBUTE_VARIANTS_LIST = [
  { id: ATTRIBUTE_VARIANT_SELECT, nameString: 'Селект' },
  { id: ATTRIBUTE_VARIANT_MULTIPLE_SELECT, nameString: 'Мульти-селект' },
  { id: ATTRIBUTE_VARIANT_STRING, nameString: 'Строка' },
  { id: ATTRIBUTE_VARIANT_NUMBER, nameString: 'Число' },
];

// ATTRIBUTE VIEW VARIANTS
export const ATTRIBUTE_VIEW_VARIANT_LIST = 'list';
export const ATTRIBUTE_VIEW_VARIANT_TEXT = 'text';
export const ATTRIBUTE_VIEW_VARIANT_TAG = 'tag';
export const ATTRIBUTE_VIEW_VARIANT_ICON = 'icon';
export const ATTRIBUTE_VIEW_VARIANT_OUTER_RATING = 'outerRating';

export const ATTRIBUTE_VIEW_VARIANTS_ENUMS = [
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
];

export const ATTRIBUTE_VIEW_VARIANTS_LIST = [
  { id: ATTRIBUTE_VIEW_VARIANT_LIST, nameString: 'Список' },
  { id: ATTRIBUTE_VIEW_VARIANT_TEXT, nameString: 'Текст' },
  { id: ATTRIBUTE_VIEW_VARIANT_TAG, nameString: 'Тег' },
  { id: ATTRIBUTE_VIEW_VARIANT_ICON, nameString: 'С иконкой' },
  { id: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING, nameString: 'Внешний рейтинг' },
];

// ATTRIBUTE POSITIONS IN TITLE
export const ATTRIBUTE_POSITION_IN_TITLE_BEGIN = 'begin';
export const ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD = 'beforeKeyword';
export const ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD = 'replaceKeyword';
export const ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD = 'afterKeyword';
export const ATTRIBUTE_POSITION_IN_TITLE_END = 'end';

export const ATTRIBUTE_POSITION_IN_TITLE_ENUMS = [
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
];

export const ATTRIBUTE_POSITIONS_LIST = [
  { id: ATTRIBUTE_POSITION_IN_TITLE_BEGIN, nameString: 'В начале предложения' },
  { id: ATTRIBUTE_POSITION_IN_TITLE_END, nameString: 'В конце предложения' },
  { id: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD, nameString: 'Перед ключевым словом' },
  { id: ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD, nameString: 'После ключевого слова' },
  { id: ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD, nameString: 'После ключевое слово' },
];

// PRIORITY
export const DEFAULT_PRIORITY = 1;

// RUBRICS
export const RUBRIC_LEVEL_ZERO = 0;
export const RUBRIC_LEVEL_ONE = 1;
export const RUBRIC_LEVEL_TWO = 2;
export const RUBRIC_LEVEL_THREE = 3;
export const RUBRIC_LEVEL_STEP = 1;

// SORT
export const SORT_ASC = 'asc';
export const SORT_ASC_NUM = 1;
export const SORT_DESC = 'desc';
export const SORT_DESC_NUM = -1;

// CATALOGUE
export const CATALOGUE_PRODUCTS_LIMIT = 30;
export const CATALOGUE_OPTION_SEPARATOR = '-';
export const SORT_BY_KEY = 'sortBy';
export const SORT_DIR_KEY = 'sortDir';
export const CATALOGUE_MIN_PRICE_KEY = 'minPrice';
export const CATALOGUE_MAX_PRICE_KEY = 'maxPrice';
export const CATALOGUE_BRAND_KEY = 'brand';
export const CATALOGUE_BRAND_COLLECTION_KEY = 'brandCollection';
export const CATALOGUE_MANUFACTURER_KEY = 'manufacturer';
export const CATALOGUE_FILTER_EXCLUDED_KEYS = [
  SORT_BY_KEY,
  SORT_DIR_KEY,
  CATALOGUE_MIN_PRICE_KEY,
  CATALOGUE_MAX_PRICE_KEY,
  CATALOGUE_BRAND_KEY,
  CATALOGUE_BRAND_COLLECTION_KEY,
  CATALOGUE_MANUFACTURER_KEY,
];
export const CATALOGUE_FILTER_PRICE_KEYS = [CATALOGUE_MIN_PRICE_KEY, CATALOGUE_MAX_PRICE_KEY];
export const CATALOGUE_FILTER_SORT_KEYS = [SORT_BY_KEY, SORT_DIR_KEY];

// PAGINATION
export const PAGINATION_DEFAULT_LIMIT = 100;
export const SORT_BY_ID_DIRECTION = SORT_DESC_NUM;
export const SORT_BY_CREATED_AT = 'createdAt';
export const PAGE_DEFAULT = 1;

// ORDER LOG VARIANTS
export const ORDER_LOG_VARIANT_STATUS = 'status';
export const ORDER_LOG_VARIANT_MESSAGE = 'message';

export const ORDER_LOG_VARIANTS_ENUMS = [ORDER_LOG_VARIANT_STATUS, ORDER_LOG_VARIANT_MESSAGE];

// ORDER STATUSES SLUGS
export const ORDER_STATUS_NEW = 'new';
export const ORDER_STATUS_CONFIRMED = 'confirmed';
export const ORDER_STATUS_DONE = 'done';
export const ORDER_STATUS_CANCELED = 'canceled';

// LANGUAGES
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
