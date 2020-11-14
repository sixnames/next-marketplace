import {
  getFieldValidationMessage,
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';
import * as Yup from 'yup';
import { minNameLength, maxNameLength, idSchema, contactsInputSchema } from './schemaTemplates';

export const companyIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.companies.id' });

const companyCommonFields = (args: MultiLangSchemaMessagesInterface) => ({
  nameString: Yup.string()
    .min(
      minNameLength,
      getFieldValidationMessage({
        ...args,
        key: 'validation.string.min',
      }) + ` ${minNameLength}`,
    )
    .max(
      maxNameLength,
      getFieldValidationMessage({
        ...args,
        key: 'validation.string.max',
      }) + ` ${maxNameLength}`,
    )
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.companies.nameString',
      }),
    ),
  owner: Yup.string().required(
    getFieldValidationMessage({
      ...args,
      key: 'validation.companies.owner',
    }),
  ),
  staff: Yup.array().of(
    Yup.string().required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.companies.staff',
      }),
    ),
  ),
  contacts: contactsInputSchema(args),
  logo: Yup.array()
    .of(Yup.mixed())
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.companies.logo',
      }),
    ),
});

export const createCompanySchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object(companyCommonFields(args));

export const updateCompanySchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object({
    ...companyCommonFields(args),
    id: companyIdSchema(args),
  });
