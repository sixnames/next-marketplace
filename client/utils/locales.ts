import {
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  ATTRIBUTE_TYPE_NUMBER,
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPE_STRING,
} from '../config';

export const localeString = (value: string | number) => {
  const finalValue = typeof value === 'string' ? parseInt(value) : value;
  return value ? finalValue.toLocaleString('ru-RU') : 0;
};

export const getAttributeVariant = (variant: string) => {
  switch (variant) {
    case ATTRIBUTE_TYPE_SELECT:
      return 'Селект';
    case ATTRIBUTE_TYPE_MULTIPLE_SELECT:
      return 'Мульти-селект';
    case ATTRIBUTE_TYPE_STRING:
      return 'Строка';
    case ATTRIBUTE_TYPE_NUMBER:
      return 'Число';
    default:
      return 'Тип не определён';
  }
};
