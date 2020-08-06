import { RoleRuleOperationTypeEnum } from '../entities/Role';

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

export const OPERATION_TARGET_OPERATION = 'operation';
export const OPERATION_TARGET_FIELD = 'field';

export const ROLE_SLUG_GUEST = 'guest';
export const ROLE_SLUG_ADMIN = 'admin';

export const ROLE_EMPTY_CUSTOM_FILTER = '{}';

export const ROLE_CUSTOM_FILTER_AUTHENTICATED_USER_ID = '__authenticatedUser';

/*
 * customFilter: rule in JSON format
 */

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
  fields: [],
};
//
const adminRoleOperationsAndFields = {
  operations: roleRuleOperationsTemplates.map((operation) => ({
    ...operation,
    allowed: true,
  })),
  restrictedFields: [],
};

const guestRoleRules = [
  {
    nameString: 'Атрибут',
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
    nameString: 'Города',
    entity: 'Country',
  },
  {
    nameString: 'Города',
    entity: 'Currency',
  },
  {
    nameString: 'Города',
    entity: 'Language',
  },
  {
    nameString: 'Города',
    entity: 'Message',
  },
  {
    nameString: 'Города',
    entity: 'MessagesGroup',
  },
  {
    nameString: 'Города',
    entity: 'Metric',
  },
  {
    nameString: 'Города',
    entity: 'Option',
  },
  {
    nameString: 'Города',
    entity: 'OptionsGroup',
  },
  {
    nameString: 'Города',
    entity: 'Product',
  },
  {
    nameString: 'Города',
    entity: 'Role',
  },
  {
    nameString: 'Города',
    entity: 'Rubric',
  },
  {
    nameString: 'Города',
    entity: 'RubricVariant',
  },
  {
    nameString: 'Пользователь',
    entity: 'User',
  },
];

export const ROLE_TEMPLATE_GUEST = {
  nameString: 'Гость',
  description: 'Роль назначается новым или не авторизованным пользователям',
  slug: ROLE_SLUG_GUEST,
  rules: guestRoleRules.map((rule) => ({
    ...rule,
    ...guestRoleOperationsAndFields,
  })),
};

export const ROLE_TEMPLATE_ADMIN = {
  nameString: 'Админ',
  description: 'Админ',
  slug: ROLE_SLUG_ADMIN,
  rules: guestRoleRules.map((rule) => ({
    ...rule,
    ...adminRoleOperationsAndFields,
  })),
};
