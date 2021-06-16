import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const pagesMessages: MessageBaseInterface[] = [
  {
    slug: 'pages.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страница с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Page with same name is already exists.`,
    },
  },
  {
    slug: 'pages.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания страницы.`,
      [SECONDARY_LOCALE]: `Page creation error.`,
    },
  },
  {
    slug: 'pages.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страница создана.`,
      [SECONDARY_LOCALE]: `Page created.`,
    },
  },
  {
    slug: 'pages.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страница с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Page with same name is already exists.`,
    },
  },
  {
    slug: 'pages.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления страницы.`,
      [SECONDARY_LOCALE]: `Page update error.`,
    },
  },
  {
    slug: 'pages.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страница обновлёна.`,
      [SECONDARY_LOCALE]: `Page updated.`,
    },
  },
  {
    slug: 'pages.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления страницы.`,
      [SECONDARY_LOCALE]: `Page delete error.`,
    },
  },
  {
    slug: 'pages.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страница удалёна.`,
      [SECONDARY_LOCALE]: `Page removed.`,
    },
  },
  {
    slug: 'validation.pages.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID страницы обязательно к заполнению`,
      [SECONDARY_LOCALE]: `ID is required`,
    },
  },
  {
    slug: 'validation.pages.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название страницы обязательно к заполнению`,
      [SECONDARY_LOCALE]: `Name is required`,
    },
  },
  {
    slug: 'validation.pages.index',
    messageI18n: {
      [DEFAULT_LOCALE]: `Порадковый номер страницы обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Index is required`,
    },
  },
  {
    slug: 'validation.pages.citySlug',
    messageI18n: {
      [DEFAULT_LOCALE]: `Slug города обязателен к заполнению`,
      [SECONDARY_LOCALE]: `City slug is required`,
    },
  },
];
