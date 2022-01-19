import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../config/common';
import { MessageBaseInterface } from '../../db/uiInterfaces';

export const promoMessages: MessageBaseInterface[] = [
  // promo
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

  // promo validation
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

  // promo code
  {
    slug: 'promoCode.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания промо-кода.`,
      [SECONDARY_LOCALE]: `Promo-code creation error.`,
    },
  },
  {
    slug: 'promoCode.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Промо-код создан.`,
      [SECONDARY_LOCALE]: `Promo-code created.`,
    },
  },
  {
    slug: 'promoCode.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления промо-кода.`,
      [SECONDARY_LOCALE]: `Promo-code update error.`,
    },
  },
  {
    slug: 'promoCode.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Промо-код обновлён.`,
      [SECONDARY_LOCALE]: `Promo-code updated.`,
    },
  },
  {
    slug: 'promoCode.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления промо-кода.`,
      [SECONDARY_LOCALE]: `Promo-code delete error.`,
    },
  },
  {
    slug: 'promoCode.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Промо-код удалён.`,
      [SECONDARY_LOCALE]: `Promo-code removed.`,
    },
  },
  {
    slug: 'promoCode.check.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка проверки промо-кода.`,
      [SECONDARY_LOCALE]: `Promo-code check error.`,
    },
  },
  {
    slug: 'promoCode.check.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Промо-код не найден.`,
      [SECONDARY_LOCALE]: `Promo-code not found.`,
    },
  },
  {
    slug: 'promoCode.check.noProducts',
    messageI18n: {
      [DEFAULT_LOCALE]: `По данному промо-коду не найдено ни одного товара.`,
      [SECONDARY_LOCALE]: `Promo-code products not found.`,
    },
  },
  {
    slug: 'promoCode.check.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Промо-код применён.`,
      [SECONDARY_LOCALE]: `Promo-code added.`,
    },
  },

  // promo code validation
  {
    slug: 'validation.promoCode.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID промо-кода обязательно к заполнению`,
      [SECONDARY_LOCALE]: `ID is required`,
    },
  },
  {
    slug: 'validation.promoCode.code',
    messageI18n: {
      [DEFAULT_LOCALE]: `Код промо-кода обязательно к заполнению`,
      [SECONDARY_LOCALE]: `Code is required`,
    },
  },
];
