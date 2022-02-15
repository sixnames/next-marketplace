import * as Yup from 'yup';
import { DEFAULT_LOCALE } from '../lib/config/common';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import {
  notRequiredUrlSchema,
  objectIdSchema,
  requiredStringTranslationSchema,
} from 'validation/utils/schemaTemplates';

export const manufacturerIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.manufacturers.id' });
};

export const manufacturerCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.manufacturers.name',
    }),
    descriptionI18n: Yup.object({
      [DEFAULT_LOCALE]: Yup.string().nullable(),
    }).nullable(),
    url: Yup.array().of(notRequiredUrlSchema(args)),
  };
};

export const createManufacturerSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...manufacturerCommonFieldsSchema(args),
  });
};

export const updateManufacturerSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    manufacturerId: manufacturerIdSchema(args),
    ...manufacturerCommonFieldsSchema(args),
  });
};
