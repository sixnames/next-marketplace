import {
  ObjectSchema as ObjectSchemaType,
  NotRequiredArraySchema as NotRequiredArraySchemaType,
} from 'yup';
export * from './schemas/attributesGroupSchema';
export * from './schemas/configSchema';
export * from './schemas/countrySchema';
export * from './schemas/currencySchema';
export * from './schemas/getFieldValidationMessage';
export * from './schemas/languageSchema';
export * from './schemas/metricSchema';
export * from './schemas/optionsGroupSchema';
export * from './schemas/productSchema';
export * from './schemas/regExp';
export * from './schemas/roleSchema';
export * from './schemas/rubricSchema';
export * from './schemas/rubricVariantSchema';
export * from './schemas/schemaTemplates';
export * from './schemas/userSchema';
export * from './schemas/companySchema';
export * from './schemas/shopSchema';
export * from './schemas/shopProductSchema';
export * from './schemas/cartSchema';
export * from './schemas/orderSchema';

export type ObjectSchema<
  T extends Record<string, any> | null | undefined = Record<string, any> | undefined,
  C = Record<string, any>
> = ObjectSchemaType<T, C>;
export type NotRequiredArraySchema<T, C = Record<string, any>> = NotRequiredArraySchemaType<T, C>;
