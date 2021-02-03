import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import {
  addressSchema,
  contactsInputSchema,
  objectIdSchema,
  requiredAssetSchema,
  requiredNumberSchema,
  requiredStringSchema,
} from 'validation/schemaTemplates';
import { productIdSchema } from 'validation/productSchema';
import * as Yup from 'yup';

export const shopIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.shops.id' });
};

export const shopFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    name: requiredStringSchema({
      ...args,
      slug: 'validation.shops.nameString',
    }),
    citySlug: requiredStringSchema({
      ...args,
      slug: 'validation.shops.city',
    }),
    address: addressSchema(args),
    contacts: contactsInputSchema(args),
  };
};

export const shopProductIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.shops.id' });
};

export const shopProductCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    productId: productIdSchema(args),
    price: requiredNumberSchema({ ...args, slug: 'validation.shopProducts.price' }),
    available: requiredNumberSchema({
      ...args,
      slug: 'validation.shopProducts.available',
    }),
  };
};

export const addProductToShopSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    shopId: shopIdSchema(args),
    ...shopProductCommonFieldsSchema(args),
  });
};

export const updateShopProductSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    shopProductId: shopProductIdSchema(args),
    ...shopProductCommonFieldsSchema(args),
  });
};

export const shopProductInModalSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...shopProductCommonFieldsSchema(args),
  });
};

export const deleteProductFromShopSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    shopId: shopIdSchema(args),
    shopProductId: shopProductIdSchema(args),
  });
};

export const updateShopSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    shopId: shopIdSchema(args),
    ...shopFieldsSchema(args),
  });
};

export const addShopAssetsSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    shopId: shopIdSchema(args),
    assets: requiredAssetSchema({ ...args, slug: 'validation.shops.assets' }),
  });
};

export const updateShopLogoSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    shopId: shopIdSchema(args),
    logo: requiredAssetSchema({ ...args, slug: 'validation.shops.logo' }),
  });
};