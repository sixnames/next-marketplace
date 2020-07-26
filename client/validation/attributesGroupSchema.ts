import * as Yup from 'yup';
import { langStringInputSchema } from './schemaTemplates';
import {
  ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPES_ENUMS,
} from '../config';
import getValidationFieldMessage, {
  MultiLangSchemaMessagesInterface,
  SchemaMessagesInterface,
} from './getValidationFieldMessage';

const attributesGroupIdSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.attributesGroup.id',
      }),
    );

const attributeIdSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.attribute.id',
      }),
    );

const attributesGroupNameSchema = ({
  defaultLang,
  messages,
  lang,
}: MultiLangSchemaMessagesInterface) =>
  langStringInputSchema({
    defaultLang,
    messages,
    lang,
    requiredMessageKey: 'validation.attributesGroup.name',
  });

const options = Yup.string()
  .nullable()
  .when('variant', {
    is: (variant: string) => {
      return variant === ATTRIBUTE_TYPE_SELECT || variant === ATTRIBUTE_TYPE_MULTIPLE_SELECT;
    },
    then: Yup.string().required('Группа опций обязательна к заполнению.'),
    otherwise: Yup.string(),
  });

const metric = Yup.string().nullable();

const attributePositioningInTitleSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.object().shape({
    key: Yup.string().required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.translation.key',
      }),
    ),
    value: Yup.mixed()
      .oneOf(ATTRIBUTE_POSITION_IN_TITLE_ENUMS)
      .required(
        getValidationFieldMessage({
          messages,
          lang,
          key: 'validation.attribute.position',
        }),
      ),
  });

const attributeVariantSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.mixed()
    .oneOf(ATTRIBUTE_TYPES_ENUMS)
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.attribute.variant',
      }),
    );

const attributeCommonFields = ({
  defaultLang,
  messages,
  lang,
}: MultiLangSchemaMessagesInterface) => ({
  name: langStringInputSchema({
    defaultLang,
    messages,
    lang,
    requiredMessageKey: 'validation.attribute.name',
  }),
  variant: attributeVariantSchema({ lang, messages }),
  metric,
  options,
  positioningInTitle: Yup.array()
    .of(attributePositioningInTitleSchema({ lang, messages }))
    .required(),
});

export const addAttributeToGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    groupId: attributesGroupIdSchema(args),
    ...attributeCommonFields(args),
  });

export const updateAttributeInGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    groupId: attributesGroupIdSchema(args),
    attributeId: attributeIdSchema(args),
    ...attributeCommonFields(args),
  });

export const deleteAttributeFromGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    groupId: attributesGroupIdSchema(args),
    attributeId: attributeIdSchema(args),
  });

export const attributeInGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    ...attributeCommonFields(args),
  });

export const attributesGroupModalSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    name: attributesGroupNameSchema(args),
  });

export const createAttributesGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    name: attributesGroupNameSchema(args),
  });

export const updateAttributesGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: attributesGroupIdSchema({ messages: args.messages, lang: args.lang }),
    name: attributesGroupNameSchema(args),
  });
