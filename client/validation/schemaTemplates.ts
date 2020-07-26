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

export const id = Yup.string().nullable().required('ID обязательно к заполнению.');

interface LangStringInputSchemaInterface extends MultiLangSchemaMessagesInterface {
  requiredMessageKey: MessageKey;
  required?: boolean;
}

export const langStringInputSchema = ({
  defaultLang,
  requiredMessageKey,
  required = true,
  messages,
  lang,
}: LangStringInputSchemaInterface) =>
  Yup.array().of(
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
                  minNameLength,
                  getValidationFieldMessage({ messages, lang, key: 'validation.string.min' }) +
                    `${minNameLength}`,
                )
                .max(
                  maxNameLength,
                  getValidationFieldMessage({ messages, lang, key: 'validation.string.max' }) +
                    `${maxNameLength}`,
                )
                .required(getValidationFieldMessage({ messages, lang, key: requiredMessageKey }))
            : value.min(0);
        }),
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

export const cardName = Yup.string()
  .min(
    minNameLength,
    `Имя карточки товара должно состоять минимум из ${minLongNameLength} символов`,
  )
  .max(
    maxNameLength,
    `Имя карточки товара должно состоять максимум из ${maxLongNameLength} символов`,
  )
  .trim()
  .required('Имя карточки товара обязательно к заполнению.');

export const price = Yup.number().min(minPrice).integer().required();

export const description = Yup.string()
  .min(minDescriptionLength, `Описание должно состоять минимум из ${minDescriptionLength} символов`)
  .max(
    maxDescriptionLength,
    `Описание должно состоять максимум из ${maxDescriptionLength} символов`,
  )
  .trim()
  .required('Описание обязательно к заполнению.');

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
