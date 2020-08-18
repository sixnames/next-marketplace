import * as Yup from 'yup';
import { langStringInputSchema } from './schemaTemplates';
import { GENDER_ENUMS } from '../config';
import getFieldValidationMessage, {
  MultiLangSchemaMessagesInterface,
  SchemaMessagesInterface,
} from './getFieldValidationMessage';
import { attributeIdSchema, attributesGroupIdSchema } from './attributesGroupSchema';
import { productIdSchema } from './productSchema';

const parent = Yup.string().nullable();

const rubricVariantSchema = (args: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(getFieldValidationMessage({ ...args, key: 'validation.rubrics.variant' }));

const rubricIdSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getFieldValidationMessage({
        messages,
        lang,
        key: 'validation.rubrics.id',
      }),
    );

const rubricCatalogueTitleSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    defaultTitle: langStringInputSchema({
      ...args,
      requiredMessageKey: 'validation.rubrics.defaultTitle',
    }),
    keyword: langStringInputSchema({
      ...args,
      requiredMessageKey: 'validation.rubrics.keyword',
    }),
    prefix: langStringInputSchema({ ...args, requiredMessageKey: 'none', required: false }),
    gender: Yup.mixed().oneOf(GENDER_ENUMS).required('Род рубрики обязателен к заполнению.'),
  });

const rubricCommonFields = (args: MultiLangSchemaMessagesInterface) => ({
  name: langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.rubrics.name',
  }),
  catalogueTitle: rubricCatalogueTitleSchema(args),
  parent,
  variant: rubricVariantSchema(args),
});

export const createRubricInputSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    ...rubricCommonFields(args),
  });

export const updateRubricInputSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: rubricIdSchema(args),
    ...rubricCommonFields(args),
  });

export const addAttributesGroupToRubricInputSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    rubricId: rubricIdSchema(args),
    attributesGroupId: attributesGroupIdSchema(args),
  });

export const deleteAttributesGroupFromRubricInputSchema = (
  args: MultiLangSchemaMessagesInterface,
) =>
  Yup.object().shape({
    rubricId: rubricIdSchema(args),
    attributesGroupId: attributesGroupIdSchema(args),
  });

export const updateAttributesGroupInRubricInputSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    rubricId: rubricIdSchema(args),
    attributesGroupId: attributesGroupIdSchema(args),
    attributeId: attributeIdSchema(args),
  });

export const addProductToRubricInputSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    rubricId: rubricIdSchema(args),
    productId: productIdSchema(args),
  });

export const deleteProductFromRubricInputSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    rubricId: rubricIdSchema(args),
    productId: productIdSchema(args),
  });

export const addAttributesGroupToRubricSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    attributesGroupId: attributesGroupIdSchema(args),
  });
