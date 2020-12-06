import { MultiLangSchemaMessagesInterface } from './getFieldValidationMessage';
import * as Yup from 'yup';
import { emailSchema, phoneSchema } from './schemaTemplates';
import { userNameSchema } from './userSchema';

export const makeAnOrderSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    email: emailSchema(args),
    name: userNameSchema(args),
    phone: phoneSchema(args),
  });
