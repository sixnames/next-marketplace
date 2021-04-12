import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import { objectIdSchema, requiredAssetSchema } from 'validation/schemaTemplates';
import { DEFAULT_CITY, DEFAULT_LOCALE } from 'config/common';

export const configIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.configs.id' });
};

export const configCitiesSchema = () => {
  return Yup.object({
    [DEFAULT_CITY]: Yup.object({
      [DEFAULT_LOCALE]: Yup.array().of(Yup.string()),
    }),
  });
};

export const updateConfigSchema = (args: ValidationSchemaArgsInterface) =>
  Yup.object().shape({
    configId: configIdSchema(args),
    cities: configCitiesSchema(),
  });

export const updateAssetConfigSchema = (args: ValidationSchemaArgsInterface) =>
  Yup.object().shape({
    configId: configIdSchema(args),
    assets: requiredAssetSchema({ ...args, slug: 'validation.configs.value' }),
  });
