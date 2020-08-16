import * as Yup from 'yup';
import { phoneSchema, minNameLength, maxNameLength, emailSchema } from './schemaTemplates';
import getFieldValidationMessage, {
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';

const minPasswordLength = 5;
const maxPasswordLength = 30;

const userIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.users.id',
      }),
    );

const userNameSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .min(
      minNameLength,
      getFieldValidationMessage({
        ...args,
        key: 'validation.string.min',
      }) + ` ${minNameLength}`,
    )
    .max(
      maxNameLength,
      getFieldValidationMessage({
        ...args,
        key: 'validation.string.max',
      }) + ` ${maxNameLength}`,
    )
    .trim()
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.users.name',
      }),
    );

const userLastNameSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .trim()
    .max(
      maxNameLength,
      getFieldValidationMessage({
        ...args,
        key: 'validation.string.max',
      }) + ` ${maxNameLength}`,
    );

const userSecondNameSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .trim()
    .max(
      maxNameLength,
      getFieldValidationMessage({
        ...args,
        key: 'validation.string.max',
      }) + ` ${maxNameLength}`,
    );

const passwordSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .min(
      minPasswordLength,
      getFieldValidationMessage({
        ...args,
        key: 'validation.string.min',
      }) + ` ${minPasswordLength}`,
    )
    .max(
      maxPasswordLength,
      getFieldValidationMessage({
        ...args,
        key: 'validation.string.max',
      }) + ` ${maxPasswordLength}`,
    )
    .trim()
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.users.password',
      }),
    );

const userRoleSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string().required(
    getFieldValidationMessage({
      ...args,
      key: 'validation.users.role',
    }),
  );

export const updateUserSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: userIdSchema(args),
    email: emailSchema(args),
    name: userNameSchema(args),
    lastName: userLastNameSchema(args),
    secondName: userSecondNameSchema(args),
    phone: phoneSchema(args),
    role: userRoleSchema(args),
  });

export const createUserSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    email: emailSchema(args),
    name: userNameSchema(args),
    lastName: userLastNameSchema(args),
    secondName: userSecondNameSchema(args),
    phone: phoneSchema(args),
    role: userRoleSchema(args),
  });

export const signInValidationSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    email: emailSchema(args),
    password: passwordSchema(args),
  });

export const signUpValidationSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    email: emailSchema(args),
    name: userNameSchema(args),
    lastName: userLastNameSchema(args),
    secondName: userSecondNameSchema(args),
    phone: phoneSchema(args),
    password: passwordSchema(args),
  });
