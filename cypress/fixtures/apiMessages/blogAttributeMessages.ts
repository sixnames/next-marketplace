import { MessageBaseInterface } from '../../../db/uiInterfaces';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';

export const blogAttributeMessages: MessageBaseInterface[] = [
  {
    slug: 'blogAttributes.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Атрибут с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Attribute with same name is already exists.`,
    },
  },
  {
    slug: 'blogAttributes.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания атрибута.`,
      [SECONDARY_LOCALE]: `Attribute creation error.`,
    },
  },
  {
    slug: 'blogAttributes.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Атрибут создан.`,
      [SECONDARY_LOCALE]: `Attribute created.`,
    },
  },
  {
    slug: 'blogAttributes.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Атрибут с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Attribute with same title is already exists.`,
    },
  },
  {
    slug: 'blogAttributes.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Атрибут не найден.`,
      [SECONDARY_LOCALE]: `Attribute not found.`,
    },
  },
  {
    slug: 'blogAttributes.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления атрибута.`,
      [SECONDARY_LOCALE]: `Attribute update error.`,
    },
  },
  {
    slug: 'blogAttributes.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Атрибут обновлён.`,
      [SECONDARY_LOCALE]: `Attribute updated.`,
    },
  },
  {
    slug: 'blogAttributes.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Атрибут не найден.`,
      [SECONDARY_LOCALE]: `Attribute not found.`,
    },
  },
  {
    slug: 'blogAttributes.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления атрибута.`,
      [SECONDARY_LOCALE]: `Attribute delete error.`,
    },
  },
  {
    slug: 'blogAttributes.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Атрибут удалён.`,
      [SECONDARY_LOCALE]: `Attribute removed.`,
    },
  },
  {
    slug: 'validation.blogAttributes.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID атрибута обязательно.`,
      [SECONDARY_LOCALE]: `Attribute ID is required.`,
    },
  },
  {
    slug: 'validation.blogAttributes.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название атрибута обязателено.`,
      [SECONDARY_LOCALE]: `Attribute title is required.`,
    },
  },
  {
    slug: 'validation.blogAttributes.optionsGroupId',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа опций обязательна.`,
      [SECONDARY_LOCALE]: `Options group is required.`,
    },
  },
];
