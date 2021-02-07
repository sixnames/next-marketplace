import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import * as Yup from 'yup';
import {
  colorSchema,
  objectIdSchema,
  requiredStringTranslationSchema,
} from 'validation/schemaTemplates';
import { GENDER_ENUMS } from 'config/common';
import { getFieldValidationMessage } from '../lib/getFieldValidationMessage';

// Options group schemas
export const optionsGroupIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.optionsGroup.id' });
};
export const optionIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.option.id' });
};

export const optionsGroupNameSchema = (args: ValidationSchemaArgsInterface) => {
  return requiredStringTranslationSchema({
    ...args,
    slug: 'validation.optionsGroup.name',
  });
};

export const createOptionsGroupSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    nameI18n: optionsGroupNameSchema(args),
  });
};

export const optionsGroupModalSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    nameI18n: optionsGroupNameSchema(args),
  });
};

export const updateOptionsGroupSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    optionsGroupId: optionsGroupIdSchema(args),
    nameI18n: optionsGroupNameSchema(args),
  });
};

// Option schemas
export const optionVariantSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    gender: Yup.mixed()
      .oneOf(GENDER_ENUMS)
      .required(
        getFieldValidationMessage({
          ...args,
          slug: 'validation.option.variantGender',
        }),
      ),
    value: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.option.variantValue',
    }),
  });
};

export const optionInGroupCommonSchema = (args: ValidationSchemaArgsInterface) => ({
  nameI18n: requiredStringTranslationSchema({
    ...args,
    slug: 'validation.option.name',
  }),
  color: colorSchema(args),
  variants: Yup.array().of(optionVariantSchema(args)),
  gender: Yup.mixed()
    .oneOf(GENDER_ENUMS)
    .required(getFieldValidationMessage({ ...args, slug: 'validation.option.gender' })),
});

export const addOptionToGroupSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    optionsGroupId: optionsGroupIdSchema(args),
    ...optionInGroupCommonSchema(args),
  });
};

export const addOptionToOptionSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    optionsGroupId: optionsGroupIdSchema(args),
    optionId: optionIdSchema(args),
    ...optionInGroupCommonSchema(args),
  });
};

export const optionInGroupModalSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...optionInGroupCommonSchema(args),
  });
};

export const updateOptionInGroupSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    optionsGroupId: optionsGroupIdSchema(args),
    optionId: optionIdSchema(args),
    ...optionInGroupCommonSchema(args),
  });
};

export const deleteOptionFromGroupSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    optionsGroupId: optionsGroupIdSchema(args),
    optionId: optionIdSchema(args),
  });
};
