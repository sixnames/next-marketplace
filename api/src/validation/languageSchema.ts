import * as Yup from 'yup';
import getFieldValidationMessage, {
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';

const languageKeyLength = 2;

const languageIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.languages.id',
      }),
    );

const languageNameSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string().required(
    getFieldValidationMessage({
      ...args,
      key: 'validation.languages.name',
    }),
  );

const languageKeySchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .min(
      languageKeyLength,
      getFieldValidationMessage({
        ...args,
        key: 'validation.string.min',
      }) + ` ${languageKeyLength}`,
    )
    .max(
      languageKeyLength,
      getFieldValidationMessage({
        ...args,
        key: 'validation.string.max',
      }) + ` ${languageKeyLength}`,
    )
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.languages.key',
      }),
    );

const languageNativeNameSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .min(
      languageKeyLength,
      getFieldValidationMessage({
        ...args,
        key: 'validation.string.min',
      }) + ` ${languageKeyLength}`,
    )
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.languages.nativeName',
      }),
    );

export const createLanguageSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    name: languageNameSchema(args),
    key: languageKeySchema(args),
    nativeName: languageNativeNameSchema(args),
  });

export const updateLanguageSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: languageIdSchema(args),
    name: languageNameSchema(args),
    key: languageKeySchema(args),
    nativeName: languageNativeNameSchema(args),
  });

export const languageSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    name: languageNameSchema(args),
    key: languageKeySchema(args),
  });
