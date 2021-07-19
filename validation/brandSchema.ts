import {
  notRequiredUrlSchema,
  objectIdSchema,
  requiredStringTranslationSchema,
} from 'validation/schemaTemplates';
import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import * as Yup from 'yup';
import { DEFAULT_LOCALE } from 'config/common';

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
    brandId: brandIdSchema(args),
    ...brandCommonFieldsSchema(args),
  });
};

export const addCollectionToBrandSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    brandId: brandIdSchema(args),
    ...brandCollectionCommonFieldsSchema(args),
  });
};

export const updateCollectionInBrandSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    brandId: brandIdSchema(args),
    brandCollectionId: brandCollectionIdSchema(args),
    ...brandCollectionCommonFieldsSchema(args),
  });
};

export const deleteCollectionFromBrandSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    brandId: brandIdSchema(args),
    brandCollectionId: brandCollectionIdSchema(args),
  });
};
