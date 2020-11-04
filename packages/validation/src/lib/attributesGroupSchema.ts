import * as Yup from 'yup';
import { idSchema, langStringInputSchema } from './schemaTemplates';
import {
  ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANTS_ENUMS,
} from '@yagu/config';
import {
  getFieldValidationMessage,
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';
import { ArraySchema } from 'yup';

export const attributesGroupIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.attributesGroups.id' });

export const attributeIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  idSchema({ args, key: 'validation.attributes.id' });

const attributesGroupNameSchema = (args: MultiLangSchemaMessagesInterface) =>
  langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.attributesGroups.name',
  });

const options = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .when('variant', {
      is: (variant: string) => {
        return (
          variant === ATTRIBUTE_VARIANT_SELECT || variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT
        );
      },
      then: Yup.string().required(
        getFieldValidationMessage({
          ...args,
          key: 'validation.attributes.options',
        }),
      ),
      otherwise: Yup.string(),
    });

const metric = Yup.string().nullable();

const attributePositioningInTitleSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    key: Yup.string().required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.translation.key',
      }),
    ),
    value: Yup.mixed()
      .oneOf(ATTRIBUTE_POSITION_IN_TITLE_ENUMS)
      .required(
        getFieldValidationMessage({
          ...args,
          key: 'validation.attributes.position',
        }),
      ),
  });

const attributeVariantSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.mixed()
    .oneOf(ATTRIBUTE_VARIANTS_ENUMS)
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.attributes.variant',
      }),
    );

const attributeCommonFields = (args: MultiLangSchemaMessagesInterface) => ({
  name: langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.attributes.name',
  }),
  variant: attributeVariantSchema(args),
  metric,
  options: options(args),
  positioningInTitle: Yup.array()
    .nullable()
    .when('variant', (variant: any, schema: ArraySchema<any>) => {
      if (variant === ATTRIBUTE_VARIANT_SELECT) {
        return schema.of(attributePositioningInTitleSchema(args)).required();
      }
      return schema;
    }),
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
    id: attributesGroupIdSchema(args),
    name: attributesGroupNameSchema(args),
  });
