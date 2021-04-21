import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';
import { MessageBaseInterface } from 'db/uiInterfaces';

export const citiesMessages: MessageBaseInterface[] = [
  {
    slug: 'cities.create.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страна не найдена.`,
      [SECONDARY_LOCALE]: `Country not found.`,
    },
  },
  {
    slug: 'cities.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Город с таким названием уже существует в данной стране.`,
      [SECONDARY_LOCALE]: `City with same name is already exists in this country.`,
    },
  },
  {
    slug: 'cities.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания города.`,
      [SECONDARY_LOCALE]: `City creation error.`,
    },
  },
  {
    slug: 'cities.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Город создан.`,
      [SECONDARY_LOCALE]: `City created.`,
    },
  },
  {
    slug: 'cities.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страна или город не найдены.`,
      [SECONDARY_LOCALE]: `Country or city not found.`,
    },
  },
  {
    slug: 'cities.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Город с таким названием уже существует в данной стране.`,
      [SECONDARY_LOCALE]: `City with same name is already exists in this country.`,
    },
  },
  {
    slug: 'cities.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления города.`,
      [SECONDARY_LOCALE]: `City update error.`,
    },
  },
  {
    slug: 'cities.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Город обновлён.`,
      [SECONDARY_LOCALE]: `City updated.`,
    },
  },
  {
    slug: 'cities.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страна или город не найдены.`,
      [SECONDARY_LOCALE]: `Country or city not found.`,
    },
  },
  {
    slug: 'cities.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления города.`,
      [SECONDARY_LOCALE]: `City delete error.`,
    },
  },
  {
    slug: 'cities.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Город удалён.`,
      [SECONDARY_LOCALE]: `City removed.`,
    },
  },
  {
    slug: 'validation.cities.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID города обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `City ID is required.`,
    },
  },
  {
    slug: 'validation.cities.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название города обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `City Name is required.`,
    },
  },
  {
    slug: 'validation.cities.slug',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ключ города обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `City Key is required.`,
    },
  },
];
