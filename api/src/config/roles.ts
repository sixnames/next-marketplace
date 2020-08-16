import {
  DEFAULT_LANG,
  OPERATION_TYPE_CREATE,
  OPERATION_TYPE_DELETE,
  OPERATION_TYPE_READ,
  OPERATION_TYPE_UPDATE,
  ROLE_EMPTY_CUSTOM_FILTER,
  SECONDARY_LANG,
} from './common';
import { Attribute } from '../entities/Attribute';
import { AttributesGroup } from '../entities/AttributesGroup';
import { AttributeVariant } from '../entities/AttributeVariant';
import { Config } from '../entities/Config';
import { City } from '../entities/City';
import { Country } from '../entities/Country';
import { Currency } from '../entities/Currency';
import { Language } from '../entities/Language';
import { Message } from '../entities/Message';
import { Metric } from '../entities/Metric';
import { Option } from '../entities/Option';
import { OptionsGroup } from '../entities/OptionsGroup';
import { Product } from '../entities/Product';
import { Role } from '../entities/Role';
import { Rubric } from '../entities/Rubric';
import { RubricVariant } from '../entities/RubricVariant';
import { User } from '../entities/User';

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
  icon: 'ShoppingCart',
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
  icon: 'Settings',
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

export const INITIAL_APP_NAVIGATION = [appRoute, cmsRoute];

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
    entity: Attribute.name,
  },
  {
    nameString: 'Группы атрибутов',
    entity: AttributesGroup.name,
  },
  {
    nameString: 'Типы атрибутов',
    entity: AttributeVariant.name,
  },
  {
    nameString: 'Настройки сайта',
    entity: Config.name,
  },
  {
    nameString: 'Города',
    entity: City.name,
  },
  {
    nameString: 'Страны',
    entity: Country.name,
  },
  {
    nameString: 'Валюта',
    entity: Currency.name,
  },
  {
    nameString: 'Языки',
    entity: Language.name,
  },
  {
    nameString: 'Сообщения системы',
    entity: Message.name,
  },
  {
    nameString: 'Единицы измерения',
    entity: Metric.name,
  },
  {
    nameString: 'Опции',
    entity: Option.name,
  },
  {
    nameString: 'Группы опций',
    entity: OptionsGroup.name,
  },
  {
    nameString: 'Товары',
    entity: Product.name,
  },
  {
    nameString: 'Роли',
    entity: Role.name,
  },
  {
    nameString: 'Рубрики',
    entity: Rubric.name,
  },
  {
    nameString: 'Типы рубрик',
    entity: RubricVariant.name,
  },
  {
    nameString: 'Пользователи',
    entity: User.name,
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
