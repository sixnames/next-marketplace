import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import { objectIdSchema, requiredStringTranslationSchema } from './schemaTemplates';

export const ticketTaskVariantIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.ticketTaskVariants.id' });
};

export const ticketTaskVariantNameSchema = (args: ValidationSchemaArgsInterface) => {
  return requiredStringTranslationSchema({
    ...args,
    slug: 'validation.ticketTaskVariants.name',
  });
};

export const createTicketTaskVariantSchema = (args: ValidationSchemaArgsInterface) =>
  Yup.object().shape({
    nameI18n: ticketTaskVariantNameSchema(args),
  });

export const updateTicketTaskVariantSchema = (args: ValidationSchemaArgsInterface) =>
  Yup.object().shape({
    _id: ticketTaskVariantIdSchema(args),
    nameI18n: ticketTaskVariantNameSchema(args),
  });
