import { MessageInterface } from './messagesKeys';
import { DEFAULT_LANG, SECONDARY_LANG } from '../common';

export const commonMessages: MessageInterface[] = [
  {
    key: 'validation.string.min',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Минимальное количество символов',
      },
      {
        key: SECONDARY_LANG,
        value: 'Minimal length is',
      },
    ],
  },
  {
    key: 'validation.string.max',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Максимальное количество символов',
      },
      {
        key: SECONDARY_LANG,
        value: 'Maximum length is',
      },
    ],
  },
  {
    key: 'validation.number.min',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Минимальное значение',
      },
      {
        key: SECONDARY_LANG,
        value: 'Minimal value is',
      },
    ],
  },
  {
    key: 'validation.number.max',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Максимальное значение',
      },
      {
        key: SECONDARY_LANG,
        value: 'Maximum value is',
      },
    ],
  },
  {
    key: 'validation.email',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Не валидный формат Email адреса.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Invalid Email format.',
      },
    ],
  },
  {
    key: 'validation.email.required',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Email обязателен к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Email is required.',
      },
    ],
  },
  {
    key: 'validation.phone',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Не валидный формат телефона.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Invalid Phone format.',
      },
    ],
  },
  {
    key: 'validation.phone.required',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Телефон пользователя обязателен к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User Phone is required.',
      },
    ],
  },
  {
    key: 'validation.color',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Цвет должен быть в HEX формате. Пример fafafa.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Invalid color format. Example fafafa',
      },
    ],
  },
  {
    key: 'validation.color.required',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Цвет обязателен к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Color is required.',
      },
    ],
  },
  {
    key: 'validation.translation.key',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ключ языка обязателен к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Language key is required.',
      },
    ],
  },
  {
    key: 'validation.contacts',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Контакты обязательны к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Contacts is required.',
      },
    ],
  },
];
