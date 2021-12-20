import * as Yup from 'yup';
import { getFieldValidationMessage } from '../lib/getFieldValidationMessage';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import {
  objectIdSchema,
  requiredStringSchema,
  requiredStringTranslationSchema,
} from './schemaTemplates';

export const roleIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.roles.id' });
};

export const roleRuleIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.roleRules.id' });
};

export const roleCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.roles.name',
    }),
  };
};

export const roleRuleCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    roleId: roleIdSchema(args),
    slug: requiredStringSchema({
      ...args,
      slug: 'validation.rolesRule.slug',
    }),
    allow: Yup.boolean().required(
      getFieldValidationMessage({
        ...args,
        slug: 'validation.rolesRule.slug',
      }),
    ),
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.roleRules.name',
    }),
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

export const createRoleRuleSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...roleRuleCommonFieldsSchema(args),
  });
};

export const updateRoleRuleSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    _id: roleRuleIdSchema(args),
    ...roleRuleCommonFieldsSchema(args),
  });
};
