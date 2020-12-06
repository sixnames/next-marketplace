import { MessageInterface } from './messagesKeys';
import { DEFAULT_LANG, SECONDARY_LANG } from '../common';

export const ordersMessages: MessageInterface[] = [
  {
    key: 'orders.makeAnOrder.guestRoleNotFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Исходная роль нового пользователя не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'New user default role not found.',
      },
    ],
  },
  {
    key: 'orders.makeAnOrder.userCreationError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания нового пользователя.',
      },
      {
        key: SECONDARY_LANG,
        value: 'New user creation error.',
      },
    ],
  },
  {
    key: 'orders.makeAnOrder.productsNotFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Не все товары корзины найдены в магазинах.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Not all products shops are found.',
      },
    ],
  },
  {
    key: 'orders.makeAnOrder.initialStatusNotFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Исходный статус заказа не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Order default status not found.',
      },
    ],
  },
  {
    key: 'orders.makeAnOrder.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания заказа.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Order creation error.',
      },
    ],
  },
  {
    key: 'orders.makeAnOrder.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Заказ создан.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Order created.',
      },
    ],
  },
];
