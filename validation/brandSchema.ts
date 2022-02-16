import { DEFAULT_LOCALE } from 'lib/config/common';
import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import {
  notRequiredUrlSchema,
  objectIdSchema,
  requiredStringTranslationSchema,
} from 'validation/utils/schemaTemplates';
import * as Yup from 'yup';

export const brandCollectionIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.brandCollections.id' });
};
export const brandIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.brands.id' });
};

export const brandCollectionCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.brandCollections.name',
    }),
    descriptionI18n: Yup.object({
      [DEFAULT_LOCALE]: Yup.string().nullable(),
    }).nullable(),
  };
};

export const brandCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.brands.name',
    }),
    descriptionI18n: Yup.object({
      [DEFAULT_LOCALE]: Yup.string().nullable(),
    }).nullable(),
    url: Yup.array().of(notRequiredUrlSchema(args)),
  };
};

export const createBrandSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...brandCommonFieldsSchema(args),
  });
};

export const updateBrandSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    _id: brandIdSchema(args),
    ...brandCommonFieldsSchema(args),
  });
};

export const createBrandCollectionSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...brandCollectionCommonFieldsSchema(args),
  });
};

export const updateCollectionInBrandSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    _id: brandCollectionIdSchema(args),
    ...brandCollectionCommonFieldsSchema(args),
  });
};
