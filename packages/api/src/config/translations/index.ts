import { get } from 'lodash';
import metricTranslations from './metricTranslations';
import rubricVariantTranslations from './rubricVariantTranslations';
import optionsGroupTranslations from './optionsGroupTranslations';

export const translations = {
  ...metricTranslations,
  ...rubricVariantTranslations,
  ...optionsGroupTranslations,
};

export const getMessageTranslation = (path: string) => {
  return `${get(translations, path)}`;
};
