import * as Yup from 'yup';
import { name, id } from './templates';

export const createOptionsGroupSchema = Yup.object().shape({
  name,
});

export const updateOptionsGroupSchema = Yup.object().shape({
  id,
  name,
});
