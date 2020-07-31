import { MessageInterface } from './messagesKeys';
import { DEFAULT_LANG, SECONDARY_LANG } from '../common';

const citiesMessages: MessageInterface[] = [
  {
    key: 'cities.create.notFound',
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
    key: 'cities.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Город с таким названием уже существует в данной стране.',
      },
      {
        key: SECONDARY_LANG,
        value: 'City with same name is already exists in this country.',
      },
    ],
  },
  {
    key: 'cities.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания города.',
      },
      {
        key: SECONDARY_LANG,
        value: 'City creation error.',
      },
    ],
  },
  {
    key: 'cities.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Город создан.',
      },
      {
        key: SECONDARY_LANG,
        value: 'City created.',
      },
    ],
  },
  {
    key: 'cities.update.notFound',
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
    key: 'cities.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Город с таким названием уже существует в данной стране.',
      },
      {
        key: SECONDARY_LANG,
        value: 'City with same name is already exists in this country.',
      },
    ],
  },
  {
    key: 'cities.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления города.',
      },
      {
        key: SECONDARY_LANG,
        value: 'City update error.',
      },
    ],
  },
  {
    key: 'cities.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Город обновлён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'City updated.',
      },
    ],
  },
  {
    key: 'cities.delete.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Город не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'City not found.',
      },
    ],
  },
  {
    key: 'cities.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления города.',
      },
      {
        key: SECONDARY_LANG,
        value: 'City delete error.',
      },
    ],
  },
  {
    key: 'cities.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Город удалён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'City removed.',
      },
    ],
  },
  {
    key: 'validation.cities.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID города обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'City ID is required.',
      },
    ],
  },
  {
    key: 'validation.cities.name',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Название города обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'City Name is required.',
      },
    ],
  },
  {
    key: 'validation.cities.key',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ключ города обязателен к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'City Key is required.',
      },
    ],
  },
];

export default citiesMessages;
