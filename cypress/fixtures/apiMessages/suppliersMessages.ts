import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const suppliersMessages: MessageBaseInterface[] = [
  {
    slug: 'suppliers.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Поставщик с указанным именем уже существует.`,
      [SECONDARY_LOCALE]: `Supplier with same name is already exists.`,
    },
  },
  {
    slug: 'suppliers.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания поставщика.`,
      [SECONDARY_LOCALE]: `Supplier creation error.`,
    },
  },
  {
    slug: 'suppliers.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Поставщик создан.`,
      [SECONDARY_LOCALE]: `Supplier created.`,
    },
  },
  {
    slug: 'suppliers.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Поставщик с указанным именем уже существует.`,
      [SECONDARY_LOCALE]: `Supplier with same name is already exists.`,
    },
  },
  {
    slug: 'suppliers.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Поставщик не найден.`,
      [SECONDARY_LOCALE]: `Brand not found.`,
    },
  },
  {
    slug: 'suppliers.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления поставщика.`,
      [SECONDARY_LOCALE]: `Supplier update error.`,
    },
  },
  {
    slug: 'suppliers.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Поставщик обновлён.`,
      [SECONDARY_LOCALE]: `Brand updated.`,
    },
  },
  {
    slug: 'suppliers.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Поставщик не найден.`,
      [SECONDARY_LOCALE]: `Supplier not found.`,
    },
  },
  {
    slug: 'suppliers.delete.used',
    messageI18n: {
      [DEFAULT_LOCALE]: `Поставщик используется в товарах.`,
      [SECONDARY_LOCALE]: `Supplier is used in products.`,
    },
  },
  {
    slug: 'suppliers.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления поставщика.`,
      [SECONDARY_LOCALE]: `Supplier delete error.`,
    },
  },
  {
    slug: 'suppliers.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Поставщик удалён.`,
      [SECONDARY_LOCALE]: `Supplier removed.`,
    },
  },
  {
    slug: 'validation.suppliers.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID поставщика обязательно.`,
      [SECONDARY_LOCALE]: `Supplier ID is required.`,
    },
  },
  {
    slug: 'validation.suppliers.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название поставщика обязательно.`,
      [SECONDARY_LOCALE]: `Supplier name is required.`,
    },
  },
  {
    slug: 'validation.suppliers.url',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ссылка на сайт поставщика обязательна.`,
      [SECONDARY_LOCALE]: `Supplier url is required.`,
    },
  },
  {
    slug: 'validation.suppliers.description',
    messageI18n: {
      [DEFAULT_LOCALE]: `Описание поставщика обязательно.`,
      [SECONDARY_LOCALE]: `Supplier description is required.`,
    },
  },
];
