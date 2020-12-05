import * as Yup from 'yup';
import { idSchema } from './schemaTemplates';
import {
  getFieldValidationMessage,
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';

const minValueLength = 1;

export const configCityLangSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    key: Yup.string()
      .min(minValueLength)
      .required(getFieldValidationMessage({ ...args, key: 'validation.configs.value' })),
    value: Yup.array().of(
      Yup.string()
        .min(minValueLength)
        .required(getFieldValidationMessage({ ...args, key: 'validation.configs.value' })),
    ),
  });

export const configCitySchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    key: Yup.string()
      .min(minValueLength)
      .required(getFieldValidationMessage({ ...args, key: 'validation.configs.value' })),
    value: Yup.array().of(
      Yup.string()
        .min(minValueLength)
        .required(getFieldValidationMessage({ ...args, key: 'validation.configs.value' })),
    ),
    translations: Yup.array().of(configCityLangSchema(args)),
  });

export const updateConfigSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: idSchema({ args, key: 'validation.configs.id' }),
    cities: Yup.array().min(minValueLength).of(configCitySchema(args)),
  });

export const updateConfigsSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.array().of(updateConfigSchema(args));

export const updateAssetConfigSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: idSchema({ args, key: 'validation.configs.id' }),
    cities: Yup.array().of(configCitySchema(args)),
  });

export const updateConfigsClientSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    inputs: updateConfigsSchema(args),
  });
