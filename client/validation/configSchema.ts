import * as Yup from 'yup';
import { idSchema } from './schemaTemplates';
import getValidationFieldMessage, { SchemaMessagesInterface } from './getValidationFieldMessage';

const minValueLength = 1;

export const updateConfigsSchema = (args: SchemaMessagesInterface) =>
  Yup.array().of(
    Yup.object().shape({
      id: idSchema({ args, key: 'validation.configs.id' }),
      value: Yup.array()
        .min(
          minValueLength,
          getValidationFieldMessage({ ...args, key: 'validation.configs.value' }),
        )
        .of(
          Yup.string()
            .min(minValueLength)
            .required(getValidationFieldMessage({ ...args, key: 'validation.configs.value' })),
        ),
    }),
  );

export const updateAssetConfigSchema = (args: SchemaMessagesInterface) =>
  Yup.object().shape({
    id: idSchema({ args, key: 'validation.configs.id' }),
    value: Yup.array()
      .of(Yup.mixed())
      .required(getValidationFieldMessage({ ...args, key: 'validation.configs.value' })),
  });
