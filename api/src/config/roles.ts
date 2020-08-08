import { RoleRuleOperationTypeEnum } from '../entities/Role';
import {
  DEFAULT_LANG,
  OPERATION_TYPE_CREATE,
  OPERATION_TYPE_DELETE,
  OPERATION_TYPE_READ,
  OPERATION_TYPE_UPDATE,
  SECONDARY_LANG,
} from './common';

export const ROUTE_APP = '/app';
export const ROUTE_CMS = `${ROUTE_APP}/cms`;

export const OPERATION_TARGET_OPERATION = 'operation';
export const OPERATION_TARGET_FIELD = 'field';

export const ROLE_SLUG_GUEST = 'guest';
export const ROLE_SLUG_ADMIN = 'admin';

export const ROLE_EMPTY_CUSTOM_FILTER = '{}';

const roleRuleOperationsTemplates = [
  {
    operationType: OPERATION_TYPE_CREATE as RoleRuleOperationTypeEnum,
    customFilter: ROLE_EMPTY_CUSTOM_FILTER,
  },
  {
    operationType: OPERATION_TYPE_READ as RoleRuleOperationTypeEnum,
    customFilter: ROLE_EMPTY_CUSTOM_FILTER,
  },
  {
    operationType: OPERATION_TYPE_UPDATE as RoleRuleOperationTypeEnum,
    customFilter: ROLE_EMPTY_CUSTOM_FILTER,
  },
  {
    operationType: OPERATION_TYPE_DELETE as RoleRuleOperationTypeEnum,
    customFilter: ROLE_EMPTY_CUSTOM_FILTER,
  },
];

const guestRoleOperationsAndFields = {
  operations: roleRuleOperationsTemplates.map((operation) => ({
    ...operation,
    allowed: false,
  })),
  restrictedFields: [],
};

const adminRoleOperationsAndFields = {
  operations: roleRuleOperationsTemplates.map((operation) => ({
    ...operation,
    allowed: true,
  })),
  restrictedFields: [],
};

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
    nameString: 'Типы атрибутов',
    entity: 'AttributeVariant',
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
    nameString: 'Группы сообщений',
    entity: 'MessagesGroup',
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

const cmsRoute = {
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
  order: 0,
  icon: 'Settings',
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
      path: `${ROUTE_CMS}/products`,
      icon: '',
      children: [],
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
      path: `${ROUTE_CMS}/rubrics`,
      icon: '',
      children: [],
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
      path: `${ROUTE_CMS}/attributes-groups`,
      icon: '',
      children: [],
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
      path: `${ROUTE_CMS}/options-groups`,
      icon: '',
      children: [],
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
      path: `${ROUTE_CMS}/roles`,
      icon: '',
      children: [],
    },
  ],
};

export const INITIAL_APP_NAVIGATION = [cmsRoute];

export const ROLE_RULES_TEMPLATE_GUEST = ROLE_RULES_TEMPLATE.map((rule) => ({
  ...rule,
  ...guestRoleOperationsAndFields,
}));

export const ROLE_TEMPLATE_GUEST = {
  nameString: 'Гость',
  description: 'Роль назначается новым или не авторизованным пользователям',
  slug: ROLE_SLUG_GUEST,
  isStuff: false,
  rules: ROLE_RULES_TEMPLATE_GUEST,
};

export const ROLE_RULES_TEMPLATE_ADMIN = ROLE_RULES_TEMPLATE.map((rule) => ({
  ...rule,
  ...adminRoleOperationsAndFields,
}));

export const ROLE_TEMPLATE_ADMIN = {
  nameString: 'Админ',
  description: 'Админ',
  slug: ROLE_SLUG_ADMIN,
  isStuff: true,
  rules: ROLE_RULES_TEMPLATE_ADMIN,
};
