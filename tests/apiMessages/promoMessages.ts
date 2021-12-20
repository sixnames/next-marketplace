import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../config/common';
import { MessageBaseInterface } from '../../db/uiInterfaces';

export const promoMessages: MessageBaseInterface[] = [
  {
    slug: 'promo.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания акции.`,
      [SECONDARY_LOCALE]: `Promo creation error.`,
    },
  },
  {
    slug: 'promo.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Акция создана.`,
      [SECONDARY_LOCALE]: `Promo created.`,
    },
  },
  {
    slug: 'promo.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления акции.`,
      [SECONDARY_LOCALE]: `Promo update error.`,
    },
  },
  {
    slug: 'promo.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Акция обновлёна.`,
      [SECONDARY_LOCALE]: `Promo updated.`,
    },
  },
  {
    slug: 'promo.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления акции.`,
      [SECONDARY_LOCALE]: `Promo delete error.`,
    },
  },
  {
    slug: 'promo.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Акция удалёна.`,
      [SECONDARY_LOCALE]: `Promo removed.`,
    },
  },

  // promo product
  {
    slug: 'promoProduct.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка добавлени товара акции.`,
      [SECONDARY_LOCALE]: `Promo product creation error.`,
    },
  },
  {
    slug: 'promoProduct.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар акции добавлен.`,
      [SECONDARY_LOCALE]: `Promo product added.`,
    },
  },
  {
    slug: 'promoProduct.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления товара акции.`,
      [SECONDARY_LOCALE]: `Promo product delete error.`,
    },
  },
  {
    slug: 'promoProduct.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Товар акции удалён.`,
      [SECONDARY_LOCALE]: `Promo product removed.`,
    },
  },

  // validation
  {
    slug: 'validation.promo.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID акции обязательно к заполнению`,
      [SECONDARY_LOCALE]: `ID is required`,
    },
  },
  {
    slug: 'validation.promo.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название акции обязательно к заполнению`,
      [SECONDARY_LOCALE]: `Name is required`,
    },
  },
  {
    slug: 'validation.promo.discountPercent',
    messageI18n: {
      [DEFAULT_LOCALE]: `Размер скидки акции обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Discount is required`,
    },
  },
  {
    slug: 'validation.promo.cashbackPercent',
    messageI18n: {
      [DEFAULT_LOCALE]: `Размер кэшбэка акции обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Cashback is required`,
    },
  },
  {
    slug: 'validation.promo.datesError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Даты акции обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Promo dates is required`,
    },
  },
];
