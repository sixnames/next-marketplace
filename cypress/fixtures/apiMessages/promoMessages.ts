import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

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
];
