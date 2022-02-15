import * as Yup from 'yup';
import { DEFAULT_LOCALE } from '../lib/config/common';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import {
  notRequiredUrlSchema,
  objectIdSchema,
  requiredStringTranslationSchema,
} from 'validation/utils/schemaTemplates';

export const supplierIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.suppliers.id' });
};

export const supplierCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.suppliers.name',
    }),
    descriptionI18n: Yup.object({
      [DEFAULT_LOCALE]: Yup.string().nullable(),
    }).nullable(),
    url: Yup.array().of(notRequiredUrlSchema(args)),
  };
};

export const createSupplierSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...supplierCommonFieldsSchema(args),
  });
};

export const updateSupplierSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    supplierId: supplierIdSchema(args),
    ...supplierCommonFieldsSchema(args),
  });
};
