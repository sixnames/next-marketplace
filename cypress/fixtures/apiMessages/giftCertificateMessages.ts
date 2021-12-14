import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const giftCertificateMessages: MessageBaseInterface[] = [
  {
    slug: 'giftCertificate.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка добавления подарочного сертификата.`,
      [SECONDARY_LOCALE]: `Promo product creation error.`,
    },
  },
  {
    slug: 'giftCertificate.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Подарочный сертификат добавлен.`,
      [SECONDARY_LOCALE]: `Promo product added.`,
    },
  },
  {
    slug: 'giftCertificate.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления подарочного сертификата.`,
      [SECONDARY_LOCALE]: `Promo update error.`,
    },
  },
  {
    slug: 'giftCertificate.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Подарочный сертификат обновлён.`,
      [SECONDARY_LOCALE]: `Promo updated.`,
    },
  },
  {
    slug: 'giftCertificate.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления подарочного сертификата.`,
      [SECONDARY_LOCALE]: `Promo product delete error.`,
    },
  },
  {
    slug: 'giftCertificate.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Подарочный сертификат удалён.`,
      [SECONDARY_LOCALE]: `Promo product removed.`,
    },
  },
];
