import { get } from 'lodash';
import selectsOptionsTranslations from './selectsOptionsTranslations';

export const translations = {
  ...selectsOptionsTranslations,
};

export const getMessageTranslation = (path: string): string => {
  return `${get(translations, path)}`;
};
