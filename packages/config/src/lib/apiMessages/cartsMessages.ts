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
    key: 'carts.repeatOrder.orderNotFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Заказ не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Order not found.',
      },
    ],
  },
  {
    key: 'carts.repeatOrder.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка добавления товаров в корзину.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Cart products addition error.',
      },
    ],
  },
  {
    key: 'carts.repeatOrder.shopProductNotFound',
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
    key: 'carts.repeatOrder.productNotFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товар не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Product not found.',
      },
    ],
  },
  {
    key: 'carts.repeatOrder.notEnough',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'В магазине не достаточно товаров.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Not enough products in the shop.',
      },
    ],
  },
  {
    key: 'carts.repeatOrder.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Товары добавлены в корзину.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Products added to the cart.',
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
