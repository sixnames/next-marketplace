import { get } from 'lodash';
import metricTranslations from './metricTranslations';

export const translations = {
  ...metricTranslations,
};

export const getMessageTranslation = (path: string) => {
  return `${get(translations, path)}`;
};
