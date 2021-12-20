import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import {
  objectIdSchema,
  requiredNumberSchema,
  requiredStringSchema,
  requiredStringTranslationSchema,
} from './schemaTemplates';

export const pagesGroupIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({
    ...args,
    slug: 'validation.pageGroups.id',
  });
};
export const pageIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({
    ...args,
    slug: 'validation.pages.id',
  });
};

export const pagesGroupCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.pageGroups.name',
    }),
    index: requiredNumberSchema({
      ...args,
      slug: 'validation.pageGroups.index',
    }),
  };
};

export const pageCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.pages.name',
    }),
    index: requiredNumberSchema({
      ...args,
      slug: 'validation.pages.index',
    }),
    pagesGroupId: pagesGroupIdSchema(args),
    citySlug: requiredStringSchema({
      ...args,
      slug: 'validation.pages.citySlug',
    }),
  };
};

export const createPagesGroupSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...pagesGroupCommonFieldsSchema(args),
    companySlug: requiredStringSchema({
      ...args,
      slug: 'validation.pageGroups.companySlug',
    }),
  });
};

export const updatePagesGroupSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    _id: pagesGroupIdSchema(args),
    ...pagesGroupCommonFieldsSchema(args),
  });
};

export const createPageSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...pageCommonFieldsSchema(args),
  });
};

export const updatePageSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    _id: pagesGroupIdSchema(args),
    ...pageCommonFieldsSchema(args),
  });
};
