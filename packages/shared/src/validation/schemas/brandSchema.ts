import { MultiLangSchemaMessagesInterface } from './getFieldValidationMessage';
import { idSchema, langStringInputSchema } from './schemaTemplates';
import * as Yup from 'yup';
import { brandCollectionCommonFields, brandCollectionIdSchema } from './brandCollectionSchema';

export const brandIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.brands.id' });

const brandCommonFields = (args: MultiLangSchemaMessagesInterface) => ({
  nameString: langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.brands.name',
  }),
});

export const createBrandSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    ...brandCommonFields(args),
  });

export const updateBrandSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: brandIdSchema(args),
    ...brandCommonFields(args),
  });

export const addCollectionToBrandSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    brandId: brandIdSchema(args),
    ...brandCollectionCommonFields(args),
  });

export const deleteCollectionFromBrandSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    brandId: brandIdSchema(args),
    collectionId: brandCollectionIdSchema(args),
  });
