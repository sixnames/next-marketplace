import * as Yup from 'yup';
import { colorSchema, langStringInputSchema } from './schemaTemplates';
import { GENDER_ENUMS } from '../config';
import getFieldValidationMessage, {
  MultiLangSchemaMessagesInterface,
} from './getFieldValidationMessage';

export const optionVariantSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    key: Yup.mixed()
      .oneOf(GENDER_ENUMS)
      .required(
        getFieldValidationMessage({
          ...args,
          key: 'validation.option.variantKey',
        }),
      ),
    value: langStringInputSchema({
      ...args,
      requiredMessageKey: 'validation.option.variantValue',
    }),
  });

export const optionInGroupCommonSchema = (args: MultiLangSchemaMessagesInterface) => ({
  name: langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.option.name',
  }),
  color: colorSchema(args),
  variants: Yup.array().of(optionVariantSchema(args)),
  gender: Yup.mixed()
    .oneOf(GENDER_ENUMS)
    .nullable()
    .when('variants', {
      is: (variants: any[]) => {
        return !variants || !variants.length;
      },
      then: Yup.mixed()
        .oneOf(GENDER_ENUMS)
        .required(
          getFieldValidationMessage({
            ...args,
            key: 'validation.option.gender',
          }),
        ),
      otherwise: Yup.mixed().oneOf(GENDER_ENUMS).nullable(),
    }),
});

const optionsGroupNameSchema = (args: MultiLangSchemaMessagesInterface) =>
  langStringInputSchema({
    ...args,
    requiredMessageKey: 'validation.optionsGroup.name',
  });

const optionsGroupIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.optionsGroup.id',
      }),
    );

const optionIdSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.string()
    .nullable()
    .required(
      getFieldValidationMessage({
        ...args,
        key: 'validation.option.id',
      }),
    );

export const optionInGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    ...optionInGroupCommonSchema(args),
  });

export const addOptionToGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    groupId: optionsGroupIdSchema(args),
    ...optionInGroupCommonSchema(args),
  });

export const updateOptionInGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    groupId: optionsGroupIdSchema(args),
    optionId: optionIdSchema(args),
    ...optionInGroupCommonSchema(args),
  });

export const deleteOptionFromGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    groupId: optionsGroupIdSchema(args),
    optionId: optionIdSchema(args),
  });

export const optionsGroupModalSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    name: optionsGroupNameSchema(args),
  });

export const createOptionsGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    name: optionsGroupNameSchema(args),
  });

export const updateOptionsGroupSchema = (args: MultiLangSchemaMessagesInterface) =>
  Yup.object().shape({
    id: optionsGroupIdSchema(args),
    name: optionsGroupNameSchema(args),
  });
