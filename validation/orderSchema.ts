import * as Yup from 'yup';
import { emailSchema, phoneSchema } from './schemaTemplates';
import { userNameSchema } from './userSchema';
import { ValidationSchemaArgsInterface } from 'types/validataionTypes';

export const makeAnOrderSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    email: emailSchema(args),
    name: userNameSchema(args),
    phone: phoneSchema(args),
  });
};
