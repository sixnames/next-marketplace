import * as Yup from 'yup';
import { langStringInputSchema } from './templates';

export const optionsGroupModalSchema = (defaultLang: string) =>
  Yup.object().shape({
    name: langStringInputSchema({ defaultLang, entityMessage: 'Название группы опций' }),
  });
