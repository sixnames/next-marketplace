import { MultiLangSchemaMessagesInterface } from './getFieldValidationMessage';
import { idSchema } from './schemaTemplates';
import * as Yup from 'yup';
import { productIdSchema } from './productSchema';

const shopProductIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.carts.shopProductId' });

const cartProductIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.carts.cartProductId' });

export const addProductToCartSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    shopProductId: shopProductIdSchema(args),
    amount: Yup.number().required('validation.carts.amount'),
  });

export const addShoplessProductToCartSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    productId: productIdSchema(args),
    amount: Yup.number().required('validation.carts.amount'),
  });

export const addShopToCartProductSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    shopProductId: shopProductIdSchema(args),
    cartProductId: cartProductIdSchema(args),
  });

export const updateProductInCartSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    shopProductId: shopProductIdSchema(args),
    amount: Yup.number().required('validation.carts.amount'),
  });

export const deleteProductFromCartSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    cartProductId: cartProductIdSchema(args),
  });
