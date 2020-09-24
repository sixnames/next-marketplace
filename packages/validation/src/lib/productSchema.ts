import * as Yup from 'yup';
import {
  idSchema,
  langStringInputSchema,
  maxDescriptionLength,
  minDescriptionLength,
  minPrice,
} from './schemaTemplates';
import {
  getFieldValidationMessage,
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';
import { attributeIdSchema } from './attributesGroupSchema';

export const productIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.products.id' });

export const productConnectionIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.productConnections.id' });

export const productAttributeSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    showInCard: Yup.boolean(),
    node: Yup.string().required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.products.attributeId',
      }),
    ),
    key: Yup.string().required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.products.attributeKey',
      }),
    ),
    value: Yup.array().of(Yup.string()),
  });

export const productAttributesGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    showInCard: Yup.boolean(),
    node: Yup.string().required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.products.attributesGroupId',
      }),
    ),
    attributes: Yup.array().of(productAttributeSchema(args)),
  });

const productCommonFields = (args: MultiLangSchemaMessagesInterface) => ({
  name: langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.products.name',
  }),
  cardName: langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.products.cardName',
  }),
  description: langStringInputSchema({
    ...args,
    min: minDescriptionLength,
    max: maxDescriptionLength,
    requiredMessageKey: 'validation.products.description',
  }),
  rubrics: Yup.array().of(
    Yup.string().required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.products.rubrics',
      }),
    ),
  ),
  price: Yup.number()
    .min(
      minPrice,
      getFieldValidationMessage({
        ...args,
        key: 'validation.number.min',
      }) + ` ${minPrice}`,
    )
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.products.price',
      }),
    ),
  attributesGroups: Yup.array().of(productAttributesGroupSchema(args)),
  assets: Yup.array()
    .of(Yup.mixed())
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.products.assets',
      }),
    ),
});

export const createProductSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    ...productCommonFields(args),
  });

export const updateProductSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: productIdSchema(args),
    ...productCommonFields(args),
  });

export const createProductConnectionSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    productId: productIdSchema(args),
    attributeId: attributeIdSchema(args),
  });

export const addProductToConnectionSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    productId: productIdSchema(args),
    addProductId: productIdSchema(args),
    connectionId: productConnectionIdSchema(args),
  });

export const deleteProductFromConnectionSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    productId: productIdSchema(args),
    deleteProductId: productIdSchema(args),
    connectionId: productConnectionIdSchema(args),
  });
