import * as Yup from 'yup';
import { id, langStringInputSchema } from './templates';

export const createMetricInputSchema = (defaultLang: string) =>
  Yup.object().shape({
    name: langStringInputSchema({ defaultLang, entityMessage: 'Название типа измерения' }),
  });

export const updateMetricSchema = (defaultLang: string) =>
  Yup.object().shape({
    id,
    name: langStringInputSchema({ defaultLang, entityMessage: 'Название типа измерения' }),
  });
