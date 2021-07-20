import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const orderStatusesMessages: MessageBaseInterface[] = [
  {
    slug: 'orderStatuses.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Статус заказа с таким именем или порядковым номером уже существует.`,
      [SECONDARY_LOCALE]: `Order status with same name or index is already exists.`,
    },
  },
  {
    slug: 'orderStatuses.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания статуса заказа.`,
      [SECONDARY_LOCALE]: `Order status creation error.`,
    },
  },
  {
    slug: 'orderStatuses.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Статус заказа создан.`,
      [SECONDARY_LOCALE]: `Order status created.`,
    },
  },
  {
    slug: 'orderStatuses.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Статус заказа с таким именем или порядковым номером уже существует.`,
      [SECONDARY_LOCALE]: `Order status with same name or index is already exists.`,
    },
  },
  {
    slug: 'orderStatuses.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления статуса заказа.`,
      [SECONDARY_LOCALE]: `Order status update error.`,
    },
  },
  {
    slug: 'orderStatuses.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Статус заказа обновлён.`,
      [SECONDARY_LOCALE]: `Order status updated.`,
    },
  },
  {
    slug: 'orderStatuses.delete.used',
    messageI18n: {
      [DEFAULT_LOCALE]: `Статус заказа используется в заказах, его нельзя удалить.`,
      [SECONDARY_LOCALE]: `Order status is used in attributes. You can't delete it.`,
    },
  },
  {
    slug: 'orderStatuses.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления статуса заказа.`,
      [SECONDARY_LOCALE]: `Order status delete error.`,
    },
  },
  {
    slug: 'orderStatuses.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Статус заказа удалён.`,
      [SECONDARY_LOCALE]: `Order status deleted.`,
    },
  },

  // validation
  {
    slug: 'validation.orderStatuses.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID статуса заказа измерения обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Order status ID is required.`,
    },
  },
  {
    slug: 'validation.orderStatuses.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название статуса заказа обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Order status name is required.`,
    },
  },
  {
    slug: 'validation.orderStatuses.color',
    messageI18n: {
      [DEFAULT_LOCALE]: `Цвет статуса заказа обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Order status name is required.`,
    },
  },
  {
    slug: 'validation.orderStatuses.index',
    messageI18n: {
      [DEFAULT_LOCALE]: `Порядковый номер статуса заказа обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Order status name is required.`,
    },
  },
];
