import * as Yup from 'yup';
import { id } from './templates';
import getValidationFieldMessage, { SchemaMessagesInterface } from './getValidationFieldMessage';

const languageKeyLength = 2;

export const createLanguageSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    name: Yup.string().required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'languages.validation.name',
      }),
    ),
    key: Yup.string()
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
      ),
    nativeName: Yup.string()
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
      ),
  });

export const updateLanguageSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    id,
    name: Yup.string().required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'languages.validation.name',
      }),
    ),
    key: Yup.string()
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
        }) + ` ${languageKeyLength}`,
      ),
    nativeName: Yup.string()
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
      ),
  });

export const languageSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    name: Yup.string().required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'languages.validation.name',
      }),
    ),
    key: Yup.string()
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
      ),
  });
