import { MultiLangSchemaMessagesInterface } from './getFieldValidationMessage';
import { idSchema } from './schemaTemplates';
import * as Yup from 'yup';

const shopProductIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.carts.shopProductId' });

const cartProductIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.carts.cartProductId' });

export const addProductToCartSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    shopProductId: shopProductIdSchema(args),
    amount: Yup.number().required('validation.carts.amount'),
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
