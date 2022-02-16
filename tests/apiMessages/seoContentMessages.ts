import { MessageBaseInterface } from '../../db/uiInterfaces';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../lib/config/common';

export const seoContentMessages: MessageBaseInterface[] = [
  {
    slug: 'seoContent.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления SEO контента`,
      [SECONDARY_LOCALE]: `SEO content update error`,
    },
  },
  {
    slug: 'seoContent.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `SEO контент обновлён`,
      [SECONDARY_LOCALE]: `SEO content update success`,
    },
  },
];
