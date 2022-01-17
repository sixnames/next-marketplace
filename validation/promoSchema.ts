import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import { companyIdSchema } from './companySchema';
import {
  objectIdSchema,
  requiredNumberSchema,
  requiredStringSchema,
  requiredStringTranslationSchema,
} from './schemaTemplates';

export const promoIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({
    ...args,
    slug: 'validation.promo.id',
  });
};

export const promoCodeIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({
    ...args,
    slug: 'validation.promoCode.id',
  });
};

export const promoCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.promo.name',
    }),
    discountPercent: requiredNumberSchema({
      ...args,
      min: 0,
      slug: 'validation.promo.discountPercent',
    }),
    cashbackPercent: requiredNumberSchema({
      ...args,
      min: 0,
      slug: 'validation.promo.cashbackPercent',
    }),
  };
};

export const createPromoSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...promoCommonFieldsSchema(args),
    companyId: companyIdSchema(args),
  });
};

export const updatePromoSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    _id: promoIdSchema(args),
    ...promoCommonFieldsSchema(args),
  });
};

export const createPromoCodeSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    code: requiredStringSchema({
      ...args,
      slug: 'validation.promoCode.code',
    }),
  });
};

export const updatePromoCodeSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    _id: promoCodeIdSchema(args),
    code: requiredStringSchema({
      ...args,
      slug: 'validation.promoCode.code',
    }),
  });
};
