export const localeString = (value: string | number) => {
  const finalValue = typeof value === 'string' ? parseInt(value) : value;
  return value ? finalValue.toLocaleString('ru-RU') : 0;
};

export const getAttributeVariant = (variant: string) => {
  switch (variant) {
    case 'select':
      return 'Селект';
    case 'multipleSelect':
      return 'Мульти-селект';
    case 'string':
      return 'Строка';
    case 'number':
      return 'Число';
    default:
      return 'Тип не определён';
  }
};
