import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../config/common';
import { MessageBaseInterface } from '../../db/uiInterfaces';

export const usersMessages: MessageBaseInterface[] = [
  {
    slug: 'users.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пользователь с данным Email или телефоном уже существует.`,
      [SECONDARY_LOCALE]: `User with the same email or phone already exists.`,
    },
  },
  {
    slug: 'users.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания пользователя.`,
      [SECONDARY_LOCALE]: `User creation error.`,
    },
  },
  {
    slug: 'users.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пользователь создан.`,
      [SECONDARY_LOCALE]: `User created.`,
    },
  },
  {
    slug: 'users.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пользователь с данным Email или телефоном уже существует.`,
      [SECONDARY_LOCALE]: `User with the same email or phone already exists.`,
    },
  },
  {
    slug: 'users.update.passwordSuccess',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пароль обновлён.`,
      [SECONDARY_LOCALE]: `Password updated.`,
    },
  },
  {
    slug: 'users.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления пользователя.`,
      [SECONDARY_LOCALE]: `User update error.`,
    },
  },
  {
    slug: 'users.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пользователь обновлён.`,
      [SECONDARY_LOCALE]: `User updated.`,
    },
  },
  {
    slug: 'users.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления пользователя.`,
      [SECONDARY_LOCALE]: `User delete error.`,
    },
  },
  {
    slug: 'users.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пользователь удалён.`,
      [SECONDARY_LOCALE]: `User removed.`,
    },
  },
  {
    slug: 'users.signIn.authorized',
    messageI18n: {
      [DEFAULT_LOCALE]: `Вы уже авторизованы.`,
      [SECONDARY_LOCALE]: `Already authorized.`,
    },
  },
  {
    slug: 'users.signIn.emailError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пользователь с указанным email не найден.`,
      [SECONDARY_LOCALE]: `User not found.`,
    },
  },
  {
    slug: 'users.signIn.passwordError',
    messageI18n: {
      [DEFAULT_LOCALE]: `Введён неправильный пароль.`,
      [SECONDARY_LOCALE]: `Wrong password.`,
    },
  },
  {
    slug: 'users.signIn.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Здравствуйте! Рады Вас снова видеть.`,
      [SECONDARY_LOCALE]: `Hello! Glad to see you again.`,
    },
  },
  {
    slug: 'users.signOut.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Вы не авторизованы.`,
      [SECONDARY_LOCALE]: `Not authorized.`,
    },
  },
  {
    slug: 'users.signOut.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Вы вышли из аккаунта.`,
      [SECONDARY_LOCALE]: `Signed out.`,
    },
  },
  {
    slug: 'validation.users.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID пользователя обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `User ID is required.`,
    },
  },
  {
    slug: 'validation.users.name',
    messageI18n: {
      [DEFAULT_LOCALE]: `Имя пользователя обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `User name is required.`,
    },
  },
  {
    slug: 'validation.users.lastName',
    messageI18n: {
      [DEFAULT_LOCALE]: `Фамилия пользователя обязательна к заполнению.`,
      [SECONDARY_LOCALE]: `User Last name is required.`,
    },
  },
  {
    slug: 'validation.users.secondName',
    messageI18n: {
      [DEFAULT_LOCALE]: `Отчество пользователя обязательно к заполнению.`,
      [SECONDARY_LOCALE]: `User Second name is required.`,
    },
  },
  {
    slug: 'validation.users.role',
    messageI18n: {
      [DEFAULT_LOCALE]: `Роль пользователя обязательна к заполнению.`,
      [SECONDARY_LOCALE]: `User Role is required.`,
    },
  },
  {
    slug: 'validation.users.password',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пароль пользователя обязателен к заполнению.`,
      [SECONDARY_LOCALE]: `User Password is required.`,
    },
  },
  {
    slug: 'validation.users.passwordCompare',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пароль не совпадает.`,
      [SECONDARY_LOCALE]: `Password do not match.`,
    },
  },
];
