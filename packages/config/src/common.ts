// ERRORS
export const HTTP_QUERY_ERROR = 'HttpQueryError';

// ROLES
export const ROLE_ADMIN = 'ADMIN';
export const ROLE_CUSTOMER = 'CUSTOMER';
export const ROLE_MANAGER = 'MANAGER';
export const ROLE_SUPER = 'SUPER';
export const ROLE_LOGISTICIAN = 'LOGISTICIAN';
export const ROLE_CONTRACTOR = 'CONTRACTOR';
export const ROLE_DRIVER = 'DRIVER';
export const ROLE_HELPER = 'HELPER';
export const ROLE_BOOKKEEPER = 'BOOKKEEPER';
export const ROLE_WAREHOUSE = 'WAREHOUSE';
export const ROLE_STAGE = 'STAGE';

export const ROLES_ENUM = [ROLE_ADMIN, ROLE_CUSTOMER, ROLE_MANAGER];

export const ROLES_LIST = [
  {
    id: ROLE_ADMIN,
    name: 'Админ',
  },
  {
    id: ROLE_CUSTOMER,
    name: 'Клиент',
  },
  {
    id: ROLE_MANAGER,
    name: 'Менеджер',
  },
  {
    id: ROLE_SUPER,
    name: 'Супер-менеджер',
  },
  {
    id: ROLE_LOGISTICIAN,
    name: 'Логист',
  },
  {
    id: ROLE_CONTRACTOR,
    name: 'Подрядчик',
  },
  {
    id: ROLE_DRIVER,
    name: 'Водитель',
  },
  {
    id: ROLE_HELPER,
    name: 'Хелпер',
  },
  {
    id: ROLE_BOOKKEEPER,
    name: 'Бухгалтер',
  },
  {
    id: ROLE_WAREHOUSE,
    name: 'Склад',
  },
  {
    id: ROLE_STAGE,
    name: 'Площадка',
  },
];

// DIRECTORIES
export const ASSETS_PATH = `/assets`;

// ATTRIBUTES
export const ATTRIBUTE_TYPE_SELECT = 'select';
export const ATTRIBUTE_TYPE_MULTIPLE_SELECT = 'multipleSelect';
export const ATTRIBUTE_TYPE_STRING = 'string';
export const ATTRIBUTE_TYPE_NUMBER = 'number';

export const ATTRIBUTE_TYPES_ENUMS = [
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  ATTRIBUTE_TYPE_STRING,
  ATTRIBUTE_TYPE_NUMBER,
];

export const ATTRIBUTE_TYPES_LIST = [
  { id: ATTRIBUTE_TYPE_SELECT, nameString: 'Селект' },
  { id: ATTRIBUTE_TYPE_MULTIPLE_SELECT, nameString: 'Мульти-селект' },
  { id: ATTRIBUTE_TYPE_STRING, nameString: 'Строка' },
  { id: ATTRIBUTE_TYPE_NUMBER, nameString: 'Число' },
];

// PRODUCT CONDITION
export const PRODUCT_CONDITION_PERFECT = 'perfect';
export const PRODUCT_CONDITION_GOOD = 'good';
export const PRODUCT_CONDITION_NORMAL = 'normal';
export const PRODUCT_CONDITION_BAD = 'bad';
export const PRODUCT_CONDITION_AWFUL = 'awful';

export const PRODUCT_CONDITIONS_ENUMS = [
  PRODUCT_CONDITION_PERFECT,
  PRODUCT_CONDITION_GOOD,
  PRODUCT_CONDITION_NORMAL,
  PRODUCT_CONDITION_BAD,
  PRODUCT_CONDITION_AWFUL,
];

export const PRODUCT_CONDITIONS_LIST = [
  { id: PRODUCT_CONDITION_PERFECT, name: 'Отличное' },
  { id: PRODUCT_CONDITION_GOOD, name: 'Хорошее' },
  { id: PRODUCT_CONDITION_NORMAL, name: 'Среднее' },
  { id: PRODUCT_CONDITION_BAD, name: 'Плохое' },
  { id: PRODUCT_CONDITION_AWFUL, name: 'Ужасное' },
];

export const NEGATIVE_INDEX = -1;
export const TABLE_IMAGE_WIDTH = 40;
