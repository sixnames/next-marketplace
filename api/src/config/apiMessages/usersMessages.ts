import { DEFAULT_LANG, SECONDARY_LANG } from '../common';
import { MessageInterface } from './messagesKeys';

const usersMessages: MessageInterface[] = [
  {
    key: 'users.create.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Пользователь с данным Email уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User with the same email already exists.',
      },
    ],
  },
  {
    key: 'users.create.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка создания пользователя.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User creation error.',
      },
    ],
  },
  {
    key: 'users.create.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Пользователь создан.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User created.',
      },
    ],
  },
  {
    key: 'users.update.duplicate',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Пользователь с данным Email уже существует.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User with the same email already exists.',
      },
    ],
  },
  {
    key: 'users.update.passwordSuccess',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Пароль обновлён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Password updated.',
      },
    ],
  },
  {
    key: 'users.update.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка обновления пользователя.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User update error.',
      },
    ],
  },
  {
    key: 'users.update.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Пользователь обновлён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User updated.',
      },
    ],
  },
  {
    key: 'users.delete.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Ошибка удаления пользователя.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User delete error.',
      },
    ],
  },
  {
    key: 'users.delete.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Пользователь удалён.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User removed.',
      },
    ],
  },
  {
    key: 'users.signIn.authorized',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Вы уже авторизованы.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Already authorized.',
      },
    ],
  },
  {
    key: 'users.signIn.emailError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Пользователь с указанным email не найден.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User not found.',
      },
    ],
  },
  {
    key: 'users.signIn.passwordError',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Введён неправильный пароль.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Wrong password.',
      },
    ],
  },
  {
    key: 'users.signIn.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Здравствуйте! Рады Вас снова видеть.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Hello! Glad to see you again.',
      },
    ],
  },
  {
    key: 'users.signOut.error',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Вы не авторизованы.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Not authorized.',
      },
    ],
  },
  {
    key: 'users.signOut.success',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Вы вышли из аккаунта.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Signed out.',
      },
    ],
  },
  {
    key: 'validation.users.id',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'ID пользователя обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User ID is required.',
      },
    ],
  },
  {
    key: 'validation.users.name',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Имя пользователя обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User name is required.',
      },
    ],
  },
  {
    key: 'validation.users.lastName',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Фамилия пользователя обязательна к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User Last name is required.',
      },
    ],
  },
  {
    key: 'validation.users.secondName',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Отчество пользователя обязательно к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User Second name is required.',
      },
    ],
  },
  {
    key: 'validation.users.role',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Роль пользователя обязательна к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User Role is required.',
      },
    ],
  },
  {
    key: 'validation.users.password',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Пароль пользователя обязателен к заполнению.',
      },
      {
        key: SECONDARY_LANG,
        value: 'User Password is required.',
      },
    ],
  },
  {
    key: 'validation.users.passwordCompare',
    message: [
      {
        key: DEFAULT_LANG,
        value: 'Пароль не совпадает.',
      },
      {
        key: SECONDARY_LANG,
        value: 'Password do not match.',
      },
    ],
  },
];

export default usersMessages;
