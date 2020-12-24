import { MultiLangSchemaMessagesInterface } from './getFieldValidationMessage';
import { idSchema, langStringInputSchema } from './schemaTemplates';
import * as Yup from 'yup';

export const brandCollectionIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.brandCollections.id' });

export const brandCollectionCommonFields = (args: MultiLangSchemaMessagesInterface) => ({
  nameString: langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.brandCollections.name',
  }),
});

export const updateBrandCollectionSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: brandCollectionIdSchema(args),
    ...brandCollectionCommonFields(args),
  });
