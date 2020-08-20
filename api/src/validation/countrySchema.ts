import getFieldValidationMessage, {
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';
import * as Yup from 'yup';
import { idSchema, langStringInputSchema, minNameLength } from './schemaTemplates';

const minCurrencyLength = 1;
const minCityKeyLength = 1;

const countryNameSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .min(
      minNameLength,
      getFieldValidationMessage({ ...args, key: 'validation.string.min' }) + ` ${minNameLength}`,
    )
    .required(getFieldValidationMessage({ ...args, key: 'validation.countries.nameString' }));

const countryCurrencySchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .min(
      minCurrencyLength,
      getFieldValidationMessage({ ...args, key: 'validation.string.min' }) +
        ` ${minCurrencyLength}`,
    )
    .required(getFieldValidationMessage({ ...args, key: 'validation.countries.currency' }));

const cityNameSchema = (args: MultiLangSchemaMessagesInterface) =>
  langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.cities.name',
  });

const citySlugSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .min(
      minCityKeyLength,
      getFieldValidationMessage({ ...args, key: 'validation.string.min' }) + ` ${minCityKeyLength}`,
    )
    .required(getFieldValidationMessage({ ...args, key: 'validation.cities.slug' }));

export const createCountrySchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    nameString: countryNameSchema(args),
    currency: countryCurrencySchema(args),
  });

export const updateCountrySchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: idSchema({ args, key: 'validation.countries.id' }),
    nameString: countryNameSchema(args),
    currency: countryCurrencySchema(args),
  });

export const addCityToCountrySchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    countryId: idSchema({ args, key: 'validation.countries.id' }),
    name: cityNameSchema(args),
    slug: citySlugSchema(args),
  });

export const updateCityInCountrySchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    cityId: idSchema({ args, key: 'validation.cities.id' }),
    countryId: idSchema({ args, key: 'validation.countries.id' }),
    name: cityNameSchema(args),
    slug: citySlugSchema(args),
  });

export const deleteCityFromCountrySchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    cityId: idSchema({ args, key: 'validation.cities.id' }),
    countryId: idSchema({ args, key: 'validation.countries.id' }),
  });
