import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import { objectIdSchema, requiredStringSchema } from './schemaTemplates';

const currencyNameMinLength = 1;

export const currencyIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.currencies.id' });
};

export const currencyNameSchema = (args: ValidationSchemaArgsInterface) => {
  return requiredStringSchema({
    ...args,
    min: currencyNameMinLength,
    slug: 'validation.countries.currency',
  });
};

export const createCurrencySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    name: currencyNameSchema(args),
  });
};

export const updateCurrencySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    currencyId: currencyIdSchema(args),
    name: currencyNameSchema(args),
  });
};
