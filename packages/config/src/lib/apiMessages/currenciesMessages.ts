import { MessageInterface } from './messagesKeys';
import { DEFAULT_LANG, SECONDARY_LANG } from '../common';

export const currenciesMessages: MessageInterface[] = [
  {
    key: 'currencies.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Валюта с таким именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Currency with same name is already exists.',
      },
    ],
  },
  {
    key: 'currencies.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания валюты.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Currency creation error.',
      },
    ],
  },
  {
    key: 'currencies.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Валюта создана.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Currency created.',
      },
    ],
  },
  {
    key: 'currencies.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Валюта с таким именем уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Currency with same name is already exists.',
      },
    ],
  },
  {
    key: 'currencies.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления валюты.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Currency update error.',
      },
    ],
  },
  {
    key: 'currencies.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Валюта обновлена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Currency updated.',
      },
    ],
  },
  {
    key: 'currencies.delete.used',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Валюта используется в странах, её нельзя удалить.',
      },
      {
        key: SECONDARY_LANG,
        value: `You can't delete currency is used in countries.`,
      },
    ],
  },
  {
    key: 'currencies.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления валюты.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Currency delete error.',
      },
    ],
  },
  {
    key: 'currencies.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Валюта удалена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Currency removed.',
      },
    ],
  },
  {
    key: 'validation.currencies.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID валюты обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Currency ID is required.',
      },
    ],
  },
  {
    key: 'validation.currencies.nameString',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Значение валюты обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Currency name is required.',
      },
    ],
  },
];
