import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import { objectIdSchema } from 'validation/utils/schemaTemplates';
import * as Yup from 'yup';
import { attributeIdSchema } from './attributesGroupSchema';

export const productIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.products.id' });
};

export const productConnectionIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.productConnections.id' });
};

export const updateProductSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    productId: productIdSchema(args),
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
    variantId: productConnectionIdSchema(args),
  });
};

export const deleteProductFromConnectionSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    productId: productIdSchema(args),
    deleteProductId: productIdSchema(args),
    variantId: productConnectionIdSchema(args),
  });
};
