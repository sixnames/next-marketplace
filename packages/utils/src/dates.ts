import { format, isValid } from 'date-fns';
// TODO add formats to the config
export const dateFormat = (value: string) => {
  const date = new Date(value);
  if (isValid(date)) {
    return {
      isValid: true,
      date: format(date, 'dd.MM.Y'),
    };
  }

  return {
    isValid: false,
    date: value,
  };
};

export const dateTimeFormat = (value: string) => {
  const date = new Date(value);
  if (isValid(date)) {
    return {
      isValid: true,
      date: format(date, 'dd.MM.Y'),
      time: format(date, 'HH:mm'),
    };
  }

  return {
    isValid: false,
    date: value,
  };
};
