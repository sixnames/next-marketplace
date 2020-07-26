import * as Yup from 'yup';
import getValidationFieldMessage, { SchemaMessagesInterface } from './getValidationFieldMessage';

const languageKeyLength = 2;

const languageIdSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.languages.id',
      }),
    );

const languageNameSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string().required(
    getValidationFieldMessage({
      messages,
      lang,
      key: 'validation.languages.name',
    }),
  );

const languageKeySchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .min(
      languageKeyLength,
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.string.min',
      }) + ` ${languageKeyLength}`,
    )
    .max(
      languageKeyLength,
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.string.max',
      }) + ` ${languageKeyLength}`,
    )
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.languages.key',
      }),
    );

const languageNativeNameSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .min(
      languageKeyLength,
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.string.min',
      }) + ` ${languageKeyLength}`,
    )
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.languages.nativeName',
      }),
    );

export const createLanguageSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    name: languageNameSchema({ messages, lang }),
    key: languageKeySchema({ messages, lang }),
    nativeName: languageNativeNameSchema({ messages, lang }),
  });

export const updateLanguageSchema = (args: SchemaMessagesInterface) =>
  Yup.object().shape({
    id: languageIdSchema(args),
    name: languageNameSchema(args),
    key: languageKeySchema(args),
    nativeName: languageNativeNameSchema(args),
  });

export const languageSchema = (args: SchemaMessagesInterface) =>
  Yup.object().shape({
    name: languageNameSchema(args),
    key: languageKeySchema(args),
  });
