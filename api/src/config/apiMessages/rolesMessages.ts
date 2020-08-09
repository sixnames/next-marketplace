import { MessageInterface } from './messagesKeys';
import { DEFAULT_LANG, SECONDARY_LANG } from '../common';

const rolesMessages: MessageInterface[] = [
  {
    key: 'roles.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Роль с данным названием уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role with the same name already exists.',
      },
    ],
  },
  {
    key: 'roles.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания роли.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role creation error.',
      },
    ],
  },
  {
    key: 'roles.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Роль создана.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role created.',
      },
    ],
  },
  {
    key: 'roles.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Роль с данным названием уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role with the same name already exists.',
      },
    ],
  },
  {
    key: 'roles.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления роли.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role update error.',
      },
    ],
  },
  {
    key: 'roles.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Роль обновлена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role updated.',
      },
    ],
  },
  {
    key: 'roles.delete.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Роль не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role not found.',
      },
    ],
  },
  {
    key: 'roles.delete.rulesNotFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Правила роли не найдены.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role rules not found.',
      },
    ],
  },
  {
    key: 'roles.delete.rulesError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления правил роли.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role rules delete error.',
      },
    ],
  },
  {
    key: 'roles.delete.guestRoleNotFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Гостевая роль не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Guest role not found.',
      },
    ],
  },
  {
    key: 'roles.delete.usersUpdateError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления пользователей с удаляемой ролью.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Error updating users with the role to be removed.',
      },
    ],
  },
  {
    key: 'roles.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления роли.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role delete error.',
      },
    ],
  },
  {
    key: 'roles.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Роль удалена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role removed.',
      },
    ],
  },
  {
    key: 'roles.permissions.notFound',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Роль не найдена.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role not found.',
      },
    ],
  },
  {
    key: 'roles.permissions.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления прав доступа роли.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role permissions update error.',
      },
    ],
  },
  {
    key: 'roles.permissions.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Права доступа обновлены.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role permissions updated.',
      },
    ],
  },
  {
    key: 'validation.roles.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID роли обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role ID is required.',
      },
    ],
  },
  {
    key: 'validation.roles.name',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Название роли обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role name is required.',
      },
    ],
  },
  {
    key: 'validation.roles.description',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Описание роли обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role description is required.',
      },
    ],
  },
  {
    key: 'validation.roles.ruleId',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID правила роли обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role rule ID is required.',
      },
    ],
  },
  {
    key: 'validation.roles.navItemId',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID навигации обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Nav item ID is required.',
      },
    ],
  },
  {
    key: 'validation.roles.operationId',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID операции обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Role rule operation ID is required.',
      },
    ],
  },
];

export default rolesMessages;
