import { MultiLangSchemaMessagesInterface } from './getFieldValidationMessage';
import { idSchema, requiredNameSchema } from './schemaTemplates';
import * as Yup from 'yup';

export const brandCollectionIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.brandCollections.id' });

export const brandCollectionCommonFields = (args: MultiLangSchemaMessagesInterface) => ({
  nameString: requiredNameSchema({
    ...args,
    requiredMessageKey: 'validation.brandCollections.name',
  }),
});

export const updateBrandCollectionSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: brandCollectionIdSchema(args),
    ...brandCollectionCommonFields(args),
  });
