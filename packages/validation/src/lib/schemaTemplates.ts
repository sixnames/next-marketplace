import * as Yup from 'yup';
import { colorRegEx, phoneRegEx } from './regExp';
import { StringSchema } from 'yup';
import {
  getFieldValidationMessage,
  MultiLangSchemaMessagesInterface,
  SchemaMessagesInterface,
} from './getFieldValidationMessage';
import { MessageKey } from '@yagu/config';

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

export const contactsInputSchema = ({ messages, lang }: MultiLangSchemaMessagesInterface) => {
  return Yup.object({
    emails: Yup.array().of(emailSchema({ messages, lang })),
    phones: Yup.array().of(phoneSchema({ messages, lang })),
  });
};

export const geoPointSchema = (args: MultiLangSchemaMessagesInterface) => {
  return Yup.object({
    lat: Yup.number().required(getFieldValidationMessage({ ...args, key: 'validation.point.lat' })),
    lng: Yup.number().required(getFieldValidationMessage({ ...args, key: 'validation.point.lng' })),
  });
};

export const addressSchema = (args: MultiLangSchemaMessagesInterface) => {
  return Yup.object({
    formattedAddress: Yup.string().required(
      getFieldValidationMessage({ ...args, key: 'validation.address' }),
    ),
    point: geoPointSchema(args),
  })
    .nullable()
    .required(getFieldValidationMessage({ ...args, key: 'validation.address' }));
};
