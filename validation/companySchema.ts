import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import {
  contactsInputSchema,
  notRequiredDomainSchema,
  objectIdSchema,
  requiredStringSchema,
} from './schemaTemplates';
import { shopFieldsSchema, shopIdSchema } from './shopSchema';

export const companyIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.companies.id' });
};

export const companyCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    name: requiredStringSchema({
      ...args,
      slug: 'validation.companies.nameString',
    }),
    contacts: contactsInputSchema(args),
  };
};

export const createCompanySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...companyCommonFieldsSchema(args),
    ownerId: objectIdSchema({ ...args, slug: 'validation.companies.owner' }),
    staffIds: Yup.array().of(objectIdSchema({ ...args, slug: 'validation.companies.staff' })),
  });
};

export const createCompanyClientSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...companyCommonFieldsSchema(args),
  });
};

export const updateCompanySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    domain: notRequiredDomainSchema(args),
    companyId: companyIdSchema(args),
    ...companyCommonFieldsSchema(args),
  });
};

export const updateCompanyClientSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    domain: notRequiredDomainSchema(args),
    ...companyCommonFieldsSchema(args),
  });
};

export const addShopToCompanySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    companyId: companyIdSchema(args),
    ...shopFieldsSchema(args),
  });
};

export const deleteShopFromCompanySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    companyId: companyIdSchema(args),
    shopId: shopIdSchema(args),
  });
};
