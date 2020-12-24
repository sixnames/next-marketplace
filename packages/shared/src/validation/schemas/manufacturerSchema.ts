import { MultiLangSchemaMessagesInterface } from './getFieldValidationMessage';
import { idSchema, langStringInputSchema } from './schemaTemplates';
import * as Yup from 'yup';
import { brandIdSchema } from './brandSchema';

export const manufacturerIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.manufacturers.id' });

const manufacturerCommonFields = (args: MultiLangSchemaMessagesInterface) => ({
  nameString: langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.manufacturers.name',
  }),
});

export const createManufacturerSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    ...manufacturerCommonFields(args),
  });

export const updateManufacturerSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: brandIdSchema(args),
    ...manufacturerCommonFields(args),
  });
