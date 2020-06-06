import { get } from 'lodash';
import metricTranslations from './metricTranslations';
import rubricVariantTranslations from './rubricVariantTranslations';
import optionsGroupTranslations from './optionsGroupTranslations';
import attributesGroupTranslations from './attributesGroupTranslations';
import rubricTranslations from './rubricTranslations';

export const translations = {
  ...metricTranslations,
  ...rubricVariantTranslations,
  ...optionsGroupTranslations,
  ...attributesGroupTranslations,
  ...rubricTranslations,
};

export const getMessageTranslation = (path: string) => {
  return `${get(translations, path)}`;
};
