import * as Yup from 'yup';
import { id, langStringInputSchema } from './templates';

export const optionsGroupModalSchema = (defaultLang: string) =>
  Yup.object().shape({
    name: langStringInputSchema({ defaultLang, entityMessage: 'Название группы опций' }),
  });

export const createOptionsGroupSchema = (defaultLang: string) =>
  Yup.object().shape({
    name: langStringInputSchema({ defaultLang, entityMessage: 'Название группы опций' }),
  });

export const updateOptionsGroupSchema = (defaultLang: string) =>
  Yup.object().shape({
    id,
    name: langStringInputSchema({ defaultLang, entityMessage: 'Название группы опций' }),
  });
