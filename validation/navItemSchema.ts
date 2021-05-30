import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import {
  objectIdSchema,
  requiredNumberSchema,
  requiredStringSchema,
  requiredStringTranslationSchema,
} from 'validation/schemaTemplates';
import * as Yup from 'yup';

export const navItemIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({
    ...args,
    slug: 'validation.navItems.id',
  });
};

export const navItemCommonFieldsSchema = (args: ValidationSchemaArgsInterface) => {
  return {
    nameI18n: requiredStringTranslationSchema({
      ...args,
      slug: 'validation.navItems.name',
    }),
    slug: requiredStringSchema({
      ...args,
      slug: 'validation.navItems.slug',
    }),
    path: requiredStringSchema({
      ...args,
      slug: 'validation.navItems.path',
    }),
    navGroup: requiredStringSchema({
      ...args,
      slug: 'validation.navItems.navGroup',
    }),
    index: requiredNumberSchema({
      ...args,
      slug: 'validation.navItems.index',
    }),
  };
};

export const createNavItemSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    ...navItemCommonFieldsSchema(args),
  });
};

export const updateNavItemSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    _id: navItemIdSchema(args),
    ...navItemCommonFieldsSchema(args),
  });
};
