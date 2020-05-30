import * as Yup from 'yup';
import { name, id } from './templates';

export const createAttributesGroupSchema = Yup.object().shape({
  name,
});

export const updateAttributesGroupSchema = Yup.object().shape({
  id,
  name,
});
