import { get } from 'lodash';
import selectsOptionsTranslations from './selectsOptionsTranslations';

export const translations = {
  ...selectsOptionsTranslations,
};

export const getFieldTranslation = (path: string): string => {
  return `${get(translations, path)}`;
};
