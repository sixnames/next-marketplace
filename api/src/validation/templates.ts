import * as Yup from 'yup';
import { colorRegEx, phoneRegEx } from './regExp';
import { NotRequiredArraySchema, StringSchema } from 'yup';
import { ROLES_ENUM } from '../config';

export const minPasswordLength = 5;
export const maxPasswordLength = 30;
export const minDescriptionLength = 15;
export const maxDescriptionLength = 300;
export const minNameLength = 2;
// export const minShortNameLength = 1;
export const maxNameLength = 70;
export const minPrice = 1;

export const id = Yup.string().nullable().required('ID обязателено к заполнению.');
export const role = Yup.mixed().oneOf(ROLES_ENUM);

export const langInput = (
  valueSchema: StringSchema,
): NotRequiredArraySchema<{ key: string; value: string | undefined } | undefined> =>
  Yup.array().of(
    Yup.object({
      key: Yup.string().trim().required('Язык обязателен к заполнению.'),
      value: valueSchema,
    }),
  );

export const notNullableName = (
  nameTarget: string,
): StringSchema<Exclude<string | undefined, undefined | null>> =>
  Yup.string()
    .min(minNameLength, `${nameTarget} должно состоять минимум из ${minNameLength} символов`)
    .max(maxNameLength, `${nameTarget} должно состоять максимум из ${maxNameLength} символов`)
    .trim()
    .required(`${nameTarget} обязателено к заполнению.`);

interface LangStringInputSchemaInterface {
  defaultLang: string;
  entityMessage: string;
}

export const langStringInputSchema = ({
  defaultLang,
  entityMessage,
}: LangStringInputSchemaInterface) =>
  Yup.array().of(
    Yup.object({
      key: Yup.string().trim().required('Ключ языка обязателен к заполнению.'),
      value: Yup.string()
        .trim()
        .when('key', (key: string, value: StringSchema) => {
          return key === defaultLang
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

export const name = Yup.string()
  .nullable()
  .min(minNameLength, `Имя должно состоять минимум из ${minNameLength} символов`)
  .max(maxNameLength, `Имя должно состоять максимум из ${maxNameLength} символов`)
  .trim()
  .required('Имя обязателено к заполнению.');

export const color = Yup.lazy((value?: string | null) => {
  return !value
    ? Yup.string().nullable()
    : Yup.string().trim().matches(colorRegEx, 'Цвет должен быть в HEX формате. Пример 333333.');
});

export const email = Yup.string()
  .email('Невалидный Email формат')
  .trim()
  .required('Email обязателен к заполнению.');

export const password = Yup.string()
  .min(minPasswordLength, `Пароль должен состоять минимум из ${minPasswordLength} символов`)
  .max(maxPasswordLength, `Пароль должен состоять максимум из ${maxPasswordLength} символов`)
  .trim()
  .required('Пароль обязателен к заполнению.');

export const lastName = Yup.string().max(
  maxNameLength,
  `Фамилия должна содержать не больше ${maxNameLength} символов`,
);

export const secondName = Yup.string().max(
  maxNameLength,
  `Отчество должно содержать не больше ${maxNameLength} символов`,
);

export const cardName = Yup.string()
  .min(
    minNameLength,
    `Имя карточки товара должно состоять минимум из ${minPasswordLength} символов`,
  )
  .max(
    maxNameLength,
    `Имя карточки товара должно состоять максимум из ${maxPasswordLength} символов`,
  )
  .trim()
  .required('Имя карточки товара обязателено к заполнению.');

export const price = Yup.number().min(minPrice).integer().required();

export const description = Yup.string()
  .min(minDescriptionLength, `Описание должно состоять минимум из ${minPasswordLength} символов`)
  .max(maxDescriptionLength, `Описание должно состоять максимум из ${maxPasswordLength} символов`)
  .trim()
  .required('Описание обязателено к заполнению.');

export const phone = Yup.string()
  .matches(phoneRegEx, 'Не валидный телефон')
  .required('Телефон обязателен к заполнению.');

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
