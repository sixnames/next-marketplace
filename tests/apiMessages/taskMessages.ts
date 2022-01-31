import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../config/common';
import { MessageBaseInterface } from '../../db/uiInterfaces';

export const taskMessages: MessageBaseInterface[] = [
  // create
  {
    slug: 'taskVariants.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания типа задачи`,
      [SECONDARY_LOCALE]: `Task variant create error`,
    },
  },
  {
    slug: 'taskVariants.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип задачи создан`,
      [SECONDARY_LOCALE]: `Task variant created`,
    },
  },

  // update
  {
    slug: 'taskVariants.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления типа задачи`,
      [SECONDARY_LOCALE]: `Task variant update error`,
    },
  },
  {
    slug: 'taskVariants.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип задачи обновлён`,
      [SECONDARY_LOCALE]: `Task variant updated`,
    },
  },

  // delete
  {
    slug: 'taskVariants.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удвления типа задачи`,
      [SECONDARY_LOCALE]: `Task variant delete error`,
    },
  },
  {
    slug: 'taskVariants.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Тип задачи удалён`,
      [SECONDARY_LOCALE]: `Task variant removed`,
    },
  },

  // validation
  {
    slug: 'validation.taskVariants.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID типа задачи обязательно`,
      [SECONDARY_LOCALE]: `Task variant ID is required`,
    },
  },
  {
    slug: 'validation.taskVariants.slug',
    messageI18n: {
      [DEFAULT_LOCALE]: `Slug типа задачи обязательно`,
      [SECONDARY_LOCALE]: `Task variant slug is required`,
    },
  },
  {
    slug: 'validation.taskVariants.priceSlug',
    messageI18n: {
      [DEFAULT_LOCALE]: `Slug цены типа задачи обязательно`,
      [SECONDARY_LOCALE]: `Task variant price slug is required`,
    },
  },
  {
    slug: 'validation.taskVariants.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название типа задачи обязательно`,
      [SECONDARY_LOCALE]: `Task variant name is required`,
    },
  },
];
