import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import {
  objectIdSchema,
  requiredAssetSchema,
  requiredStringSchema,
} from 'validation/schemaTemplates';
import * as Yup from 'yup';
import { attributeIdSchema } from 'validation/attributesGroupSchema';

export const productIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.products.id' });
};

export const productConnectionIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.productConnections.id' });
};

export const productCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    originalName: requiredStringSchema({
      ...args,
      slug: 'validation.products.originalName',
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
