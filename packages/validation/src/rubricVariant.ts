import * as Yup from 'yup';
import { name, id } from './templates';

export const createRubricVariantInputSchema = Yup.object().shape({
  name,
});

export const updateRubricVariantSchema = Yup.object().shape({
  id,
  name,
});
