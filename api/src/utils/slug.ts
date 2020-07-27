import cyrillicToTranslit from 'cyrillic-to-translit-js';
import { LanguageInterface } from './translations/getLangField';
import { DEFAULT_LANG } from '../config';

export const generateSlug = (name: string) => {
  const translit = new cyrillicToTranslit();
  const cleanString = name ? name.replace(/[$-/:-?{-~!"^_`\[\]]/g, '').toLocaleLowerCase() : '';
  return translit.transform(cleanString, '_');
};

export const generateDefaultLangSlug = (languages: LanguageInterface[]) => {
  const defaultValue = languages.find(({ key }) => key === DEFAULT_LANG);
  return generateSlug(defaultValue!.value);
};
