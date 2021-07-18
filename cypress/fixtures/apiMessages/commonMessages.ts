import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const commonMessages: MessageBaseInterface[] = [
  {
    slug: 'permission.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `У вас не достаточно прав на выполнение данной операции`,
      [SECONDARY_LOCALE]: `You don't have permission for this operation`,
    },
  },
  {
    slug: 'validation.string.min',
    messageI18n: {
      [DEFAULT_LOCALE]: `Минимальное количество символов`,
      [SECONDARY_LOCALE]: `Minimal length is`,
    },
  },
  {
    slug: 'validation.string.max',
    messageI18n: {
      [DEFAULT_LOCALE]: `Максимальное количество символов`,
      [SECONDARY_LOCALE]: `Maximum length is`,
    },
  },
  {
    slug: 'validation.number.min',
    messageI18n: {
      [DEFAULT_LOCALE]: `Минимальное значение`,
      [SECONDARY_LOCALE]: `Minimal value is`,
    },
  },
  {
    slug: 'validation.number.max',
    messageI18n: {
      [DEFAULT_LOCALE]: `Максимальное значение`,
      [SECONDARY_LOCALE]: `Maximum value is`,
    },
  },
  {
    slug: 'validation.email',
    messageI18n: {
      [DEFAULT_LOCALE]: `Не валидный формат Email адреса.`,
      [SECONDARY_LOCALE]: `Invalid Email format.`,
    },
  },
  {
    slug: 'validation.email.required',
    messageI18n: {
      [DEFAULT_LOCALE]: `Email обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Email is required.`,
    },
  },
  {
    slug: 'validation.phone',
    messageI18n: {
      [DEFAULT_LOCALE]: `Не валидный формат телефона.`,
      [SECONDARY_LOCALE]: `Invalid Phone format.`,
    },
  },
  {
    slug: 'validation.phone.required',
    messageI18n: {
      [DEFAULT_LOCALE]: `Телефон обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Phone is required.`,
    },
  },
  {
    slug: 'validation.color',
    messageI18n: {
      [DEFAULT_LOCALE]: `Цвет должен быть в HEX формате. Пример fafafa.`,
      [SECONDARY_LOCALE]: `Invalid color format. Example fafafa`,
    },
  },
  {
    slug: 'validation.color.required',
    messageI18n: {
      [DEFAULT_LOCALE]: `Цвет обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Color is required.`,
    },
  },
  {
    slug: 'validation.translation.key',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ключ языка обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Language key is required.`,
    },
  },
  {
    slug: 'validation.contacts',
    messageI18n: {
      [DEFAULT_LOCALE]: `Контакты обязательны к заполнению.`,
      [SECONDARY_LOCALE]: `Contacts is required.`,
    },
  },
  {
    slug: 'validation.address',
    messageI18n: {
      [DEFAULT_LOCALE]: `Адрес обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Address is required.`,
    },
  },
  {
    slug: 'validation.point.lat',
    messageI18n: {
      [DEFAULT_LOCALE]: `Широта обязательна к заполнению.`,
      [SECONDARY_LOCALE]: `Coordinates latitude is required.`,
    },
  },
  {
    slug: 'validation.point.lng',
    messageI18n: {
      [DEFAULT_LOCALE]: `Долгота обязательна к заполнению.`,
      [SECONDARY_LOCALE]: `Coordinates longitude is required.`,
    },
  },
  {
    slug: 'validation.url',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ссылка обязательна.`,
      [SECONDARY_LOCALE]: `Url is required.`,
    },
  },
  {
    slug: 'validation.domain',
    messageI18n: {
      [DEFAULT_LOCALE]: `Не валидный формат доменного имени`,
      [SECONDARY_LOCALE]: `Invalid domain name`,
    },
  },
];
