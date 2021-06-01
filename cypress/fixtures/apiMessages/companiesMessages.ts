import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const companiesMessages: MessageBaseInterface[] = [
  {
    slug: 'companies.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Компания с таким названием уже существует.`,
      [SECONDARY_LOCALE]: `Company already exist.`,
    },
  },
  {
    slug: 'companies.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания компании.`,
      [SECONDARY_LOCALE]: `Company creation error.`,
    },
  },
  {
    slug: 'companies.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Компания создана.`,
      [SECONDARY_LOCALE]: `Company created.`,
    },
  },
  {
    slug: 'companies.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Компания не найдена.`,
      [SECONDARY_LOCALE]: `Company not found.`,
    },
  },
  {
    slug: 'companies.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Компания с таким названием уже существует.`,
      [SECONDARY_LOCALE]: `Company already exist.`,
    },
  },
  {
    slug: 'companies.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления компании.`,
      [SECONDARY_LOCALE]: `Company update error.`,
    },
  },
  {
    slug: 'companies.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Компания обновлена.`,
      [SECONDARY_LOCALE]: `Company updated.`,
    },
  },
  {
    slug: 'companies.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Компания не найдена.`,
      [SECONDARY_LOCALE]: `Company not found.`,
    },
  },
  {
    slug: 'companies.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления компании.`,
      [SECONDARY_LOCALE]: `Company delete error.`,
    },
  },
  {
    slug: 'companies.shopsDelete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления магазинов компании.`,
      [SECONDARY_LOCALE]: `Company shops delete error.`,
    },
  },
  {
    slug: 'companies.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Компания удалена.`,
      [SECONDARY_LOCALE]: `Company removed.`,
    },
  },
  {
    slug: 'validation.companies.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID компании обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Company ID is required.`,
    },
  },
  {
    slug: 'validation.companies.nameString',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Company name is required.`,
    },
  },
  {
    slug: 'validation.companies.owner',
    messageI18n: {
      [DEFAULT_LOCALE]: `Владелец компании обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Company owner is required.`,
    },
  },
  {
    slug: 'validation.companies.staff',
    messageI18n: {
      [DEFAULT_LOCALE]: `Сотрудники компании обязательны к заполнению.`,
      [SECONDARY_LOCALE]: `Company staff is required.`,
    },
  },
  {
    slug: 'validation.companies.logo',
    messageI18n: {
      [DEFAULT_LOCALE]: `Логотип компании обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Company logo is required.`,
    },
  },
];
