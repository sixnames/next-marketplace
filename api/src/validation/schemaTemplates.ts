import * as Yup from 'yup';
import { colorRegEx, phoneRegEx } from './regExp';
import { StringSchema } from 'yup';
import getFieldValidationMessage, {
  MultiLangSchemaMessagesInterface,
  SchemaMessagesInterface,
} from './getFieldValidationMessage';
import { MessageKey } from '../config/apiMessages/messagesKeys';

export const minLongNameLength = 5;
export const maxLongNameLength = 150;
export const minDescriptionLength = 15;
export const maxDescriptionLength = 300;
export const minNameLength = 2;
export const maxNameLength = 70;
export const minPrice = 1;

interface LangStringInputSchemaInterface extends MultiLangSchemaMessagesInterface {
  requiredMessageKey: MessageKey;
  required?: boolean;
  min?: number;
  max?: number;
}

export const CONSTANT_VALIDATION_KEYS: MessageKey[] = [
  'validation.translation.key',
  'validation.string.min',
  'validation.string.max',
  'validation.number.min',
  'validation.number.max',
  'validation.email',
  'validation.email.required',
  'validation.phone',
  'validation.phone.required',
  'validation.color',
  'validation.color.required',

  // Configs validation
  'validation.configs.id',
  'validation.configs.value',

  // Currencies validation
  'validation.currencies.id',
  'validation.currencies.nameString',

  // Cities validation
  'validation.cities.id',
  'validation.cities.name',
  'validation.cities.slug',

  // Countries validation
  'validation.countries.id',
  'validation.countries.nameString',
  'validation.countries.currency',

  // Languages validation
  'validation.languages.id',
  'validation.languages.name',
  'validation.languages.key',
  'validation.languages.nativeName',

  // Roles validation
  'validation.roles.id',
  'validation.roles.name',
  'validation.roles.description',
  'validation.roles.ruleId',
  'validation.roles.navItemId',
  'validation.roles.operationId',

  // Users validation
  'validation.users.id',
  'validation.users.name',
  'validation.users.lastName',
  'validation.users.secondName',
  'validation.users.role',
  'validation.users.password',

  // Options groups validation
  'validation.optionsGroup.id',
  'validation.optionsGroup.name',
  'validation.option.id',
  'validation.option.name',
  'validation.option.variantKey',
  'validation.option.variantValue',
  'validation.option.gender',

  // Attributes groups validation
  'validation.attributesGroups.id',
  'validation.attributesGroups.name',
  'validation.attributes.id',
  'validation.attributes.name',
  'validation.attributes.variant',
  'validation.attributes.position',
  'validation.attributes.options',

  // Rubric variants validation
  'validation.rubricVariants.id',
  'validation.rubricVariants.name',

  // Rubric validation
  'validation.rubrics.id',
  'validation.rubrics.name',
  'validation.rubrics.variant',
  'validation.rubrics.defaultTitle',
  'validation.rubrics.keyword',
  'validation.rubrics.gender',

  // Products validation
  'validation.products.id',
  'validation.products.name',
  'validation.products.cardName',
  'validation.products.description',
  'validation.products.rubrics',
  'validation.products.price',
  'validation.products.attributesGroupId',
  'validation.products.attributeId',
  'validation.products.attributeKey',
  'validation.products.assets',

  // Metrics validation
  'validation.metrics.id',
  'validation.metrics.name',
];

export const langStringInputSchema = ({
  defaultLang,
  requiredMessageKey,
  required = true,
  messages,
  lang,
  min,
  max,
}: LangStringInputSchemaInterface) => {
  const minLength = min || minNameLength;
  const maxLength = max || maxNameLength;

  return Yup.array().of(
    Yup.object({
      key: Yup.string()
        .trim()
        .required(getFieldValidationMessage({ messages, lang, key: 'validation.translation.key' })),
      value: Yup.string()
        .trim()
        .when('key', (key: string, value: StringSchema) => {
          return key === defaultLang && required
            ? value
                .min(
                  minLength,
                  getFieldValidationMessage({ messages, lang, key: 'validation.string.min' }) +
                    ` ${minLength}`,
                )
                .max(
                  maxLength,
                  getFieldValidationMessage({ messages, lang, key: 'validation.string.max' }) +
                    ` ${maxLength}`,
                )
                .required(getFieldValidationMessage({ messages, lang, key: requiredMessageKey }))
            : value.min(0);
        }),
    }),
  );
};

export interface IdSchemaInterface {
  args: SchemaMessagesInterface;
  key: MessageKey;
}

export const idSchema = ({ args, key }: IdSchemaInterface) =>
  Yup.string()
    .nullable()
    .required(
      getFieldValidationMessage({
        ...args,
        key,
      }),
    );

export const colorSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.lazy((value?: string | null) => {
    return !value
      ? Yup.string().nullable()
      : Yup.string()
          .trim()
          .matches(
            colorRegEx,
            getFieldValidationMessage({
              messages,
              lang,
              key: 'validation.color',
            }),
          );
  });

export const emailSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .email(
      getFieldValidationMessage({
        messages,
        lang,
        key: 'validation.email',
      }),
    )
    .trim()
    .required(
      getFieldValidationMessage({
        messages,
        lang,
        key: 'validation.email.required',
      }),
    );

export const phoneSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .matches(
      phoneRegEx,
      getFieldValidationMessage({
        messages,
        lang,
        key: 'validation.phone',
      }),
    )
    .required(
      getFieldValidationMessage({
        messages,
        lang,
        key: 'validation.phone.required',
      }),
    );
