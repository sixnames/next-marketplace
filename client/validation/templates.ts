import * as Yup from 'yup';
import { colorRegEx, phoneRegEx } from './regExp';
import { StringSchema } from 'yup';
import getValidationFieldMessage, { SchemaMessagesInterface } from './getValidationFieldMessage';

export const minLongNameLength = 5;
export const maxLongNameLength = 150;
export const minDescriptionLength = 15;
export const maxDescriptionLength = 300;
export const minNameLength = 2;
export const maxNameLength = 70;
export const minPrice = 1;

export const id = Yup.string().nullable().required('ID обязателено к заполнению.');

interface LangStringInputSchemaInterface {
  defaultLang: string;
  entityMessage?: string;
  required?: boolean;
}

export const langStringInputSchema = ({
  defaultLang,
  entityMessage,
  required = true,
}: LangStringInputSchemaInterface) =>
  Yup.array().of(
    Yup.object({
      key: Yup.string().trim().required('Ключ языка обязателен к заполнению.'),
      value: Yup.string()
        .trim()
        .when('key', (key: string, value: StringSchema) => {
          return key === defaultLang && required
            ? value
                .min(
                  minNameLength,
                  `${entityMessage} должно состоять минимум из ${minNameLength} символов`,
                )
                .max(
                  maxNameLength,
                  `${entityMessage} должно состоять максимум из ${maxNameLength} символов`,
                )
                .required(`${entityMessage} обязателено к заполнению.`)
            : value.min(0);
        }),
    }),
  );

export const color = Yup.lazy((value?: string | null) => {
  return !value
    ? Yup.string().nullable()
    : Yup.string().trim().matches(colorRegEx, 'Цвет должен быть в HEX формате. Пример 333333.');
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
  .required('Имя карточки товара обязателено к заполнению.');

export const price = Yup.number().min(minPrice).integer().required();

export const description = Yup.string()
  .min(minDescriptionLength, `Описание должно состоять минимум из ${minDescriptionLength} символов`)
  .max(
    maxDescriptionLength,
    `Описание должно состоять максимум из ${maxDescriptionLength} символов`,
  )
  .trim()
  .required('Описание обязателено к заполнению.');

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

// export const role = Yup.string();
/*

export const startDate = Yup.date().min(new Date(), 'Дата начала должна быть позже текущего времени.').required();
export const endDate = Yup.date().min(new Date(), 'Дата окончания должна быть позже текущего времени.').required();
export const title = Yup.string().min(3).max(50).required('Заголовок обязателен к заполнению.');
export const arrayOfIds = Yup.array().of(Yup.string());
export const description = Yup.string().min(2).max(300);
export const image = Yup.object();
export const quantity = Yup.number().min(0).integer().required();
export const selfDelivery = Yup.boolean();*/
