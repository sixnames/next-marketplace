import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';
import { MessageBaseInterface } from 'db/uiInterfaces';

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

  // role validation
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
    slug: 'validation.roles.navItemId',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID навигации обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Nav item ID is required.`,
    },
  },

  // role rule
  {
    slug: 'roleRules.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Правило роли с данным названием или slug уже существует`,
      [SECONDARY_LOCALE]: `Role rule with the same name or slug already exist`,
    },
  },
  {
    slug: 'roleRules.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания правила роли`,
      [SECONDARY_LOCALE]: `Role rule create error`,
    },
  },
  {
    slug: 'roleRules.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Правило роли создано`,
      [SECONDARY_LOCALE]: `Role rule created`,
    },
  },
  {
    slug: 'roleRules.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Правило роли с данным названием или slug уже существует`,
      [SECONDARY_LOCALE]: `Role rule with the same name or slug already exist`,
    },
  },
  {
    slug: 'roleRules.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления правила роли`,
      [SECONDARY_LOCALE]: `Role rule update error`,
    },
  },
  {
    slug: 'roleRules.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Правило роли обновлено`,
      [SECONDARY_LOCALE]: `Role rule updated`,
    },
  },
  {
    slug: 'roleRules.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Правило роли не нейдено`,
      [SECONDARY_LOCALE]: `Role rule not found`,
    },
  },
  {
    slug: 'roleRules.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления правила роли`,
      [SECONDARY_LOCALE]: `Role rule delete error`,
    },
  },
  {
    slug: 'roleRules.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Правило роли удалено`,
      [SECONDARY_LOCALE]: `Role rule removed`,
    },
  },

  // role rule validation
  {
    slug: 'validation.roleRules.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID правила роли обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Role rule ID is required.`,
    },
  },
  {
    slug: 'validation.roleRules.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Название роли обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Role rule name is required.`,
    },
  },
  {
    slug: 'validation.roleRules.roleId',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID роли обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `Role ID is required.`,
    },
  },
  {
    slug: 'validation.rolesRule.slug',
    messageI18n: {
      [DEFAULT_LOCALE]: `Slug правила роли обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `Role rule slug is required.`,
    },
  },
];
