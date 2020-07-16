import { get } from 'lodash';
import selectsOptionsTranslations from './selectsOptionsTranslations';
import userTranslations from './userTranslations';
import metricTranslations from './metricTranslations';
import rubricVariantTranslations from './rubricVariantTranslations';
import optionsGroupTranslations from './optionsGroupTranslations';
import attributesGroupTranslations from './attributesGroupTranslations';
import rubricTranslations from './rubricTranslations';
import productTranslations from './productTranslations';

export const translations = {
  ...selectsOptionsTranslations,
  ...productTranslations,
  ...userTranslations,
  ...metricTranslations,
  ...rubricVariantTranslations,
  ...optionsGroupTranslations,
  ...attributesGroupTranslations,
  ...rubricTranslations,
};

export const getMessageTranslation = (path: string): string => {
  return `${get(translations, path)}`;
};
