import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const ordersMessages: MessageBaseInterface[] = [
  {
    slug: 'orders.makeAnOrder.guestRoleNotFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Исходная роль нового пользователя не найдена.`,
      [SECONDARY_LOCALE]: `New user default role not found.`,
    },
  },
  {
    slug: 'orders.makeAnOrder.userCreationError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания нового пользователя.`,
      [SECONDARY_LOCALE]: `New user creation error.`,
    },
  },
  {
    slug: 'orders.makeAnOrder.userCreationDuplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пользователь с данным Email или телефоном уже существует. Войдите в свой аккаунт пожалуйста.`,
      [SECONDARY_LOCALE]: `User with the same email or phone already exists. Please login.`,
    },
  },
  {
    slug: 'orders.makeAnOrder.productsNotFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Не все товары корзины найдены в магазинах.`,
      [SECONDARY_LOCALE]: `Not all products shops are found.`,
    },
  },
  {
    slug: 'orders.makeAnOrder.initialStatusNotFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Исходный статус заказа не найден.`,
      [SECONDARY_LOCALE]: `Order default status not found.`,
    },
  },
  {
    slug: 'orders.makeAnOrder.empty',
    messageI18n: {
      [DEFAULT_LOCALE]: `Корзина пуста.`,
      [SECONDARY_LOCALE]: `Cart is empty.`,
    },
  },
  {
    slug: 'orders.makeAnOrder.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания заказа.`,
      [SECONDARY_LOCALE]: `Order creation error.`,
    },
  },
  {
    slug: 'orders.makeAnOrder.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Заказ создан.`,
      [SECONDARY_LOCALE]: `Order created.`,
    },
  },
  {
    slug: 'orders.updateOrder.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Заказ не найден.`,
      [SECONDARY_LOCALE]: `Order not found.`,
    },
  },
  {
    slug: 'orders.updateOrder.statusNotFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Статус заказа не найден.`,
      [SECONDARY_LOCALE]: `Order status not found.`,
    },
  },
  {
    slug: 'orders.updateOrder.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления заказа.`,
      [SECONDARY_LOCALE]: `Order update error.`,
    },
  },
  {
    slug: 'orders.updateOrder.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Заказ обновлён.`,
      [SECONDARY_LOCALE]: `Order updated.`,
    },
  },
  {
    slug: 'orders.deleteOrder.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Заказ не найден.`,
      [SECONDARY_LOCALE]: `Order not found.`,
    },
  },
  {
    slug: 'orders.deleteOrder.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления заказа.`,
      [SECONDARY_LOCALE]: `Order delete error.`,
    },
  },
  {
    slug: 'orders.deleteOrder.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Заказ удалён.`,
      [SECONDARY_LOCALE]: `Order removed.`,
    },
  },
  {
    slug: 'validation.orders.reservationDate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Дата отгрузки обязательна к заполнению.`,
      [SECONDARY_LOCALE]: `Order pickup date is required.`,
    },
  },
];
