import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const languagesMessages: MessageBaseInterface[] = [
  {
    slug: 'languages.setLanguageAsDefault.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка назначения языка основным.`,
      [SECONDARY_LOCALE]: `Error assigning the primary language.\n`,
    },
  },
  {
    slug: 'languages.setLanguageAsDefault.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Язык назначен основным.`,
      [SECONDARY_LOCALE]: `The language is set as the main one.`,
    },
  },
  {
    slug: 'languages.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Язык с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Language with same name is already exists.`,
    },
  },
  {
    slug: 'languages.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания языка.`,
      [SECONDARY_LOCALE]: `Language creation error.`,
    },
  },
  {
    slug: 'languages.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Язык создан.`,
      [SECONDARY_LOCALE]: `Language created.`,
    },
  },
  {
    slug: 'languages.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Язык с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Language with same name is already exists.`,
    },
  },
  {
    slug: 'languages.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления языка.`,
      [SECONDARY_LOCALE]: `Language update error.`,
    },
  },
  {
    slug: 'languages.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Язык обновлён.`,
      [SECONDARY_LOCALE]: `Language updated.`,
    },
  },
  {
    slug: 'languages.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления языка.`,
      [SECONDARY_LOCALE]: `Language delete error.`,
    },
  },
  {
    slug: 'languages.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Язык удалён.`,
      [SECONDARY_LOCALE]: `Language removed.`,
    },
  },
  {
    slug: 'validation.languages.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID обязательно к заполнению`,
      [SECONDARY_LOCALE]: `Language ID is required`,
    },
  },
  {
    slug: 'validation.languages.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название языка обязательно к заполнению`,
      [SECONDARY_LOCALE]: `Language name is required`,
    },
  },
  {
    slug: 'validation.languages.slug',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ключ языка обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Language key is required`,
    },
  },
  {
    slug: 'validation.languages.nativeName',
    messageI18n: {
      [DEFAULT_LOCALE]: `Нативное название языка обязательно к заполнению`,
      [SECONDARY_LOCALE]: `Language native name is required`,
    },
  },
];
