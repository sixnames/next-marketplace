import * as Yup from 'yup';
import { langStringInputSchema } from './schemaTemplates';
import getFieldValidationMessage, {
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';

const rubricVariantNameSchema = (args: MultiLangSchemaMessagesInterface) =>
  langStringInputSchema({ ...args, requiredMessageKey: 'validation.rubricVariants.name' });

export const rubricVariantModalSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    name: rubricVariantNameSchema(args),
  });

export const createRubricVariantInputSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    name: rubricVariantNameSchema(args),
  });

export const updateRubricVariantSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: Yup.string()
      .nullable()
      .required(
        getFieldValidationMessage({
          messages: args.messages,
          lang: args.lang,
          key: 'validation.rubrics.id',
        }),
      ),
    name: rubricVariantNameSchema(args),
  });
