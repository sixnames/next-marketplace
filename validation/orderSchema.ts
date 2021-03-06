import { emailSchema, phoneSchema } from 'validation/utils/schemaTemplates';
import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';
import { userNameSchema } from './userSchema';

export const makeAnOrderSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    email: emailSchema(args),
    name: userNameSchema(args),
    phone: phoneSchema(args),
    privacy: Yup.boolean().oneOf([true], 'Обязательное поле'),
  });
};
