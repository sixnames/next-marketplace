import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import { objectIdSchema, requiredStringTranslationSchema } from './schemaTemplates';

export const taskVariantIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.taskVariants.id' });
};

export const taskVariantNameSchema = (args: ValidationSchemaArgsInterface) => {
  return requiredStringTranslationSchema({
    ...args,
    slug: 'validation.taskVariants.name',
  });
};

export const createTaskVariantSchema = (args: ValidationSchemaArgsInterface) =>
  Yup.object().shape({
    nameI18n: taskVariantNameSchema(args),
  });

export const updateTaskVariantSchema = (args: ValidationSchemaArgsInterface) =>
  Yup.object().shape({
    _id: taskVariantIdSchema(args),
    nameI18n: taskVariantNameSchema(args),
  });
