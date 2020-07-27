import * as Yup from 'yup';
import { colorRegEx, phoneRegEx } from './regExp';
import { StringSchema } from 'yup';
import getValidationFieldMessage, {
  MultiLangSchemaMessagesInterface,
  SchemaMessagesInterface,
} from './getValidationFieldMessage';
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

export const CONSTANT_VALIDATION_KEYS = [
  'validation.translation.key',
  'validation.string.min',
  'validation.string.max',
  'validation.number.min',
  'validation.number.max',
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
        .required(getValidationFieldMessage({ messages, lang, key: 'validation.translation.key' })),
      value: Yup.string()
        .trim()
        .when('key', (key: string, value: StringSchema) => {
          return key === defaultLang && required
            ? value
                .min(
                  minLength,
                  getValidationFieldMessage({ messages, lang, key: 'validation.string.min' }) +
                    ` ${minLength}`,
                )
                .max(
                  maxLength,
                  getValidationFieldMessage({ messages, lang, key: 'validation.string.max' }) +
                    ` ${maxLength}`,
                )
                .required(getValidationFieldMessage({ messages, lang, key: requiredMessageKey }))
            : value.min(0);
        }),
    }),
  );
};

export const colorSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.lazy((value?: string | null) => {
    return !value
      ? Yup.string().nullable()
      : Yup.string()
          .trim()
          .matches(
            colorRegEx,
            getValidationFieldMessage({
              messages,
              lang,
              key: 'validation.color',
            }),
          );
  });

export const emailSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .email(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.email',
      }),
    )
    .trim()
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.email.required',
      }),
    );

export const phoneSchema = ({ messages, lang }: SchemaMessagesInterface) =>
  Yup.string()
    .matches(
      phoneRegEx,
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.phone',
      }),
    )
    .required(
      getValidationFieldMessage({
        messages,
        lang,
        key: 'validation.phone.required',
      }),
    );
