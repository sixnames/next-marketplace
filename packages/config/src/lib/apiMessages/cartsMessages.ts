import { MessageInterface } from './messagesKeys';
import { DEFAULT_LANG, SECONDARY_LANG } from '../common';

export const cartsMessages: MessageInterface[] = [
  {
    key: 'carts.addProduct.cartNotFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Корзина не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Cart not found.',
      },
    ],
  },
  {
    key: 'carts.addProduct.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка добавления товара в корзину.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Cart product addition error.',
      },
    ],
  },
  {
    key: 'carts.addProduct.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар добавлен в корзину.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product added to the cart.',
      },
    ],
  },
  {
    key: 'carts.updateProduct.cartNotFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Корзина не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Cart not found.',
      },
    ],
  },
  {
    key: 'carts.updateProduct.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления товара корзины.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Cart product update error.',
      },
    ],
  },
  {
    key: 'carts.updateProduct.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар обновлён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product updated.',
      },
    ],
  },
  {
    key: 'carts.deleteProduct.cartNotFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Корзина не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Cart not found.',
      },
    ],
  },
  {
    key: 'carts.deleteProduct.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления товара из корзины.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Cart product delete error.',
      },
    ],
  },
  {
    key: 'carts.deleteProduct.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар удалён из корзины.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product removed form the cart.',
      },
    ],
  },
  {
    key: 'carts.clear.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления товаров из корзины.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Cart product delete error.',
      },
    ],
  },
  {
    key: 'carts.clear.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товары удалены из корзины.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product removed form the cart.',
      },
    ],
  },
  {
    key: 'validation.carts.shopProductId',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID товара магазина обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Shop product ID is required.',
      },
    ],
  },
  {
    key: 'validation.carts.amount',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Количество обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Cart product amount is required.',
      },
    ],
  },
  {
    key: 'validation.carts.cartProductId',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID товара корзины обязательно.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Cart product ID is required.',
      },
    ],
  },
];
