import { DEFAULT_LANG, SECONDARY_LANG } from '../common';
import { MessageInterface } from './messagesKeys';

const languagesMessages: MessageInterface[] = [
  {
    key: 'languages.setLanguageAsDefault.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка назначения языка основным.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Error assigning the primary language.\n',
      },
    ],
  },
  {
    key: 'languages.setLanguageAsDefault.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Язык назначен основным.',
      },
      {
        key: SECONDARY_LANG,
        value: 'The language is set as the main one.',
      },
    ],
  },
  {
    key: 'languages.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Язык с таким именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Language with same name is already exists.',
      },
    ],
  },
  {
    key: 'languages.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания языка.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Language creation error.',
      },
    ],
  },
  {
    key: 'languages.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Язык создан.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Language created.',
      },
    ],
  },
  {
    key: 'languages.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Язык с таким именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Language with same name is already exists.',
      },
    ],
  },
  {
    key: 'languages.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления языка.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Language update error.',
      },
    ],
  },
  {
    key: 'languages.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Язык обновлён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Language updated.',
      },
    ],
  },
  {
    key: 'languages.delete.default',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Язык является основным, его нелья удалить.',
      },
      {
        key: SECONDARY_LANG,
        value: `You can't delete default language.`,
      },
    ],
  },
  {
    key: 'languages.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления языка.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Language delete error.',
      },
    ],
  },
  {
    key: 'languages.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Язык удалён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Language removed.',
      },
    ],
  },
  {
    key: 'validation.languages.name',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Название языка обязательно к заполнению',
      },
      {
        key: SECONDARY_LANG,
        value: 'Language name is required',
      },
    ],
  },
  {
    key: 'validation.languages.key',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ключ языка обязателен к заполнению',
      },
      {
        key: SECONDARY_LANG,
        value: 'Language key is required',
      },
    ],
  },
  {
    key: 'validation.languages.nativeName',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Нативное название языка обязателено к заполнению',
      },
      {
        key: SECONDARY_LANG,
        value: 'Language native name is required',
      },
    ],
  },
];

export default languagesMessages;
