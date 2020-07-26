import * as Yup from 'yup';
import { langStringInputSchema, minPrice } from './schemaTemplates';
import {
  MultiLangSchemaMessagesInterface,
  SchemaMessagesInterface,
} from './getValidationFieldMessage';
import getValidationFieldMessage from '../../../client/validation/getValidationFieldMessage';

const productIdSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.products.id',
      }),
    );

export const productAttributeSchema = ({ lang, messages }: SchemaMessagesInterface) =>
  Yup.object().shape({
    showInCard: Yup.boolean(),
    node: Yup.string().required(
      getValidationFieldMessage({
        lang: lang,
        messages: messages,
        key: 'validation.products.attributeId',
      }),
    ),
    key: Yup.string().required(
      getValidationFieldMessage({
        lang: lang,
        messages: messages,
        key: 'validation.products.attributeKey',
      }),
    ),
    value: Yup.array().of(Yup.string()),
  });

export const productAttributesGroupSchema = (args: SchemaMessagesInterface) =>
  Yup.object().shape({
    showInCard: Yup.boolean(),
    node: Yup.string().required(
      getValidationFieldMessage({
        lang: args.lang,
        messages: args.messages,
        key: 'validation.products.attributesGroupId',
      }),
    ),
    attributes: Yup.array().of(productAttributeSchema(args)),
  });

const productCommonFields = ({
  defaultLang,
  messages,
  lang,
}: MultiLangSchemaMessagesInterface) => ({
  name: langStringInputSchema({
    defaultLang,
    messages,
    lang,
    requiredMessageKey: 'validation.products.name',
  }),
  cardName: langStringInputSchema({
    defaultLang,
    messages,
    lang,
    requiredMessageKey: 'validation.products.cardName',
  }),
  description: langStringInputSchema({
    defaultLang,
    messages,
    lang,
    requiredMessageKey: 'validation.products.description',
  }),
  rubrics: Yup.array().of(
    Yup.string().required(
      getValidationFieldMessage({
        lang,
        messages,
        key: 'validation.products.rubrics',
      }),
    ),
  ),
  price: Yup.number()
    .min(
      minPrice,
      getValidationFieldMessage({
        lang,
        messages,
        key: 'validation.number.min',
      }) + ` ${minPrice}`,
    )
    .required(
      getValidationFieldMessage({
        lang,
        messages,
        key: 'validation.products.price',
      }),
    ),
  attributesGroups: Yup.array().of(productAttributesGroupSchema({ messages, lang })),
  assets: Yup.array()
    .of(Yup.mixed())
    .required(
      getValidationFieldMessage({
        lang,
        messages,
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
    id: productIdSchema({ messages: args.messages, lang: args.lang }),
    ...productCommonFields(args),
  });
