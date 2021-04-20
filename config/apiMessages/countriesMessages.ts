import { MessageBaseInterface } from 'db/dbModels';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';

export const countriesMessages: MessageBaseInterface[] = [
  {
    slug: 'countries.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страна с таким названием уже существует.`,
      [SECONDARY_LOCALE]: `Country with same name is already exists.`,
    },
  },
  {
    slug: 'countries.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания страны.`,
      [SECONDARY_LOCALE]: `Country creation error.`,
    },
  },
  {
    slug: 'countries.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страна создана.`,
      [SECONDARY_LOCALE]: `Country created.`,
    },
  },
  {
    slug: 'countries.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страна не найдена.`,
      [SECONDARY_LOCALE]: `Country not found.`,
    },
  },
  {
    slug: 'countries.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страна с таким названием уже существует.`,
      [SECONDARY_LOCALE]: `Country with same name is already exists.`,
    },
  },
  {
    slug: 'countries.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления страны.`,
      [SECONDARY_LOCALE]: `Country update error.`,
    },
  },
  {
    slug: 'countries.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страна обновлена.`,
      [SECONDARY_LOCALE]: `Country updated.`,
    },
  },
  {
    slug: 'countries.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страна не найдена.`,
      [SECONDARY_LOCALE]: `Country not found.`,
    },
  },
  {
    slug: 'countries.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления страны.`,
      [SECONDARY_LOCALE]: `Country delete error.`,
    },
  },
  {
    slug: 'countries.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страна удалена.`,
      [SECONDARY_LOCALE]: `Country removed.`,
    },
  },
  {
    slug: 'validation.countries.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID страны обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Country ID is required.`,
    },
  },
  {
    slug: 'validation.countries.nameString',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название страны обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Country Name is required.`,
    },
  },
  {
    slug: 'validation.countries.currency',
    messageI18n: {
      [DEFAULT_LOCALE]: `Валюта страны обязательна к заполнению.`,
      [SECONDARY_LOCALE]: `Country Currency is required.`,
    },
  },
];
