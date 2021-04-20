import { MessageBaseInterface } from 'db/dbModels';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';

export const currenciesMessages: MessageBaseInterface[] = [
  {
    slug: 'currencies.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Валюта с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Currency with same name is already exists.`,
    },
  },
  {
    slug: 'currencies.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания валюты.`,
      [SECONDARY_LOCALE]: `Currency creation error.`,
    },
  },
  {
    slug: 'currencies.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Валюта создана.`,
      [SECONDARY_LOCALE]: `Currency created.`,
    },
  },
  {
    slug: 'currencies.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Валюта с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Currency with same name is already exists.`,
    },
  },
  {
    slug: 'currencies.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления валюты.`,
      [SECONDARY_LOCALE]: `Currency update error.`,
    },
  },
  {
    slug: 'currencies.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Валюта обновлена.`,
      [SECONDARY_LOCALE]: `Currency updated.`,
    },
  },
  {
    slug: 'currencies.delete.used',
    messageI18n: {
      [DEFAULT_LOCALE]: `Валюта используется в странах, её нельзя удалить.`,
      [SECONDARY_LOCALE]: `You can't delete currency is used in countries.`,
    },
  },
  {
    slug: 'currencies.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления валюты.`,
      [SECONDARY_LOCALE]: `Currency delete error.`,
    },
  },
  {
    slug: 'currencies.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Валюта удалена.`,
      [SECONDARY_LOCALE]: `Currency removed.`,
    },
  },
  {
    slug: 'validation.currencies.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID валюты обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Currency ID is required.`,
    },
  },
  {
    slug: 'validation.currencies.nameString',
    messageI18n: {
      [DEFAULT_LOCALE]: `Значение валюты обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Currency name is required.`,
    },
  },
];
