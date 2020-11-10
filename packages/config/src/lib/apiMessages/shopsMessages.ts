import { MessageInterface } from './messagesKeys';
import { DEFAULT_LANG, SECONDARY_LANG } from '../common';

export const shopsMessages: MessageInterface[] = [
  {
    key: 'shops.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Магазин с таким названием уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop already exist.',
      },
    ],
  },
  {
    key: 'shops.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания магазина.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop creation error.',
      },
    ],
  },
  {
    key: 'shops.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Магазин создан.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop created.',
      },
    ],
  },
  {
    key: 'shops.update.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Магазин не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop not found.',
      },
    ],
  },
  {
    key: 'shops.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Магазин с таким названием уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop already exist.',
      },
    ],
  },
  {
    key: 'shops.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления магазина.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop update error.',
      },
    ],
  },
  {
    key: 'shops.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Магазин обновлен.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop updated.',
      },
    ],
  },
  {
    key: 'shops.delete.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Магазин не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop not found.',
      },
    ],
  },
  {
    key: 'shops.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления магазина.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop delete error.',
      },
    ],
  },
  {
    key: 'shops.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Магазин удален.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop removed.',
      },
    ],
  },
  {
    key: 'validation.shops.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID магазина обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop ID is required.',
      },
    ],
  },
  {
    key: 'validation.shops.nameString',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Название обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop name is required.',
      },
    ],
  },
  {
    key: 'validation.shops.assets',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Фото магазина обязательны к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop assets is required.',
      },
    ],
  },
  {
    key: 'validation.shops.address',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Адрес магазина обязателен к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop address is required.',
      },
    ],
  },
  {
    key: 'validation.shops.logo',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Логотип магазина обязателен к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop logo is required.',
      },
    ],
  },
  {
    key: 'validation.shops.products',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товары магазина обязательны к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop products is required.',
      },
    ],
  },
];
