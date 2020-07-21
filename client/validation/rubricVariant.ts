import * as Yup from 'yup';
import { id, langStringInputSchema } from './templates';

export const rubricVariantModalSchema = (defaultLang: string) =>
  Yup.object().shape({
    name: langStringInputSchema({ defaultLang, entityMessage: 'Название типа рубрики' }),
  });

export const createRubricVariantInputSchema = (defaultLang: string) =>
  Yup.object().shape({
    name: langStringInputSchema({ defaultLang, entityMessage: 'Название типа рубрики' }),
  });

export const updateRubricVariantSchema = (defaultLang: string) =>
  Yup.object().shape({
    id,
    name: langStringInputSchema({ defaultLang, entityMessage: 'Название типа рубрики' }),
  });
