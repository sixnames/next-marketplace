import * as Yup from 'yup';
import { colorSchema, langStringInputSchema } from './schemaTemplates';
import { GENDER_ENUMS } from '../config';
import getFieldValidationMessage, {
  MultiLangSchemaMessagesInterface,
  SchemaMessagesInterface,
} from './getFieldValidationMessage';

export const optionVariantSchema = ({
  defaultLang,
  messages,
  lang,
}: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    key: Yup.mixed()
      .oneOf(GENDER_ENUMS)
      .required(
        getFieldValidationMessage({
          messages,
          lang,
          key: 'validation.option.variantKey',
        }),
      ),
    value: langStringInputSchema({
      defaultLang,
      requiredMessageKey: 'validation.option.variantValue',
      messages,
      lang,
    }),
  });

export const optionInGroupCommonSchema = ({
  defaultLang,
  messages,
  lang,
}: MultiLangSchemaMessagesInterface) => ({
  name: langStringInputSchema({
    defaultLang,
    requiredMessageKey: 'validation.option.name',
    messages,
    lang,
  }),
  color: colorSchema({ messages, lang }),
  variants: Yup.array().of(optionVariantSchema({ defaultLang, messages, lang })),
  gender: Yup.mixed()
    .oneOf(GENDER_ENUMS)
    .nullable()
    .when('variants', {
      is: (variants: any[]) => {
        return !variants || !variants.length;
      },
      then: Yup.mixed()
        .oneOf(GENDER_ENUMS)
        .required(
          getFieldValidationMessage({
            messages,
            lang,
            key: 'validation.option.gender',
          }),
        ),
      otherwise: Yup.mixed().oneOf(GENDER_ENUMS).nullable(),
    }),
});

const optionsGroupNameSchema = (args: MultiLangSchemaMessagesInterface) =>
  langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.optionsGroup.name',
  });

const optionsGroupIdSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getFieldValidationMessage({
        messages,
        lang,
        key: 'validation.optionsGroup.id',
      }),
    );

const optionIdSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getFieldValidationMessage({
        messages,
        lang,
        key: 'validation.option.id',
      }),
    );

export const optionInGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    ...optionInGroupCommonSchema(args),
  });

export const addOptionToGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    groupId: optionsGroupIdSchema({ messages: args.messages, lang: args.lang }),
    ...optionInGroupCommonSchema(args),
  });

export const updateOptionInGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    groupId: optionsGroupIdSchema({ messages: args.messages, lang: args.lang }),
    optionId: optionIdSchema({ messages: args.messages, lang: args.lang }),
    ...optionInGroupCommonSchema(args),
  });

export const deleteOptionFromGroupSchema = (args: SchemaMessagesInterface) =>
  Yup.object().shape({
    groupId: optionsGroupIdSchema(args),
    optionId: optionIdSchema(args),
  });

export const optionsGroupModalSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    name: optionsGroupNameSchema(args),
  });

export const createOptionsGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    name: optionsGroupNameSchema(args),
  });

export const updateOptionsGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: optionsGroupIdSchema(args),
    name: optionsGroupNameSchema(args),
  });
