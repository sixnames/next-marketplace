import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const navItemsMessages: MessageBaseInterface[] = [
  {
    slug: 'navItems.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страница с таким именем, порядковым номером или slug уже существует.`,
      [SECONDARY_LOCALE]: `Page with same name, index or slug is already exists.`,
    },
  },
  {
    slug: 'navItems.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания страницы.`,
      [SECONDARY_LOCALE]: `Page creation error.`,
    },
  },
  {
    slug: 'navItems.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страница создана.`,
      [SECONDARY_LOCALE]: `Page created.`,
    },
  },
  {
    slug: 'navItems.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страница с таким именем, порядковым номером или slug уже существует.`,
      [SECONDARY_LOCALE]: `Page with same name, index or slug is already exists.`,
    },
  },
  {
    slug: 'navItems.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления страницы.`,
      [SECONDARY_LOCALE]: `Language update error.`,
    },
  },
  {
    slug: 'navItems.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страница обновлёна.`,
      [SECONDARY_LOCALE]: `Language updated.`,
    },
  },
  {
    slug: 'navItems.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления страницы.`,
      [SECONDARY_LOCALE]: `Language delete error.`,
    },
  },
  {
    slug: 'navItems.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страница удалёна.`,
      [SECONDARY_LOCALE]: `Language removed.`,
    },
  },
  {
    slug: 'validation.navItems.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID страницы обязательно к заполнению`,
      [SECONDARY_LOCALE]: `ID is required`,
    },
  },
  {
    slug: 'validation.navItems.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название страницы обязательно к заполнению`,
      [SECONDARY_LOCALE]: `Name is required`,
    },
  },
  {
    slug: 'validation.navItems.slug',
    messageI18n: {
      [DEFAULT_LOCALE]: `Slug страницы обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Slug is required`,
    },
  },
  {
    slug: 'validation.navItems.path',
    messageI18n: {
      [DEFAULT_LOCALE]: `Путь страницы обязателен к заполнению`,
      [SECONDARY_LOCALE]: ` is required`,
    },
  },
  {
    slug: 'validation.navItems.navGroup',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа страницы обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Nav group is required`,
    },
  },
  {
    slug: 'validation.navItems.index',
    messageI18n: {
      [DEFAULT_LOCALE]: `Порадковый номер страницы обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Index is required`,
    },
  },
  {
    slug: 'validation.navItems.icon',
    messageI18n: {
      [DEFAULT_LOCALE]: `Иконка страницы обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Icon is required`,
    },
  },
];
