import { MessageType } from 'db/dbModels';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';

export const configsMessages: MessageType[] = [
  {
    slug: 'configs.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Настройки обновлены`,
      [SECONDARY_LOCALE]: `Config is updated`,
    },
  },
  {
    slug: 'configs.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления настройки`,
      [SECONDARY_LOCALE]: `Config update error`,
    },
  },
  {
    slug: 'configs.updateAsset.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Настройка не найдена`,
      [SECONDARY_LOCALE]: `Config item not found`,
    },
  },
  {
    slug: 'configs.updateAsset.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления настройки`,
      [SECONDARY_LOCALE]: `Config update error`,
    },
  },
  {
    slug: 'configs.updateAsset.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Настройка обновлена`,
      [SECONDARY_LOCALE]: `Config is updated`,
    },
  },
  {
    slug: 'validation.configs.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID настройки обязательно к заполнению`,
      [SECONDARY_LOCALE]: `Config ID is required`,
    },
  },
  {
    slug: 'validation.configs.value',
    messageI18n: {
      [DEFAULT_LOCALE]: `Значение настройки обязательно к заполнению`,
      [SECONDARY_LOCALE]: `Config value is required`,
    },
  },
  {
    slug: 'validation.configs.translation',
    messageI18n: {
      [DEFAULT_LOCALE]: `Значение мультиязычной настройки обязательно к заполнению`,
      [SECONDARY_LOCALE]: `Config multi lang value is required`,
    },
  },
  {
    slug: 'validation.configs.citySlug',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ключ города обязателен к заполнению`,
      [SECONDARY_LOCALE]: `City key is required`,
    },
  },
];
