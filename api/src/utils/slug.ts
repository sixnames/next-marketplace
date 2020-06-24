import cyrillicToTranslit from 'cyrillic-to-translit-js';
import { LanguageInterface } from './getLangField';
import { DEFAULT_LANG } from '../config';

export const generateSlug = (name: string) => {
  const translit = new cyrillicToTranslit();
  return translit.transform(name ? `${name}` : '', '_');
};

export const generateDefaultLangSlug = (languages: LanguageInterface[]) => {
  const defaultValue = languages.find(({ key }) => key === DEFAULT_LANG);
  return generateSlug(defaultValue!.value);
};
