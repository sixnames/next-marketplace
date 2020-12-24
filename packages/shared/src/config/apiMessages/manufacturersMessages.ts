import { DEFAULT_LANG, SECONDARY_LANG } from '../common';
import { MessageInterface } from './messagesKeys';

export const manufacturersMessages: MessageInterface[] = [
  {
    key: 'manufacturers.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Производитель с указанным именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Manufacturer with same name is already exists.',
      },
    ],
  },
  {
    key: 'manufacturers.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания производителя.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Manufacturer creation error.',
      },
    ],
  },
  {
    key: 'manufacturers.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Производитель создан.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Manufacturer created.',
      },
    ],
  },
  {
    key: 'manufacturers.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Производитель с указанным именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Manufacturer with same name is already exists.',
      },
    ],
  },
  {
    key: 'manufacturers.update.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Производитель не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand not found.',
      },
    ],
  },
  {
    key: 'manufacturers.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления производителя.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Manufacturer update error.',
      },
    ],
  },
  {
    key: 'manufacturers.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Производитель обновлён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Brand updated.',
      },
    ],
  },
  {
    key: 'manufacturers.delete.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Производитель не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Manufacturer not found.',
      },
    ],
  },
  {
    key: 'manufacturers.delete.used',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Производитель используется в товарах.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Manufacturer is used in products.',
      },
    ],
  },
  {
    key: 'manufacturers.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления производителя.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Manufacturer delete error.',
      },
    ],
  },
  {
    key: 'manufacturers.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Производитель удалён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Manufacturer removed.',
      },
    ],
  },
  {
    key: 'validation.manufacturers.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID производителя обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Manufacturer ID is required.',
      },
    ],
  },
  {
    key: 'validation.manufacturers.name',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Название производителя обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Manufacturer name is required.',
      },
    ],
  },
  {
    key: 'validation.manufacturers.url',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ссылка на сайт производителя обязательна.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Manufacturer url is required.',
      },
    ],
  },
  {
    key: 'validation.manufacturers.description',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Описание производителя обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Manufacturer description is required.',
      },
    ],
  },
];
