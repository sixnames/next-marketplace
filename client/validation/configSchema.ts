import * as Yup from 'yup';
import { idSchema } from './schemaTemplates';
import getFieldValidationMessage, {
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';

const minValueLength = 1;

export const updateConfigsSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.array().of(
    Yup.object().shape({
      id: idSchema({ args, key: 'validation.configs.id' }),
      value: Yup.array()
        .min(
          minValueLength,
          getFieldValidationMessage({ ...args, key: 'validation.configs.value' }),
        )
        .of(
          Yup.string()
            .min(minValueLength)
            .required(getFieldValidationMessage({ ...args, key: 'validation.configs.value' })),
        ),
    }),
  );

export const updateAssetConfigSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: idSchema({ args, key: 'validation.configs.id' }),
    value: Yup.array()
      .of(Yup.mixed())
      .required(getFieldValidationMessage({ ...args, key: 'validation.configs.value' })),
  });

export const updateConfigsClientSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    inputs: updateConfigsSchema(args),
  });
