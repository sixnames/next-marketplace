import * as Yup from 'yup';
import { id } from './templates';
import getValidationFieldMessage, { SchemaMessagesInterface } from './getValidationFieldMessage';

const languageKeyLength = 2;

const name = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string().required(
    getValidationFieldMessage({
      messages,
      lang,
      key: 'languages.validation.name',
    }),
  );

const key = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .min(
      languageKeyLength,
      getValidationFieldMessage({
        messages,
        lang,
        key: 'languages.validation.min',
      }) + ` ${languageKeyLength}`,
    )
    .max(
      languageKeyLength,
      getValidationFieldMessage({
        messages,
        lang,
        key: 'languages.validation.max',
      }) + ` ${languageKeyLength}`,
    )
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'languages.validation.key',
      }),
    );

const nativeName = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .min(
      languageKeyLength,
      getValidationFieldMessage({
        messages,
        lang,
        key: 'languages.validation.min',
      }) + ` ${languageKeyLength}`,
    )
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'languages.validation.nativeName',
      }),
    );

export const createLanguageSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    name: name({ messages, lang }),
    key: key({ messages, lang }),
    nativeName: nativeName({ messages, lang }),
  });

export const updateLanguageSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    id,
    name: name({ messages, lang }),
    key: key({ messages, lang }),
    nativeName: nativeName({ messages, lang }),
  });

export const languageSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    name: name({ messages, lang }),
    key: key({ messages, lang }),
  });
