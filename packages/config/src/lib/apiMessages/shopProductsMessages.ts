import { MessageInterface } from './messagesKeys';
import { DEFAULT_LANG, SECONDARY_LANG } from '../common';

export const shopProductsMessages: MessageInterface[] = [
  {
    key: 'shopProducts.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар магазина с таким названием уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop product already exist.',
      },
    ],
  },
  {
    key: 'shopProducts.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания товара в магазин.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop product creation error.',
      },
    ],
  },
  {
    key: 'shopProducts.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар магазина создан.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop product created.',
      },
    ],
  },
  {
    key: 'shopProducts.update.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар магазина не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop product not found.',
      },
    ],
  },
  {
    key: 'shopProducts.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар магазина уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop product already exist.',
      },
    ],
  },
  {
    key: 'shopProducts.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления товара магазина.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop product update error.',
      },
    ],
  },
  {
    key: 'shopProducts.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар магазина обновлен.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop product updated.',
      },
    ],
  },
  {
    key: 'shopProducts.delete.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар магазина не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop product not found.',
      },
    ],
  },
  {
    key: 'shopProducts.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления товара магазина.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop product delete error.',
      },
    ],
  },
  {
    key: 'shopProducts.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар магазина удален.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop product removed.',
      },
    ],
  },
  {
    key: 'validation.shopProducts.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID товара магазина обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop product ID is required.',
      },
    ],
  },
  {
    key: 'validation.shopProducts.available',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Наличие обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop product availability is required.',
      },
    ],
  },
  {
    key: 'validation.shopProducts.price',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Цена товара магазина обязательна к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop product price is required.',
      },
    ],
  },
  {
    key: 'validation.shopProducts.product',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID товара из каталога обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Catalogue product ID is required.',
      },
    ],
  },
];
