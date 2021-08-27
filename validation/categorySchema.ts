import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import { rubricIdSchema } from 'validation/rubricSchema';
import { objectIdSchema, requiredStringTranslationSchema } from 'validation/schemaTemplates';
import * as Yup from 'yup';
import { attributeIdSchema, attributesGroupIdSchema } from 'validation/attributesGroupSchema';

export const categoryIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.categories.id' });
};

export const categoryCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    rubricId: rubricIdSchema(args),
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.categories.name',
    }),
  };
};

export const createCategorySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object(categoryCommonFieldsSchema(args));
};

export const updateCategorySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    categoryId: categoryIdSchema(args),
    ...categoryCommonFieldsSchema(args),
  });
};

export const addAttributesGroupToCategorySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    categoryId: categoryIdSchema(args),
    attributesGroupId: attributesGroupIdSchema(args),
  });
};

export const deleteAttributesGroupFromCategorySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    categoryId: categoryIdSchema(args),
    attributesGroupId: attributesGroupIdSchema(args),
  });
};

export const updateAttributesGroupInCategorySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    categoryId: categoryIdSchema(args),
    attributeId: attributeIdSchema(args),
  });
};