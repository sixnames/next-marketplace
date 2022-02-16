import { MessageBaseInterface } from '../../db/uiInterfaces';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../lib/config/common';

export const taskMessages: MessageBaseInterface[] = [
  // task
  // create
  {
    slug: 'tasks.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания задачи`,
      [SECONDARY_LOCALE]: `Task create error`,
    },
  },
  {
    slug: 'tasks.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Задача создан`,
      [SECONDARY_LOCALE]: `Task created`,
    },
  },

  // update
  {
    slug: 'tasks.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления задачи`,
      [SECONDARY_LOCALE]: `Task update error`,
    },
  },
  {
    slug: 'tasks.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Задача обновлёна`,
      [SECONDARY_LOCALE]: `Task updated`,
    },
  },

  // delete
  {
    slug: 'tasks.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удвления задачи`,
      [SECONDARY_LOCALE]: `Task delete error`,
    },
  },
  {
    slug: 'tasks.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Задача удалёна`,
      [SECONDARY_LOCALE]: `Task removed`,
    },
  },

  // task variant
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
    slug: 'validation.tasks.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID задачи обязательно`,
      [SECONDARY_LOCALE]: `Task ID is required`,
    },
  },
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
