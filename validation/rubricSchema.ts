import * as Yup from 'yup';
import { GENDER_ENUMS } from '../config/common';
import { getFieldValidationMessage } from '../lib/getFieldValidationMessage';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import { attributesGroupIdSchema } from './attributesGroupSchema';
import { rubricVariantIdSchema } from './rubricVariantSchema';
import { objectIdSchema, requiredStringTranslationSchema } from './schemaTemplates';

export const rubricIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.rubrics.id' });
};

export const rubricCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.rubrics.name',
    }),
    descriptionI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.rubrics.name',
    }),
    shortDescriptionI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.rubrics.name',
    }),
    variantId: rubricVariantIdSchema(args),
    defaultTitleI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.rubrics.defaultTitle',
    }),
    keywordI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.rubrics.keyword',
    }),
    gender: Yup.mixed()
      .oneOf(GENDER_ENUMS)
      .required(getFieldValidationMessage({ ...args, slug: 'validation.rubrics.gender' })),
  };
};

export const createRubricSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object(rubricCommonFieldsSchema(args));
};

export const updateRubricSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    rubricId: rubricIdSchema(args),
    ...rubricCommonFieldsSchema(args),
  });
};

export const addAttributesGroupToRubricSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    rubricId: rubricIdSchema(args),
    attributesGroupId: attributesGroupIdSchema(args),
  });
};

export const deleteAttributesGroupFromRubricSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    rubricId: rubricIdSchema(args),
    attributesGroupId: attributesGroupIdSchema(args),
  });
};
