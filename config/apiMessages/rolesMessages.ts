import { MessageBaseInterface } from 'db/dbModels';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';

export const rolesMessages: MessageBaseInterface[] = [
  {
    slug: 'roles.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Роль с данным названием уже существует.`,
      [SECONDARY_LOCALE]: `Role with the same name already exists.`,
    },
  },
  {
    slug: 'roles.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания роли.`,
      [SECONDARY_LOCALE]: `Role creation error.`,
    },
  },
  {
    slug: 'roles.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Роль создана.`,
      [SECONDARY_LOCALE]: `Role created.`,
    },
  },
  {
    slug: 'roles.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Роль с данным названием уже существует.`,
      [SECONDARY_LOCALE]: `Role with the same name already exists.`,
    },
  },
  {
    slug: 'roles.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления роли.`,
      [SECONDARY_LOCALE]: `Role update error.`,
    },
  },
  {
    slug: 'roles.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Роль обновлена.`,
      [SECONDARY_LOCALE]: `Role updated.`,
    },
  },
  {
    slug: 'roles.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Роль не найдена.`,
      [SECONDARY_LOCALE]: `Role not found.`,
    },
  },
  {
    slug: 'roles.delete.rulesNotFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Правила роли не найдены.`,
      [SECONDARY_LOCALE]: `Role rules not found.`,
    },
  },
  {
    slug: 'roles.delete.rulesError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления правил роли.`,
      [SECONDARY_LOCALE]: `Role rules delete error.`,
    },
  },
  {
    slug: 'roles.delete.guestRoleNotFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Гостевая роль не найдена.`,
      [SECONDARY_LOCALE]: `Guest role not found.`,
    },
  },
  {
    slug: 'roles.delete.usersUpdateError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления пользователей с удаляемой ролью.`,
      [SECONDARY_LOCALE]: `Error updating users with the role to be removed.`,
    },
  },
  {
    slug: 'roles.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления роли.`,
      [SECONDARY_LOCALE]: `Role delete error.`,
    },
  },
  {
    slug: 'roles.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Роль удалена.`,
      [SECONDARY_LOCALE]: `Role removed.`,
    },
  },
  {
    slug: 'roles.permissions.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Роль не найдена.`,
      [SECONDARY_LOCALE]: `Role not found.`,
    },
  },
  {
    slug: 'roles.permissions.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления прав доступа роли.`,
      [SECONDARY_LOCALE]: `Role permissions update error.`,
    },
  },
  {
    slug: 'roles.permissions.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Права доступа обновлены.`,
      [SECONDARY_LOCALE]: `Role permissions updated.`,
    },
  },
  {
    slug: 'validation.roles.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID роли обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Role ID is required.`,
    },
  },
  {
    slug: 'validation.roles.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название роли обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Role name is required.`,
    },
  },
  {
    slug: 'validation.roles.description',
    messageI18n: {
      [DEFAULT_LOCALE]: `Описание роли обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Role description is required.`,
    },
  },
  {
    slug: 'validation.roles.ruleId',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID правила роли обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Role rule ID is required.`,
    },
  },
  {
    slug: 'validation.roles.navItemId',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID навигации обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Nav item ID is required.`,
    },
  },
  {
    slug: 'validation.roles.operationId',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID операции обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Role rule operation ID is required.`,
    },
  },
];
