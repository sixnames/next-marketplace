import { MessageBaseInterface } from 'db/dbModels';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';

export const manufacturersMessages: MessageBaseInterface[] = [
  {
    slug: 'manufacturers.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Производитель с указанным именем уже существует.`,
      [SECONDARY_LOCALE]: `Manufacturer with same name is already exists.`,
    },
  },
  {
    slug: 'manufacturers.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания производителя.`,
      [SECONDARY_LOCALE]: `Manufacturer creation error.`,
    },
  },
  {
    slug: 'manufacturers.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Производитель создан.`,
      [SECONDARY_LOCALE]: `Manufacturer created.`,
    },
  },
  {
    slug: 'manufacturers.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Производитель с указанным именем уже существует.`,
      [SECONDARY_LOCALE]: `Manufacturer with same name is already exists.`,
    },
  },
  {
    slug: 'manufacturers.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Производитель не найден.`,
      [SECONDARY_LOCALE]: `Brand not found.`,
    },
  },
  {
    slug: 'manufacturers.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления производителя.`,
      [SECONDARY_LOCALE]: `Manufacturer update error.`,
    },
  },
  {
    slug: 'manufacturers.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Производитель обновлён.`,
      [SECONDARY_LOCALE]: `Brand updated.`,
    },
  },
  {
    slug: 'manufacturers.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Производитель не найден.`,
      [SECONDARY_LOCALE]: `Manufacturer not found.`,
    },
  },
  {
    slug: 'manufacturers.delete.used',
    messageI18n: {
      [DEFAULT_LOCALE]: `Производитель используется в товарах.`,
      [SECONDARY_LOCALE]: `Manufacturer is used in products.`,
    },
  },
  {
    slug: 'manufacturers.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления производителя.`,
      [SECONDARY_LOCALE]: `Manufacturer delete error.`,
    },
  },
  {
    slug: 'manufacturers.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Производитель удалён.`,
      [SECONDARY_LOCALE]: `Manufacturer removed.`,
    },
  },
  {
    slug: 'validation.manufacturers.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID производителя обязательно.`,
      [SECONDARY_LOCALE]: `Manufacturer ID is required.`,
    },
  },
  {
    slug: 'validation.manufacturers.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название производителя обязательно.`,
      [SECONDARY_LOCALE]: `Manufacturer name is required.`,
    },
  },
  {
    slug: 'validation.manufacturers.url',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ссылка на сайт производителя обязательна.`,
      [SECONDARY_LOCALE]: `Manufacturer url is required.`,
    },
  },
  {
    slug: 'validation.manufacturers.description',
    messageI18n: {
      [DEFAULT_LOCALE]: `Описание производителя обязательно.`,
      [SECONDARY_LOCALE]: `Manufacturer description is required.`,
    },
  },
];
