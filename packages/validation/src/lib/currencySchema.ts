import {
  getFieldValidationMessage,
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';
import * as Yup from 'yup';

const currencyNameMinLength = 1;

const currencyIdSchema = ({ messages, lang }: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getFieldValidationMessage({
        messages,
        lang,
        key: 'validation.currencies.id',
      }),
    );

const currencyNameSchema = ({ messages, lang }: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .trim()
    .min(
      currencyNameMinLength,
      getFieldValidationMessage({
        messages,
        lang,
        key: 'validation.string.min',
      }) + ` ${currencyNameMinLength}`,
    )
    .required(
      getFieldValidationMessage({
        messages,
        lang,
        key: 'validation.currencies.nameString',
      }),
    );

export const createCurrencySchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    nameString: currencyNameSchema(args),
  });

export const updateCurrencySchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: currencyIdSchema(args),
    nameString: currencyNameSchema(args),
  });
