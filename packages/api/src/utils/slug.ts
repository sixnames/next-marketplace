import cyrillicToTranslit from 'cyrillic-to-translit-js';
import { DEFAULT_LANG } from '@yagu/config';
import { LanguageType } from '../entities/commonEntities';

export const generateSlug = (name: string) => {
  const translit = new cyrillicToTranslit();
  const cleanString = name ? name.replace(/[$-/:-?{-~!"^_`\[\]]/g, '').toLocaleLowerCase() : '';
  return translit.transform(cleanString, '_');
};

export const generateDefaultLangSlug = (languages: LanguageType[]) => {
  const defaultValue = languages.find(({ key }) => key === DEFAULT_LANG);
  return generateSlug(defaultValue!.value);
};
