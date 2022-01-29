import * as Yup from 'yup';
import {
  TASK_PRICE_ACTION_ADDED,
  TASK_PRICE_ACTION_DELETED,
  TASK_PRICE_ACTION_UPDATED,
  TASK_PRICE_TARGET_FIELD,
  TASK_PRICE_TARGET_SYMBOL,
} from '../config/constantSelects';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import { objectIdSchema, requiredStringTranslationSchema } from './schemaTemplates';

export const taskVariantIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.taskVariants.id' });
};

export const taskVariantCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.taskVariants.name',
    }),
    slug: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.rubrics.name',
    }),
    prices: Yup.array().of(
      Yup.object({
        slug: requiredStringTranslationSchema({
          ...args,
          slug: 'validation.rubrics.name',
        }),
        price: Yup.number().nullable().required(),
        action: Yup.string().oneOf([
          TASK_PRICE_ACTION_ADDED,
          TASK_PRICE_ACTION_DELETED,
          TASK_PRICE_ACTION_UPDATED,
        ]),
        target: Yup.string().oneOf([TASK_PRICE_TARGET_FIELD, TASK_PRICE_TARGET_SYMBOL]),
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
