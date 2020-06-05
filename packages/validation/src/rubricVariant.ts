import * as Yup from 'yup';
import { id, langInput, notNullableName } from './templates';

export const createRubricVariantInputSchema = Yup.object().shape({
  name: langInput(notNullableName('Название типа рубрики')),
});

export const updateRubricVariantSchema = Yup.object().shape({
  id,
  name: langInput(notNullableName('Название типа рубрики')),
});
