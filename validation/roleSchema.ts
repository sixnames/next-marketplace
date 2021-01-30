import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import { objectIdSchema, requiredStringTranslationSchema } from 'validation/schemaTemplates';
import * as Yup from 'yup';

export const roleIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.roles.id' });
};

export const roleCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.roles.name',
    }),
    description: Yup.string().nullable(),
  };
};

export const createRoleSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...roleCommonFieldsSchema(args),
  });
};

export const updateRoleSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    roleId: roleIdSchema(args),
    ...roleCommonFieldsSchema(args),
  });
};
