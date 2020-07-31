import { MessageInterface } from './messagesKeys';
import { DEFAULT_LANG, SECONDARY_LANG } from '../common';

const countriesMessages: MessageInterface[] = [
  {
    key: 'countries.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Страна с таким названием уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Country with same name is already exists.',
      },
    ],
  },
  {
    key: 'countries.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания страны.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Country creation error.',
      },
    ],
  },
  {
    key: 'countries.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Страна создана.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Country created.',
      },
    ],
  },
  {
    key: 'countries.update.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Страна не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Country not found.',
      },
    ],
  },
  {
    key: 'countries.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Страна с таким названием уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Country with same name is already exists.',
      },
    ],
  },
  {
    key: 'countries.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления страны.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Country update error.',
      },
    ],
  },
  {
    key: 'countries.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Страна обновлена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Country updated.',
      },
    ],
  },
  {
    key: 'countries.delete.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Страна не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Country not found.',
      },
    ],
  },
  {
    key: 'countries.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления страны.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Country delete error.',
      },
    ],
  },
  {
    key: 'countries.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Страна удалена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Country removed.',
      },
    ],
  },
  {
    key: 'validation.countries.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID страны обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Country ID is required.',
      },
    ],
  },
  {
    key: 'validation.countries.nameString',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Название страны обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Country Name is required.',
      },
    ],
  },
  {
    key: 'validation.countries.currency',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Валюта страны обязательна к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Country Currency is required.',
      },
    ],
  },
];

export default countriesMessages;
