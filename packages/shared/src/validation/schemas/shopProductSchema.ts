import {
  getFieldValidationMessage,
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';
import * as Yup from 'yup';
import { shopIdSchema } from './shopSchema';
import { productIdSchema } from './productSchema';

const shopProductCommonFields = (args: MultiLangSchemaMessagesInterface) => ({
  available: Yup.number().required(
    getFieldValidationMessage({
      ...args,
      key: 'validation.shopProducts.available',
    }),
  ),
  price: Yup.number().required(
    getFieldValidationMessage({
      ...args,
      key: 'validation.shopProducts.price',
    }),
  ),
});

export const addProductToShopSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object({
    shopId: shopIdSchema(args),
    productId: productIdSchema(args),
    ...shopProductCommonFields(args),
  });

export const deleteProductFromShopSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object({
    shopId: shopIdSchema(args),
    productId: productIdSchema(args),
  });

export const updateShopProductSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object({
    productId: productIdSchema(args),
    ...shopProductCommonFields(args),
  });

export const updateShopProductClientSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object({
    ...shopProductCommonFields(args),
  });
