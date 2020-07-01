import * as Yup from 'yup';
import { id, langInput, notNullableName } from './templates';

export const createMetricInputSchema = Yup.object().shape({
  name: langInput(notNullableName('Название типа измерения')),
});

export const updateMetricSchema = Yup.object().shape({
  id,
  name: langInput(notNullableName('Название типа измерения')),
});
