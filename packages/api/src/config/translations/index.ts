import { get } from 'lodash';
import metricTranslations from './metricTranslations';
import rubricVariantTranslations from './rubricVariantTranslations';

export const translations = {
  ...metricTranslations,
  ...rubricVariantTranslations,
};

export const getMessageTranslation = (path: string) => {
  return `${get(translations, path)}`;
};
