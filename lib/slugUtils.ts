import cyrillicToTranslit from 'cyrillic-to-translit-js';
import { DEFAULT_LOCALE } from '../config/common';
import { TranslationModel } from '../db/dbModels';

export const generateSlug = (name: string) => {
  const translit = new cyrillicToTranslit();
  const cleanString = name
    ? name
        .replace('-', ' ')
        .replace(/[$-/:-?{-~!"^_`[\]]/g, '')
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

export interface GenerateCompanySlugInterface {
  name: string;
  itemId: string;
}

export interface GenerateShopSlugInterface {
  name: string;
  itemId: string;
}

export const generateShopSlug = ({ name, itemId }: GenerateShopSlugInterface) => {
  return generateSlug(`${name} ${itemId}`);
};
