import * as Yup from 'yup';
import { getFieldValidationMessage } from '../lib/getFieldValidationMessage';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import {
  phoneSchema,
  MIN_STRING_FIELD_LENGTH,
  MAX_STRING_FIELD_LENGTH,
  emailSchema,
  objectIdSchema,
} from './schemaTemplates';

const minPasswordLength = 5;
const maxPasswordLength = 30;

export const userIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.users.id' });
};

export const userNameSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.string()
    .nullable()
    .min(
      MIN_STRING_FIELD_LENGTH,
      getFieldValidationMessage({
        ...args,
        slug: 'validation.string.min',
      }) + ` ${MIN_STRING_FIELD_LENGTH}`,
    )
    .max(
      MAX_STRING_FIELD_LENGTH,
      getFieldValidationMessage({
        ...args,
        slug: 'validation.string.max',
      }) + ` ${MAX_STRING_FIELD_LENGTH}`,
    )
    .trim()
    .required(
      getFieldValidationMessage({
        ...args,
        slug: 'validation.users.name',
      }),
    );
};

export const userLastNameSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.string()
    .nullable()
    .trim()
    .max(
      MAX_STRING_FIELD_LENGTH,
      getFieldValidationMessage({
        ...args,
        slug: 'validation.string.max',
      }) + ` ${MAX_STRING_FIELD_LENGTH}`,
    );
};

export const userSecondNameSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.string()
    .nullable()
    .trim()
    .max(
      MAX_STRING_FIELD_LENGTH,
      getFieldValidationMessage({
        ...args,
        slug: 'validation.string.max',
      }) + ` ${MAX_STRING_FIELD_LENGTH}`,
    );
};

export const passwordSchema = (args: ValidationSchemaArgsInterface) =>
  Yup.string()
    .min(
      minPasswordLength,
      getFieldValidationMessage({
        ...args,
        slug: 'validation.string.min',
      }) + ` ${minPasswordLength}`,
    )
    .max(
      maxPasswordLength,
      getFieldValidationMessage({
        ...args,
        slug: 'validation.string.max',
      }) + ` ${maxPasswordLength}`,
    )
    .trim()
    .required(
      getFieldValidationMessage({
        ...args,
        slug: 'validation.users.password',
      }),
    );

export const passwordCompareSchema = (args: ValidationSchemaArgsInterface) =>
  Yup.string()
    .oneOf(
      [Yup.ref('newPassword')],
      getFieldValidationMessage({
        ...args,
        slug: 'validation.users.passwordCompare',
      }),
    )
    .min(
      minPasswordLength,
      getFieldValidationMessage({
        ...args,
        slug: 'validation.string.min',
      }) + ` ${minPasswordLength}`,
    )
    .max(
      maxPasswordLength,
      getFieldValidationMessage({
        ...args,
        slug: 'validation.string.max',
      }) + ` ${maxPasswordLength}`,
    )
    .trim()
    .required(
      getFieldValidationMessage({
        ...args,
        slug: 'validation.users.password',
      }),
    );

export const userRoleIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.users.role' });
};

export const userCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    name: userNameSchema(args),
    lastName: userLastNameSchema(args),
    secondName: userSecondNameSchema(args),
    email: emailSchema(args),
    phone: phoneSchema(args),
  };
};

export const updateMyProfileSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object(userCommonFieldsSchema(args));
};

export const updateMyPasswordSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    oldPassword: passwordSchema(args),
    newPassword: passwordSchema(args),
    newPasswordB: passwordCompareSchema(args),
  });
};

export const updateUserSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    _id: userIdSchema(args),
    roleId: userRoleIdSchema(args),
    ...userCommonFieldsSchema(args),
  });
};

export const createUserSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...userCommonFieldsSchema(args),
    roleId: userRoleIdSchema(args),
  });
};

export const signInSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object().shape({
    email: emailSchema(args),
    password: passwordSchema(args),
  });
};

export const signUpSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object().shape({
    ...userCommonFieldsSchema(args),
    password: passwordSchema(args),
  });
};
