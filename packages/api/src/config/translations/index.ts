import { get } from 'lodash';
import userTranslations from './userTranslations';
import metricTranslations from './metricTranslations';
import rubricVariantTranslations from './rubricVariantTranslations';
import optionsGroupTranslations from './optionsGroupTranslations';
import attributesGroupTranslations from './attributesGroupTranslations';
import rubricTranslations from './rubricTranslations';
import productTranslations from './productTranslations';

export const translations = {
  ...productTranslations,
  ...userTranslations,
  ...metricTranslations,
  ...rubricVariantTranslations,
  ...optionsGroupTranslations,
  ...attributesGroupTranslations,
  ...rubricTranslations,
};

export const getMessageTranslation = (path: string) => {
  return `${get(translations, path)}`;
};
