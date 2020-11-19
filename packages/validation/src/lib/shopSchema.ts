import {
  getFieldValidationMessage,
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';
import {
  addressSchema,
  contactsInputSchema,
  idSchema,
  maxNameLength,
  minNameLength,
} from './schemaTemplates';
import * as Yup from 'yup';
import { companyIdSchema } from './companySchema';

export const shopIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.shops.id' });

const shopCommonFields = (args: MultiLangSchemaMessagesInterface) => ({
  nameString: Yup.string()
    .min(
      minNameLength,
      getFieldValidationMessage({
        ...args,
        key: 'validation.string.min',
      }) + ` ${minNameLength}`,
    )
    .max(
      maxNameLength,
      getFieldValidationMessage({
        ...args,
        key: 'validation.string.max',
      }) + ` ${maxNameLength}`,
    )
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.shops.nameString',
      }),
    ),
  address: addressSchema(args),
  contacts: contactsInputSchema(args),
  logo: Yup.array()
    .of(Yup.mixed())
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.shops.logo',
      }),
    ),
  assets: Yup.array()
    .of(Yup.mixed())
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.shops.assets',
      }),
    ),
});

export const addShopToCompanySchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object({
    companyId: companyIdSchema(args),
    ...shopCommonFields(args),
  });

export const updateShopInCompanySchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object({
    shopId: shopIdSchema(args),
    companyId: companyIdSchema(args),
    ...shopCommonFields(args),
  });

export const updateShopSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object({
    shopId: shopIdSchema(args),
    ...shopCommonFields(args),
  });

export const updateShopClientSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object({
    ...shopCommonFields(args),
  });
