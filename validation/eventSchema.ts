import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import {
  objectIdSchema,
  requiredNumberSchema,
  requiredStringSchema,
  requiredStringTranslationSchema,
} from 'validation/utils/schemaTemplates';
import * as Yup from 'yup';

export const eventIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.events.id' });
};

export const eventCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.events.name',
    }),
    descriptionI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.events.description',
    }),
    seatsCount: requiredNumberSchema({
      ...args,
      slug: 'validation.events.seatsCount',
    }),
    citySlug: requiredStringSchema({
      ...args,
      slug: 'validation.events.city',
    }),
    address: Yup.mixed().nullable().required('address'),
    startAt: Yup.mixed().nullable().required('startAt'),
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
