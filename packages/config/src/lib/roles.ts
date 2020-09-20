import {
  DEFAULT_LANG,
  OPERATION_TYPE_CREATE,
  OPERATION_TYPE_DELETE,
  OPERATION_TYPE_READ,
  OPERATION_TYPE_UPDATE,
  ROLE_EMPTY_CUSTOM_FILTER,
  SECONDARY_LANG,
} from './common';

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
  children: [
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
      order: 0,
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
      order: 1,
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
          value: 'Типы рубрик',
        },
        {
          key: SECONDARY_LANG,
          value: 'Rubric variants',
        },
      ],
      order: 2,
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
      order: 3,
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
      order: 4,
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
      order: 5,
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
      order: 6,
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
      order: 7,
      slug: 'cms-roles',
      path: `${ROUTE_CMS}/roles${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
  ],
};
//
export const profileRoute = {
  slug: 'profile',
  name: [
    {
      key: DEFAULT_LANG,
      value: 'Профиль',
    },
    {
      key: SECONDARY_LANG,
      value: 'Profile',
    },
  ],
  order: 99,
  icon: 'user',
  path: `${ROUTE_APP}/profile`,
  navGroup: ROUTE_APP_NAV_GROUP,
  children: [],
};

export const INITIAL_APP_NAVIGATION = [appRoute, cmsRoute, profileRoute];

export const ROLE_SLUG_GUEST = 'guest';
export const ROLE_SLUG_ADMIN = 'admin';

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
];

export const ROLE_TEMPLATE_GUEST = {
  name: [
    { key: DEFAULT_LANG, value: 'Гость' },
    { key: SECONDARY_LANG, value: 'Guest' },
  ],
  nameString: '',
  description: 'Роль назначается новым или не авторизованным пользователям',
  slug: ROLE_SLUG_GUEST,
  isStuff: false,
};

export const ROLE_TEMPLATE_ADMIN = {
  name: [
    { key: DEFAULT_LANG, value: 'Админ' },
    { key: SECONDARY_LANG, value: 'Admin' },
  ],
  nameString: '',
  description: 'Администратор сайта',
  slug: ROLE_SLUG_ADMIN,
  isStuff: true,
};
