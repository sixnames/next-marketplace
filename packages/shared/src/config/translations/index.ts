import { get } from 'lodash';
import selectsOptionsTranslations from './selectsOptionsTranslations';

export const getFieldTranslation = (path: string): string => {
  return `${get(selectsOptionsTranslations, path)}`;
};
