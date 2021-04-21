import cyrillicToTranslit from 'cyrillic-to-translit-js';
import { TranslationModel } from 'db/dbModels';
import { DEFAULT_LOCALE } from 'config/common';

export const generateSlug = (name: string) => {
  const translit = new cyrillicToTranslit();
  const cleanString = name
    ? name
        .replace('-', ' ')
        .replace(/[$-/:-?{-~!"^_`\[\]]/g, '')
        .toLocaleLowerCase()
    : '';
  return translit.transform(cleanString, '_');
};

export const generateDefaultLangSlug = (languages: TranslationModel) => {
  const defaultValue = languages[DEFAULT_LOCALE];
  if (!defaultValue) {
    throw Error('defaultValue not found in generateDefaultLangSlug');
  }
  return generateSlug(defaultValue);
};

export interface generateProductSlugInterface {
  nameI18n: TranslationModel;
  itemId: string;
}

export const generateProductSlug = ({ nameI18n, itemId }: generateProductSlugInterface) => {
  const defaultValue = nameI18n[DEFAULT_LOCALE];
  if (!defaultValue) {
    throw Error('defaultValue not found in generateDefaultLangSlug');
  }
  return generateSlug(`${defaultValue} ${itemId}`);
};
