import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import {
  objectIdSchema,
  requiredNumberSchema,
  requiredStringSchema,
} from 'validation/schemaTemplates';
import * as Yup from 'yup';

export const eventIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.events.id' });
};

export const eventCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringSchema({
      ...args,
      slug: 'validation.events.name',
    }),
    descriptionI18n: requiredStringSchema({
      ...args,
      slug: 'validation.events.description',
    }),
    seatsCount: requiredNumberSchema({
      ...args,
      slug: 'validation.events.seatsCount',
    }),
  };
};

export const createEventSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...eventCommonFieldsSchema(args),
  });
};

export const updateEventSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    _id: eventIdSchema(args),
    ...eventCommonFieldsSchema(args),
  });
};
