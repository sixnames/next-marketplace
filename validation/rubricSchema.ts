import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import { objectIdSchema, requiredStringTranslationSchema } from 'validation/schemaTemplates';
import * as Yup from 'yup';
import { GENDER_ENUMS } from 'config/common';
import { attributeIdSchema, attributesGroupIdSchema } from 'validation/attributesGroupSchema';
import { productIdSchema } from 'validation/productSchema';
import { rubricVariantIdSchema } from 'validation/rubricVariantSchema';
import { getFieldValidationMessage } from '../lib/getFieldValidationMessage';

export const rubricIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.rubrics.id' });
};

export const rubricCatalogueTitleSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
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
  });
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
    catalogueTitle: rubricCatalogueTitleSchema(args),
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

export const updateAttributesGroupInRubricSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    rubricId: rubricIdSchema(args),
    attributesGroupId: attributesGroupIdSchema(args),
    attributeId: attributeIdSchema(args),
  });
};

export const addProductToRubricSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    rubricId: rubricIdSchema(args),
    productId: productIdSchema(args),
  });
};

export const deleteProductFromRubricSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    rubricId: rubricIdSchema(args),
    productId: productIdSchema(args),
  });
};
