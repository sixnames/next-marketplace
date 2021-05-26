import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const brandCollectionsMessages: MessageBaseInterface[] = [
  {
    slug: 'brandCollections.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Коллекция бренда с указанным именем уже существует.`,
      [SECONDARY_LOCALE]: `Brand collection with same name is already exists.`,
    },
  },
  {
    slug: 'brandCollections.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания коллекции бренда.`,
      [SECONDARY_LOCALE]: `Brand collection creation error.`,
    },
  },
  {
    slug: 'brandCollections.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Коллекция бренда создана.`,
      [SECONDARY_LOCALE]: `Brand collection created.`,
    },
  },
  {
    slug: 'brandCollections.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Коллекция бренда с указанным именем уже существует.`,
      [SECONDARY_LOCALE]: `Brand collection with same name is already exists.`,
    },
  },
  {
    slug: 'brandCollections.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Коллекция бренда не найдена.`,
      [SECONDARY_LOCALE]: `Brand collection not found.`,
    },
  },
  {
    slug: 'brandCollections.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления коллекции бренда.`,
      [SECONDARY_LOCALE]: `Brand collection update error.`,
    },
  },
  {
    slug: 'brandCollections.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Коллекция бренда обновлена.`,
      [SECONDARY_LOCALE]: `Brand collection updated.`,
    },
  },
  {
    slug: 'brandCollections.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Коллекция бренда не найдена.`,
      [SECONDARY_LOCALE]: `Brand collection not found.`,
    },
  },
  {
    slug: 'brandCollections.delete.used',
    messageI18n: {
      [DEFAULT_LOCALE]: `Коллекция бренда используется в товарах.`,
      [SECONDARY_LOCALE]: `Brand collection is used in products.`,
    },
  },
  {
    slug: 'brandCollections.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления коллекции бренда.`,
      [SECONDARY_LOCALE]: `Brand collection delete error.`,
    },
  },
  {
    slug: 'brandCollections.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Коллекция бренда удалена.`,
      [SECONDARY_LOCALE]: `Brand collection removed.`,
    },
  },
  {
    slug: 'validation.brandCollections.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID коллекции бренда обязательно.`,
      [SECONDARY_LOCALE]: `Brand collection ID is required.`,
    },
  },
  {
    slug: 'validation.brandCollections.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название коллекции бренда обязательно.`,
      [SECONDARY_LOCALE]: `Brand collection name is required.`,
    },
  },
  {
    slug: 'validation.brandCollections.description',
    messageI18n: {
      [DEFAULT_LOCALE]: `Описание коллекции бренда обязательно.`,
      [SECONDARY_LOCALE]: `Brand collection description is required.`,
    },
  },
];
