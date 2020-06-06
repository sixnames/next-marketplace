import { get } from 'lodash';
import metricTranslations from './metricTranslations';
import rubricVariantTranslations from './rubricVariantTranslations';
import optionsGroupTranslations from './optionsGroupTranslations';
import attributesGroupTranslations from './attributesGroupTranslations';

export const translations = {
  ...metricTranslations,
  ...rubricVariantTranslations,
  ...optionsGroupTranslations,
  ...attributesGroupTranslations,
};

export const getMessageTranslation = (path: string) => {
  return `${get(translations, path)}`;
};
