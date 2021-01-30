import { objectIdSchema, requiredStringSchema } from 'validation/schemaTemplates';
import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import * as Yup from 'yup';

export const languageIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.languages.id' });
};

export const commonLanguageSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    slug: requiredStringSchema({ ...args, slug: 'validation.languages.slug' }),
    name: requiredStringSchema({ ...args, slug: 'validation.languages.name' }),
    nativeName: requiredStringSchema({
      ...args,
      slug: 'validation.languages.nativeName',
    }),
  };
};

export const createLanguageSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...commonLanguageSchema(args),
  });
};

export const languageInModalSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...commonLanguageSchema(args),
  });
};

export const updateLanguageSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    languageId: languageIdSchema(args),
    ...commonLanguageSchema(args),
  });
};
