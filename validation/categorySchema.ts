import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import { rubricIdSchema } from './rubricSchema';
import { objectIdSchema, requiredStringTranslationSchema } from './schemaTemplates';

export const categoryIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.categories.id' });
};

export const categoryCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    rubricId: rubricIdSchema(args),
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.categories.name',
    }),
  };
};

export const createCategorySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object(categoryCommonFieldsSchema(args));
};

export const updateCategorySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    categoryId: categoryIdSchema(args),
    ...categoryCommonFieldsSchema(args),
  });
};
