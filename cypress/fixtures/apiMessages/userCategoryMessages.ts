import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const userCategoryMessages: MessageBaseInterface[] = [
  {
    slug: 'userCategories.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Категория с указанным названием уже существует.`,
      [SECONDARY_LOCALE]: `Category with the same name already exists.`,
    },
  },
  {
    slug: 'userCategories.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания категории.`,
      [SECONDARY_LOCALE]: `Category create error.`,
    },
  },
  {
    slug: 'userCategories.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Категория создана.`,
      [SECONDARY_LOCALE]: `Category crated.`,
    },
  },
  {
    slug: 'userCategories.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Категория с указанным названием уже существует.`,
      [SECONDARY_LOCALE]: `Category with the same name already exists.`,
    },
  },
  {
    slug: 'userCategories.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления категории.`,
      [SECONDARY_LOCALE]: `Category update error.`,
    },
  },
  {
    slug: 'userCategories.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Категория обновлена.`,
      [SECONDARY_LOCALE]: `Category updated.`,
    },
  },
  {
    slug: 'userCategories.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления категории.`,
      [SECONDARY_LOCALE]: `Category delete error.`,
    },
  },
  {
    slug: 'userCategories.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Категория удалена.`,
      [SECONDARY_LOCALE]: `Category removed.`,
    },
  },
  {
    slug: 'validation.userCategories.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID категории обязательно к заполнению`,
      [SECONDARY_LOCALE]: `Category ID is required`,
    },
  },
  {
    slug: 'validation.userCategories.companyId',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID компании обязательно к заполнению`,
      [SECONDARY_LOCALE]: `Company ID is required`,
    },
  },
  {
    slug: 'validation.userCategories.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название категории обязательно к заполнению`,
      [SECONDARY_LOCALE]: `Category name is required`,
    },
  },
  {
    slug: 'validation.userCategories.entryMinCharge',
    messageI18n: {
      [DEFAULT_LOCALE]: `Порог вхождения в категорию обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Category entry minimal charge is required`,
    },
  },
];
