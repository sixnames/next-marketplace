import * as Yup from 'yup';
import { phoneSchema, minNameLength, maxNameLength, emailSchema } from './templates';
import getValidationFieldMessage, { SchemaMessagesInterface } from './getValidationFieldMessage';
import { ROLES_ENUM } from '../config';

const minPasswordLength = 5;
const maxPasswordLength = 30;

const id = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.users.id',
      }),
    );

const name = ({ messages, lang }: SchemaMessagesInterface) =>
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

const lastName = ({ messages, lang }: SchemaMessagesInterface) =>
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

const secondName = ({ messages, lang }: SchemaMessagesInterface) =>
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

const roleSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.mixed()
    .oneOf(ROLES_ENUM)
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.users.role',
      }),
    );

export const updateUserSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    id: id({ messages, lang }),
    email: emailSchema({ messages, lang }),
    name: name({ messages, lang }),
    lastName: lastName({ messages, lang }),
    secondName: secondName({ messages, lang }),
    phone: phoneSchema({ messages, lang }),
    role: roleSchema({ messages, lang }),
  });

export const createUserSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    email: emailSchema({ messages, lang }),
    name: name({ messages, lang }),
    lastName: lastName({ messages, lang }),
    secondName: secondName({ messages, lang }),
    phone: phoneSchema({ messages, lang }),
    role: roleSchema({ messages, lang }),
  });

export const signInValidationSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    email: emailSchema({ messages, lang }),
    password: passwordSchema({ messages, lang }),
  });

export const signUpValidationSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    email: emailSchema({ messages, lang }),
    name: name({ messages, lang }),
    lastName: lastName({ messages, lang }),
    secondName: secondName({ messages, lang }),
    phone: phoneSchema({ messages, lang }),
    password: passwordSchema({ messages, lang }),
  });
