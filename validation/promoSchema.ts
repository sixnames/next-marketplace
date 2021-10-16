import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import { companyIdSchema } from 'validation/companySchema';
import {
  objectIdSchema,
  requiredNumberSchema,
  requiredStringTranslationSchema,
} from 'validation/schemaTemplates';
import { shopIdSchema } from 'validation/shopSchema';
import * as Yup from 'yup';

export const promoIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({
    ...args,
    slug: 'validation.promo.id',
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
    shopId: shopIdSchema(args),
    companyId: companyIdSchema(args),
  });
};

export const updatePromoSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    _id: promoIdSchema(args),
    shopId: shopIdSchema(args),
    companyId: companyIdSchema(args),
    ...promoCommonFieldsSchema(args),
  });
};
