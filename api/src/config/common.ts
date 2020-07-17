// Internationalization
export const LANG_COOKIE_KEY = 'lang';
export const LANG_COOKIE_HEADER = 'accept-language';
export const LANG_NOT_FOUND_FIELD_MESSAGE = 'Field not found';
export const DEFAULT_LANG = 'ru';
export const SECONDARY_LANG = 'en';
export const LANG_DEFAULT_TITLE_SEPARATOR = ' или ';
export const LANG_SECONDARY_TITLE_SEPARATOR = ' or ';

// Cities
export const DEFAULT_CITY = 'moscow';

// ROLES
export const ROLE_ADMIN = 'ADMIN';
export const ROLE_CUSTOMER = 'CUSTOMER';
export const ROLE_MANAGER = 'MANAGER';
export const ROLE_SUPER = 'SUPER';

export const ROLES_ENUM = [ROLE_ADMIN, ROLE_CUSTOMER, ROLE_MANAGER, ROLE_SUPER];

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
];

// GENDER
export const GENDER_SHE = 'she';
export const GENDER_HE = 'he';
export const GENDER_IT = 'it';

export const GENDER_ENUMS = [GENDER_HE, GENDER_SHE, GENDER_IT];

export const GENDER_LIST = [
  { id: GENDER_SHE, nameString: 'Женский' },
  { id: GENDER_HE, nameString: 'Мужской' },
  { id: GENDER_IT, nameString: 'Средний' },
];

// ATTRIBUTE VARIANTS
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

// RUBRICS
export const RUBRIC_LEVEL_ZERO = 0;
export const RUBRIC_LEVEL_ONE = 1;
export const RUBRIC_LEVEL_TWO = 2;
export const RUBRIC_LEVEL_THREE = 3;
export const RUBRIC_LEVEL_STEP = 1;
