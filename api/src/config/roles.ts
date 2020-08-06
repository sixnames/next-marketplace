import { RoleRuleOperationTypeEnum } from '../entities/Role';
import {
  OPERATION_TYPE_CREATE,
  OPERATION_TYPE_DELETE,
  OPERATION_TYPE_READ,
  OPERATION_TYPE_UPDATE,
} from './common';

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

const guestRoleRules = [
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

export const ROLE_TEMPLATE_GUEST = {
  nameString: 'Гость',
  description: 'Роль назначается новым или не авторизованным пользователям',
  slug: ROLE_SLUG_GUEST,
  isStuff: false,
  rules: guestRoleRules.map((rule) => ({
    ...rule,
    ...guestRoleOperationsAndFields,
  })),
};

export const ROLE_TEMPLATE_ADMIN = {
  nameString: 'Админ',
  description: 'Админ',
  slug: ROLE_SLUG_ADMIN,
  isStuff: true,
  rules: guestRoleRules.map((rule) => ({
    ...rule,
    ...adminRoleOperationsAndFields,
  })),
};
