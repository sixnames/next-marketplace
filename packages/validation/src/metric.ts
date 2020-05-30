import * as Yup from 'yup';
import { name, id } from './templates';

export const createMetricInputSchema = Yup.object().shape({
  name,
});

export const updateMetricSchema = Yup.object().shape({
  id,
  name,
});
