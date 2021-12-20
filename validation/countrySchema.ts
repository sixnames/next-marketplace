import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import {
  objectIdSchema,
  requiredStringSchema,
  requiredStringTranslationSchema,
} from './schemaTemplates';

const minCurrencyLength = 1;
const minCityKeyLength = 1;

export const countryIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.countries.id' });
};

export const cityIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.cities.id' });
};

export const countryCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    name: requiredStringSchema({ ...args, slug: 'validation.countries.nameString' }),
    currency: requiredStringSchema({
      ...args,
      min: minCurrencyLength,
      slug: 'validation.countries.currency',
    }),
  };
};

export const cityCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.cities.name',
    }),
    slug: requiredStringSchema({
      ...args,
      min: minCityKeyLength,
      slug: 'validation.cities.slug',
    }),
  };
};

export const createCountrySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object(countryCommonFieldsSchema(args));
};

export const updateCountrySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    countryId: countryIdSchema(args),
    ...countryCommonFieldsSchema(args),
  });
};

export const addCityToCountrySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    countryId: countryIdSchema(args),
    ...cityCommonFieldsSchema(args),
  });
};

export const updateCityInCountrySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    cityId: cityIdSchema(args),
    countryId: countryIdSchema(args),
    ...countryCommonFieldsSchema(args),
  });
};

export const deleteCityFromCountrySchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    cityId: cityIdSchema(args),
    countryId: countryIdSchema(args),
  });
};
