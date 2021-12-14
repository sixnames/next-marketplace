import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const giftCertificateMessages: MessageBaseInterface[] = [
  {
    slug: 'giftCertificate.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка добавления подарочного сертификата.`,
      [SECONDARY_LOCALE]: `Gift certificate creation error.`,
    },
  },
  {
    slug: 'giftCertificate.create.exist',
    messageI18n: {
      [DEFAULT_LOCALE]: `Подарочный сертификат с веддённым кодом уже существует.`,
      [SECONDARY_LOCALE]: `Gift certificate with given code already exit.`,
    },
  },
  {
    slug: 'giftCertificate.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Подарочный сертификат добавлен.`,
      [SECONDARY_LOCALE]: `Gift certificate added.`,
    },
  },
  {
    slug: 'giftCertificate.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления подарочного сертификата.`,
      [SECONDARY_LOCALE]: `Gift certificate update error.`,
    },
  },
  {
    slug: 'giftCertificate.update.exist',
    messageI18n: {
      [DEFAULT_LOCALE]: `Подарочный сертификат с веддённым кодом уже существует.`,
      [SECONDARY_LOCALE]: `Gift certificate with given code already exit.`,
    },
  },
  {
    slug: 'giftCertificate.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Подарочный сертификат обновлён.`,
      [SECONDARY_LOCALE]: `Gift certificate updated.`,
    },
  },
  {
    slug: 'giftCertificate.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления подарочного сертификата.`,
      [SECONDARY_LOCALE]: `Gift certificate delete error.`,
    },
  },
  {
    slug: 'giftCertificate.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Подарочный сертификат удалён.`,
      [SECONDARY_LOCALE]: `Gift certificate removed.`,
    },
  },
];
