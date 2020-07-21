import * as Yup from 'yup';
import { id, langStringInputSchema } from './templates';

export const attributesGroupModalSchema = (defaultLang: string) =>
  Yup.object().shape({
    name: langStringInputSchema({ defaultLang, entityMessage: 'Название группы атрибутов' }),
  });

export const createAttributesGroupSchema = (defaultLang: string) =>
  Yup.object().shape({
    name: langStringInputSchema({ defaultLang, entityMessage: 'Название группы атрибутов' }),
  });

export const updateAttributesGroupSchema = (defaultLang: string) =>
  Yup.object().shape({
    id,
    name: langStringInputSchema({ defaultLang, entityMessage: 'Название группы атрибутов' }),
  });
