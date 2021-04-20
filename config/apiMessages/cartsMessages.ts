import { MessageBaseInterface } from 'db/dbModels';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';

export const cartsMessages: MessageBaseInterface[] = [
  {
    slug: 'carts.addProduct.cartNotFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Корзина не найдена.`,
      [SECONDARY_LOCALE]: `Cart not found.`,
    },
  },
  {
    slug: 'carts.addProduct.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка добавления товара в корзину.`,
      [SECONDARY_LOCALE]: `Cart product addition error.`,
    },
  },
  {
    slug: 'carts.addProduct.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар добавлен в корзину.`,
      [SECONDARY_LOCALE]: `Product added to the cart.`,
    },
  },
  {
    slug: 'carts.repeatOrder.orderNotFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Заказ не найден.`,
      [SECONDARY_LOCALE]: `Order not found.`,
    },
  },
  {
    slug: 'carts.repeatOrder.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка добавления товаров в корзину.`,
      [SECONDARY_LOCALE]: `Cart products addition error.`,
    },
  },
  {
    slug: 'carts.repeatOrder.shopProductNotFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар магазина не найден.`,
      [SECONDARY_LOCALE]: `Shop product not found.`,
    },
  },
  {
    slug: 'carts.repeatOrder.productNotFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар не найден.`,
      [SECONDARY_LOCALE]: `Product not found.`,
    },
  },
  {
    slug: 'carts.repeatOrder.notEnough',
    messageI18n: {
      [DEFAULT_LOCALE]: `В магазине не достаточно товаров.`,
      [SECONDARY_LOCALE]: `Not enough products in the shop.`,
    },
  },
  {
    slug: 'carts.repeatOrder.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товары добавлены в корзину.`,
      [SECONDARY_LOCALE]: `Products added to the cart.`,
    },
  },
  {
    slug: 'carts.updateProduct.cartNotFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Корзина не найдена.`,
      [SECONDARY_LOCALE]: `Cart not found.`,
    },
  },
  {
    slug: 'carts.updateProduct.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления товара корзины.`,
      [SECONDARY_LOCALE]: `Cart product update error.`,
    },
  },
  {
    slug: 'carts.updateProduct.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар обновлён.`,
      [SECONDARY_LOCALE]: `Product updated.`,
    },
  },
  {
    slug: 'carts.deleteProduct.cartNotFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Корзина не найдена.`,
      [SECONDARY_LOCALE]: `Cart not found.`,
    },
  },
  {
    slug: 'carts.deleteProduct.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления товара из корзины.`,
      [SECONDARY_LOCALE]: `Cart product delete error.`,
    },
  },
  {
    slug: 'carts.deleteProduct.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар удалён из корзины.`,
      [SECONDARY_LOCALE]: `Product removed form the cart.`,
    },
  },
  {
    slug: 'carts.clear.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления товаров из корзины.`,
      [SECONDARY_LOCALE]: `Cart product delete error.`,
    },
  },
  {
    slug: 'carts.clear.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товары удалены из корзины.`,
      [SECONDARY_LOCALE]: `Product removed form the cart.`,
    },
  },
  {
    slug: 'validation.carts.shopProductId',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID товара магазина обязательно.`,
      [SECONDARY_LOCALE]: `Shop product ID is required.`,
    },
  },
  {
    slug: 'validation.carts.amount',
    messageI18n: {
      [DEFAULT_LOCALE]: `Количество обязательно.`,
      [SECONDARY_LOCALE]: `Cart product amount is required.`,
    },
  },
  {
    slug: 'validation.carts.cartProductId',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID товара корзины обязательно.`,
      [SECONDARY_LOCALE]: `Cart product ID is required.`,
    },
  },
];
