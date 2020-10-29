import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
} from '@yagu/config';

export const localeString = (value: string | number) => {
  const finalValue = typeof value === 'string' ? parseInt(value) : value;
  return value ? finalValue.toLocaleString('ru-RU') : 0;
};

export const getAttributeVariantName = (variant: string) => {
  switch (variant) {
    case ATTRIBUTE_VARIANT_SELECT:
      return 'Селект';
    case ATTRIBUTE_VARIANT_MULTIPLE_SELECT:
      return 'Мульти-селект';
    case ATTRIBUTE_VARIANT_STRING:
      return 'Строка';
    case ATTRIBUTE_VARIANT_NUMBER:
      return 'Число';
    default:
      return 'Тип не определён';
  }
};
