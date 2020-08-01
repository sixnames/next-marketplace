import getValidationFieldMessage, { SchemaMessagesInterface } from './getValidationFieldMessage';
import * as Yup from 'yup';

const currencyNameMinLength = 1;

const currencyIdSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.currencies.id',
      }),
    );

const currencyNameSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .trim()
    .min(
      currencyNameMinLength,
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.string.min',
      }) + ` ${currencyNameMinLength}`,
    )
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.currencies.nameString',
      }),
    );

export const createCurrencySchema = (args: SchemaMessagesInterface) =>
  Yup.object().shape({
    nameString: currencyNameSchema(args),
  });

export const updateCurrencySchema = (args: SchemaMessagesInterface) =>
  Yup.object().shape({
    id: currencyIdSchema(args),
    nameString: currencyNameSchema(args),
  });
