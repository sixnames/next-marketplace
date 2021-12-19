import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import { objectIdSchema } from './schemaTemplates';
import * as Yup from 'yup';
import { productIdSchema } from './productSchema';

export const shopProductIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.carts.shopProductId' });
};

export const cartProductIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.carts.cartProductId' });
};

export const cartAmountSchema = Yup.number().required('validation.carts.amount');

export const addProductToCartSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    shopProductId: shopProductIdSchema(args),
    amount: cartAmountSchema,
  });
};

export const addShoplessProductToCartSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    productId: productIdSchema(args),
    amount: cartAmountSchema,
  });
};

export const addShopToCartProductSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    shopProductId: shopProductIdSchema(args),
    cartProductId: cartProductIdSchema(args),
  });
};

export const updateProductInCartSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    cartProductId: cartProductIdSchema(args),
    amount: cartAmountSchema,
  });
};

export const deleteProductFromCartSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    cartProductId: cartProductIdSchema(args),
  });
};
