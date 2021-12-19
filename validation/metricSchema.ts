import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import { objectIdSchema, requiredStringTranslationSchema } from './schemaTemplates';

export const metricIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.metrics.id' });
};

export const metricNameSchema = (args: ValidationSchemaArgsInterface) => {
  return requiredStringTranslationSchema({
    ...args,
    slug: 'validation.metrics.name',
  });
};

export const createMetricSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    nameI18n: metricNameSchema(args),
  });
};

export const updateMetricSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    metricId: metricIdSchema(args),
    nameI18n: metricNameSchema(args),
  });
};
