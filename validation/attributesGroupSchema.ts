import * as Yup from 'yup';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANTS_ENUMS,
  ATTRIBUTE_VIEW_VARIANTS_ENUMS,
  DEFAULT_LOCALE,
} from '../config/common';
import { getFieldValidationMessage } from '../lib/getFieldValidationMessage';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import { objectIdSchema, requiredStringTranslationSchema } from './schemaTemplates';

export const attributesGroupIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.attributesGroups.id' });
};

export const attributeIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.attributes.id' });
};

export const attributesGroupNameSchema = (args: ValidationSchemaArgsInterface) => {
  return requiredStringTranslationSchema({
    ...args,
    slug: 'validation.attributesGroups.name',
  });
};

export const attributeVariantSchema = (args: ValidationSchemaArgsInterface) =>
  Yup.mixed()
    .oneOf(ATTRIBUTE_VARIANTS_ENUMS)
    .required(
      getFieldValidationMessage({
        ...args,
        slug: 'validation.attributes.variant',
      }),
    );

export const attributeViewVariantSchema = (args: ValidationSchemaArgsInterface) =>
  Yup.mixed()
    .oneOf(ATTRIBUTE_VIEW_VARIANTS_ENUMS)
    .required(
      getFieldValidationMessage({
        ...args,
        slug: 'validation.attributes.viewVariant',
      }),
    );

export const attributePositioningInTitleSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object().when('variant', {
    is: (variant: string) => {
      return variant === ATTRIBUTE_VARIANT_SELECT;
    },
    then: Yup.object({
      [DEFAULT_LOCALE]: Yup.string().required(
        getFieldValidationMessage({
          ...args,
          slug: 'validation.attributes.position',
        }),
      ),
    }).nullable(),
    otherwise: Yup.object().nullable(),
  });
};

export const attributeCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.attributesGroups.name',
    }),
    optionsGroupId: Yup.string()
      .nullable()
      .when('variant', {
        is: (variant: string) => {
          return (
            variant === ATTRIBUTE_VARIANT_SELECT || variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT
          );
        },
        then: Yup.string()
          .nullable()
          .required(
            getFieldValidationMessage({
              ...args,
              slug: 'validation.attributes.options',
            }),
          ),
        otherwise: Yup.string().nullable(),
      }),
    positioningInTitle: attributePositioningInTitleSchema(args),
    metricId: Yup.string().nullable(),
    variant: attributeVariantSchema(args),
    viewVariant: attributeViewVariantSchema(args),
  };
};

export const attributesGroupModalSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    nameI18n: attributesGroupNameSchema(args),
  });
};

export const createAttributesGroupSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    nameI18n: attributesGroupNameSchema(args),
  });
};

export const updateAttributesGroupSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    attributesGroupId: attributesGroupIdSchema(args),
    nameI18n: attributesGroupNameSchema(args),
  });
};

export const addAttributeToGroupSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    attributesGroupId: attributesGroupIdSchema(args),
    ...attributeCommonFieldsSchema(args),
  });
};

export const updateAttributeInGroupSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    attributesGroupId: attributesGroupIdSchema(args),
    attributeId: attributeIdSchema(args),
    ...attributeCommonFieldsSchema(args),
  });
};

export const attributeInGroupModalSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...attributeCommonFieldsSchema(args),
  });
};
