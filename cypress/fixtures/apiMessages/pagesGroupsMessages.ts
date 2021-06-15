import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../config/common';
import { MessageBaseInterface } from '../../../db/uiInterfaces';

export const pageGroupsMessages: MessageBaseInterface[] = [
  {
    slug: 'pageGroups.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа страниц с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Pages group with same name already exists.`,
    },
  },
  {
    slug: 'pageGroups.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания группы страниц.`,
      [SECONDARY_LOCALE]: `Pages group creation error.`,
    },
  },
  {
    slug: 'pageGroups.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Страница создана.`,
      [SECONDARY_LOCALE]: `Pages group created.`,
    },
  },
  {
    slug: 'pageGroups.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа страниц с таким именем уже существует.`,
      [SECONDARY_LOCALE]: `Pages group with same name already exists.`,
    },
  },
  {
    slug: 'pageGroups.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления группы страниц.`,
      [SECONDARY_LOCALE]: `Pages group update error.`,
    },
  },
  {
    slug: 'pageGroups.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа страниц обновлёна.`,
      [SECONDARY_LOCALE]: `Pages group updated.`,
    },
  },
  {
    slug: 'pageGroups.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления группы страниц.`,
      [SECONDARY_LOCALE]: `Pages group delete error.`,
    },
  },
  {
    slug: 'pageGroups.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Группа страниц удалёна.`,
      [SECONDARY_LOCALE]: `Pages group removed.`,
    },
  },
  {
    slug: 'validation.pageGroups.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID страницы обязательно к заполнению`,
      [SECONDARY_LOCALE]: `ID is required`,
    },
  },
  {
    slug: 'validation.pageGroups.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название страницы обязательно к заполнению`,
      [SECONDARY_LOCALE]: `Name is required`,
    },
  },
  {
    slug: 'validation.pageGroups.index',
    messageI18n: {
      [DEFAULT_LOCALE]: `Порадковый номер страницы обязателен к заполнению`,
      [SECONDARY_LOCALE]: `Index is required`,
    },
  },
];
