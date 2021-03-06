import {
  objectIdSchema,
  requiredStringSchema,
  requiredStringTranslationSchema,
} from 'validation/utils/schemaTemplates';
import * as Yup from 'yup';
import {
  TASK_PRICE_ACTION_ADDED,
  TASK_PRICE_ACTION_DELETED,
  TASK_PRICE_ACTION_UPDATED,
  TASK_PRICE_TARGET_FIELD,
  TASK_PRICE_TARGET_SYMBOL,
  TASK_PRICE_TARGET_TASK,
} from '../lib/config/constantSelects';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';

export const taskVariantIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.taskVariants.id' });
};

export const taskIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.tasks.id' });
};

export const taskVariantCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.taskVariants.name',
    }),
    slug: requiredStringSchema({
      ...args,
      slug: 'validation.taskVariants.slug',
    }),
    prices: Yup.array().of(
      Yup.object({
        slug: requiredStringSchema({
          ...args,
          slug: 'validation.taskVariants.priceSlug',
        }),
        price: Yup.number().nullable().required(),
        action: Yup.string().oneOf([
          TASK_PRICE_ACTION_ADDED,
          TASK_PRICE_ACTION_DELETED,
          TASK_PRICE_ACTION_UPDATED,
        ]),
        target: Yup.string().oneOf([
          TASK_PRICE_TARGET_FIELD,
          TASK_PRICE_TARGET_SYMBOL,
          TASK_PRICE_TARGET_TASK,
        ]),
      }),
    ),
  };
};

export const createTaskVariantSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...taskVariantCommonFieldsSchema(args),
  });
};

export const updateTaskVariantSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    _id: taskVariantIdSchema(args),
    ...taskVariantCommonFieldsSchema(args),
  });
};

export const updateTaskSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    _id: taskIdSchema(args),
  });
};
