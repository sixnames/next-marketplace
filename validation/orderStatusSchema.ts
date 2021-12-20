import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import {
  objectIdSchema,
  requiredNumberSchema,
  requiredStringSchema,
  requiredStringTranslationSchema,
} from './schemaTemplates';

export const orderStatusIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.orderStatuses.id' });
};

export const orderStatusNameSchema = (args: ValidationSchemaArgsInterface) => {
  return requiredStringTranslationSchema({
    ...args,
    slug: 'validation.orderStatuses.name',
  });
};

export const createOrderStatusSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    nameI18n: orderStatusNameSchema(args),
    color: requiredStringSchema({ ...args, slug: 'validation.orderStatuses.color' }),
    index: requiredNumberSchema({ ...args, slug: 'validation.orderStatuses.index' }),
  });
};

export const updateOrderStatusSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    orderStatusId: orderStatusIdSchema(args),
    nameI18n: orderStatusNameSchema(args),
    color: requiredStringSchema({ ...args, slug: 'validation.orderStatuses.color' }),
    index: requiredNumberSchema({ ...args, slug: 'validation.orderStatuses.index' }),
  });
};
