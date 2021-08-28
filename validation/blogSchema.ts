import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import { objectIdSchema, requiredStringTranslationSchema } from 'validation/schemaTemplates';
import * as Yup from 'yup';

export const blogPostIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({
    ...args,
    slug: 'validation.blogPosts.id',
  });
};

export const blogAttributeIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({
    ...args,
    slug: 'validation.blogAttributes.id',
  });
};

export const blogPostCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    titleI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.blogPosts.title',
    }),
    description18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.blogPosts.description',
    }),
  };
};

export const blogAttributeCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.blogAttributes.name',
    }),
    optionsGroupId: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.blogAttributes.optionsGroupId',
    }),
  };
};

export const createBlogAttributeSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...blogAttributeCommonFieldsSchema(args),
  });
};

export const updateBlogAttributeSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    blogAttributeId: blogAttributeIdSchema(args),
    ...blogAttributeCommonFieldsSchema(args),
  });
};

export const createBlogPostSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...blogPostCommonFieldsSchema(args),
  });
};

export const updateBlogPostSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    blogAttributeId: blogAttributeIdSchema(args),
    ...blogPostCommonFieldsSchema(args),
  });
};
