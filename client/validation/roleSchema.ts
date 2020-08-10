import getValidationFieldMessage, {
  MultiLangSchemaMessagesInterface,
  SchemaMessagesInterface,
} from './getValidationFieldMessage';
import * as Yup from 'yup';
import { idSchema, langStringInputSchema, minDescriptionLength } from './schemaTemplates';

const minCustomFilterValue = 2;
const minRestrictedFieldValue = 2;

const roleIdSchema = (args: SchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.roles.id' });

const ruleIdSchema = (args: SchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.roles.ruleId' });

const navItemIdSchema = (args: SchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.roles.navItemId' });

const operationIdSchema = (args: SchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.roles.operationId' });

const roleNameSchema = (args: MultiLangSchemaMessagesInterface) =>
  langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.roles.name',
  });

const roleDescriptionSchema = (args: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .min(
      minDescriptionLength,
      getValidationFieldMessage({ ...args, key: 'validation.string.min' }) +
        ` ${minDescriptionLength}`,
    )
    .required(getValidationFieldMessage({ ...args, key: 'validation.roles.description' }));

export const createRoleSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    name: roleNameSchema(args),
    description: roleDescriptionSchema(args),
    isStuff: Yup.boolean().required(),
  });

export const updateRoleSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: roleIdSchema(args),
    name: roleNameSchema(args),
    description: roleDescriptionSchema(args),
    isStuff: Yup.boolean().required(),
  });

export const setRoleOperationPermissionSchema = (args: SchemaMessagesInterface) =>
  Yup.object().shape({
    roleId: roleIdSchema(args),
    operationId: operationIdSchema(args),
    allow: Yup.boolean().required(),
  });

export const setRoleOperationCustomFilterSchema = (args: SchemaMessagesInterface) =>
  Yup.object().shape({
    roleId: roleIdSchema(args),
    operationId: operationIdSchema(args),
    customFilter: Yup.string().min(minCustomFilterValue).required(),
  });

export const setRoleRuleRestrictedFieldSchema = (args: SchemaMessagesInterface) =>
  Yup.object().shape({
    roleId: roleIdSchema(args),
    ruleId: ruleIdSchema(args),
    restrictedField: Yup.string().min(minRestrictedFieldValue).required(),
  });

export const setRoleAllowedNavItemSchema = (args: SchemaMessagesInterface) =>
  Yup.object().shape({
    roleId: roleIdSchema(args),
    navItemId: navItemIdSchema(args),
  });
