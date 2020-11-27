import * as Yup from 'yup';
import {
  phoneSchema,
  minNameLength,
  maxNameLength,
  emailSchema,
  idSchema,
} from './schemaTemplates';
import {
  getFieldValidationMessage,
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';

const minPasswordLength = 5;
const maxPasswordLength = 30;

const userIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.users.id' });

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

const passwordCompareSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .oneOf(
      [Yup.ref('newPassword')],
      getFieldValidationMessage({
        ...args,
        key: 'validation.users.passwordCompare',
      }),
    )
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

export const updateMyProfileSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: userIdSchema(args),
    email: emailSchema(args),
    name: userNameSchema(args),
    lastName: userLastNameSchema(args),
    secondName: userSecondNameSchema(args),
    phone: phoneSchema(args),
  });

export const updateMyPasswordSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: userIdSchema(args),
    oldPassword: passwordSchema(args),
    newPassword: passwordSchema(args),
    newPasswordB: passwordCompareSchema(args),
  });

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
