import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import { objectIdSchema, requiredStringTranslationSchema } from 'validation/schemaTemplates';

export const rubricVariantIdSchema = (args: ValidationSchemaArgsInterface) => {
  return objectIdSchema({ ...args, slug: 'validation.rubricVariants.id' });
};

export const rubricVariantNameSchema = (args: ValidationSchemaArgsInterface) => {
  return requiredStringTranslationSchema({
    ...args,
    slug: 'validation.rubricVariants.name',
  });
};

export const createRubricVariantSchema = (args: ValidationSchemaArgsInterface) =>
  Yup.object().shape({
    nameI18n: rubricVariantNameSchema(args),
  });

export const rubricVariantInModalSchema = (args: ValidationSchemaArgsInterface) =>
  Yup.object().shape({
    nameI18n: rubricVariantNameSchema(args),
  });

export const updateRubricVariantSchema = (args: ValidationSchemaArgsInterface) =>
  Yup.object().shape({
    rubricVariantId: rubricVariantIdSchema(args),
    nameI18n: rubricVariantNameSchema(args),
  });
