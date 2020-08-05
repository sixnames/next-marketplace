import * as Yup from 'yup';
import { phoneSchema, minNameLength, maxNameLength, emailSchema } from './schemaTemplates';
import getValidationFieldMessage, { SchemaMessagesInterface } from './getValidationFieldMessage';

const minPasswordLength = 5;
const maxPasswordLength = 30;

const userIdSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.users.id',
      }),
    );

const userNameSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .min(
      minNameLength,
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.string.min',
      }) + ` ${minNameLength}`,
    )
    .max(
      maxNameLength,
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.string.max',
      }) + ` ${maxNameLength}`,
    )
    .trim()
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.users.name',
      }),
    );

const userLastNameSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .trim()
    .max(
      maxNameLength,
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.string.max',
      }) + ` ${maxNameLength}`,
    );

const userSecondNameSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .trim()
    .max(
      maxNameLength,
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.string.max',
      }) + ` ${maxNameLength}`,
    );

const passwordSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .min(
      minPasswordLength,
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.string.min',
      }) + ` ${minPasswordLength}`,
    )
    .max(
      maxPasswordLength,
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.string.max',
      }) + ` ${maxPasswordLength}`,
    )
    .trim()
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.users.password',
      }),
    );

const userRoleSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string().required(
    getValidationFieldMessage({
      messages,
      lang,
      key: 'validation.users.role',
    }),
  );

export const updateUserSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    id: userIdSchema({ messages, lang }),
    email: emailSchema({ messages, lang }),
    name: userNameSchema({ messages, lang }),
    lastName: userLastNameSchema({ messages, lang }),
    secondName: userSecondNameSchema({ messages, lang }),
    phone: phoneSchema({ messages, lang }),
    role: userRoleSchema({ messages, lang }),
  });

export const createUserSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    email: emailSchema({ messages, lang }),
    name: userNameSchema({ messages, lang }),
    lastName: userLastNameSchema({ messages, lang }),
    secondName: userSecondNameSchema({ messages, lang }),
    phone: phoneSchema({ messages, lang }),
    role: userRoleSchema({ messages, lang }),
  });

export const signInValidationSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    email: emailSchema({ messages, lang }),
    password: passwordSchema({ messages, lang }),
  });

export const signUpValidationSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    email: emailSchema({ messages, lang }),
    name: userNameSchema({ messages, lang }),
    lastName: userLastNameSchema({ messages, lang }),
    secondName: userSecondNameSchema({ messages, lang }),
    phone: phoneSchema({ messages, lang }),
    password: passwordSchema({ messages, lang }),
  });
