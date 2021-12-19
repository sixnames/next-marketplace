import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import { companyIdSchema } from './companySchema';
import {
  objectIdSchema,
  requiredNumberSchema,
  requiredStringTranslationSchema,
} from './schemaTemplates';

export const userCategoryIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.userCategories.id' });
};

export const userCategoryCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    companyId: companyIdSchema(args),
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.userCategories.name',
    }),
    entryMinCharge: requiredNumberSchema({
      ...args,
      slug: 'validation.userCategories.entryMinCharge',
    }),
  };
};

export const createUserCategorySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...userCategoryCommonFieldsSchema(args),
  });
};

export const updateUserCategorySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    _id: userCategoryIdSchema(args),
    ...userCategoryCommonFieldsSchema(args),
  });
};
