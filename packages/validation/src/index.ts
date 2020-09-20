import {
  ObjectSchema as ObjectSchemaType,
  NotRequiredArraySchema as NotRequiredArraySchemaType,
} from 'yup';
export * from './lib/attributesGroupSchema';
export * from './lib/configSchema';
export * from './lib/countrySchema';
export * from './lib/currencySchema';
export * from './lib/getFieldValidationMessage';
export * from './lib/languageSchema';
export * from './lib/metricSchema';
export * from './lib/optionsGroupSchema';
export * from './lib/productSchema';
export * from './lib/regExp';
export * from './lib/roleSchema';
export * from './lib/rubricSchema';
export * from './lib/rubricVariantSchema';
export * from './lib/schemaTemplates';
export * from './lib/userSchema';

export type ObjectSchema<
  T extends object | null | undefined = object | undefined,
  C = object
> = ObjectSchemaType<T, C>;
export type NotRequiredArraySchema<T, C = object> = NotRequiredArraySchemaType<T, C>;
