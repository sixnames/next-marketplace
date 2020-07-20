import * as Yup from 'yup';
import { langStringInputSchema } from './templates';

export const optionsGroupModalSchema = (lang: string) =>
  Yup.object().shape({
    name: langStringInputSchema({ defaultLang: lang, entityMessage: 'Название группы опций' }),
  });
