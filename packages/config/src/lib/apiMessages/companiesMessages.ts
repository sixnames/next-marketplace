import { MessageInterface } from './messagesKeys';
import { DEFAULT_LANG, SECONDARY_LANG } from '../common';

export const companiesMessages: MessageInterface[] = [
  {
    key: 'companies.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Компания с таким названием уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Company already exist.',
      },
    ],
  },
  {
    key: 'companies.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания компании.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Company creation error.',
      },
    ],
  },
  {
    key: 'companies.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Компания создана.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Company created.',
      },
    ],
  },
  {
    key: 'companies.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Компания с таким названием уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Company already exist.',
      },
    ],
  },
  {
    key: 'companies.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления компании.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Company update error.',
      },
    ],
  },
  {
    key: 'companies.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Компания обновлена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Company updated.',
      },
    ],
  },
  {
    key: 'companies.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления компании.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Company delete error.',
      },
    ],
  },
  {
    key: 'companies.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Компания удалена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Company removed.',
      },
    ],
  },
  {
    key: 'validation.companies.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID компании обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Company ID is required.',
      },
    ],
  },
  {
    key: 'validation.companies.nameString',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Название обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Company name is required.',
      },
    ],
  },
  {
    key: 'validation.companies.owner',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Владелец компании обязателен к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Company owner is required.',
      },
    ],
  },
  {
    key: 'validation.companies.staff',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Сотрудники компании обязательны к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Company staff is required.',
      },
    ],
  },
  {
    key: 'validation.companies.logo',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Логотип компании обязателен к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Company logo is required.',
      },
    ],
  },
];
