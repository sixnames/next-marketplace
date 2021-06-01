import { MessageBaseInterface } from '../../../db/uiInterfaces';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';

export const brandsMessages: MessageBaseInterface[] = [
  {
    slug: 'brands.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Бренд с указанным именем уже существует.`,
      [SECONDARY_LOCALE]: `Brand with same name is already exists.`,
    },
  },
  {
    slug: 'brands.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания бренда.`,
      [SECONDARY_LOCALE]: `Brand creation error.`,
    },
  },
  {
    slug: 'brands.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Бренд создан.`,
      [SECONDARY_LOCALE]: `Brand created.`,
    },
  },
  {
    slug: 'brands.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Бренд с указанным именем уже существует.`,
      [SECONDARY_LOCALE]: `Brand with same name is already exists.`,
    },
  },
  {
    slug: 'brands.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Бренд не найден.`,
      [SECONDARY_LOCALE]: `Brand not found.`,
    },
  },
  {
    slug: 'brands.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления бренда.`,
      [SECONDARY_LOCALE]: `Brand update error.`,
    },
  },
  {
    slug: 'brands.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Бренд обновлён.`,
      [SECONDARY_LOCALE]: `Brand updated.`,
    },
  },
  {
    slug: 'brands.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Бренд не найден.`,
      [SECONDARY_LOCALE]: `Brand not found.`,
    },
  },
  {
    slug: 'brands.delete.used',
    messageI18n: {
      [DEFAULT_LOCALE]: `Бренд используется в товарах.`,
      [SECONDARY_LOCALE]: `Brand is used in products.`,
    },
  },
  {
    slug: 'brands.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления бренда.`,
      [SECONDARY_LOCALE]: `Brand delete error.`,
    },
  },
  {
    slug: 'brands.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Бренд удалён.`,
      [SECONDARY_LOCALE]: `Brand removed.`,
    },
  },
  {
    slug: 'validation.brands.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID бренда обязательно.`,
      [SECONDARY_LOCALE]: `Brand ID is required.`,
    },
  },
  {
    slug: 'validation.brands.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название бренда обязательно.`,
      [SECONDARY_LOCALE]: `Brand name is required.`,
    },
  },
  {
    slug: 'validation.brands.url',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ссылка на сайт бренда обязательна.`,
      [SECONDARY_LOCALE]: `Brand url is required.`,
    },
  },
  {
    slug: 'validation.brands.description',
    messageI18n: {
      [DEFAULT_LOCALE]: `Описание бренда обязательно.`,
      [SECONDARY_LOCALE]: `Brand description is required.`,
    },
  },
];
