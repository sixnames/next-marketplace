import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import {
  objectIdSchema,
  requiredAssetSchema,
  requiredStringSchema,
  requiredStringTranslationSchema,
} from 'validation/schemaTemplates';
import * as Yup from 'yup';
import { DEFAULT_LOCALE } from 'config/common';
import { attributeIdSchema } from 'validation/attributesGroupSchema';

export const productIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.products.id' });
};

export const productConnectionIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.productConnections.id' });
};

export const productAttributeSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    showInCard: Yup.boolean(),
    showAsBreadcrumb: Yup.boolean(),
    attributeId: objectIdSchema({ ...args, slug: 'validation.products.attributeId' }),
    attributeSlug: requiredStringSchema({
      ...args,
      slug: 'validation.products.attributeSlug',
    }),
    attributesGroupId: objectIdSchema({ ...args, slug: 'validation.products.attributesGroupId' }),
    selectedOptionsSlugs: Yup.array().of(Yup.string()),
    number: Yup.number(),
    textI18n: Yup.object({
      [DEFAULT_LOCALE]: Yup.string(),
    }),
  });
};

export const productCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.products.name',
    }),
    originalName: requiredStringSchema({
      ...args,
      slug: 'validation.products.originalName',
    }),
    descriptionI18n: requiredStringTranslationSchema({
      ...args,
      max: 1000,
      slug: 'validation.products.description',
    }),
  };
};

export const createProductSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...productCommonFieldsSchema(args),
  });
};

export const updateProductSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    productId: productIdSchema(args),
    ...productCommonFieldsSchema(args),
  });
};

export const addProductAssetsSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    productId: productIdSchema(args),
    assets: requiredAssetSchema({ ...args, slug: 'validation.products.assets' }),
  });
};

export const createProductConnectionSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    productId: productIdSchema(args),
    attributeId: attributeIdSchema(args),
  });
};

export const createProductConnectionModalSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    productId: productIdSchema(args),
    attributeId: attributeIdSchema(args),
  });
};

export const addProductToConnectionSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    productId: productIdSchema(args),
    addProductId: productIdSchema(args),
    connectionId: productConnectionIdSchema(args),
  });
};

export const deleteProductFromConnectionSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    productId: productIdSchema(args),
    deleteProductId: productIdSchema(args),
    connectionId: productConnectionIdSchema(args),
  });
};
