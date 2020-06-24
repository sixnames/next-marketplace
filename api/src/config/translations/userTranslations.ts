const metricTranslations = {
  user: {
    create: {
      duplicate: {
        ru: 'Пользователь с данным Email уже существует.',
        en: 'User with the same email already exists',
      },
      error: {
        ru: 'Ошибка создания пользователя.',
        en: 'User creation error.',
      },
      success: {
        ru: 'Пользователь создан.',
        en: 'User created.',
      },
    },
    update: {
      duplicate: {
        ru: 'Пользователь с данным Email уже существует.',
        en: 'User with the same email already exists',
      },
      error: {
        ru: 'Ошибка обновления пользователя.',
        en: 'User update error.',
      },
      success: {
        ru: 'Пользователь обновлён.',
        en: 'User updated.',
      },
    },
    delete: {
      error: {
        ru: 'Ошибка удаления пользователя.',
        en: 'User delete error.',
      },
      success: {
        ru: 'Пользователь удалён.',
        en: 'User deleted.',
      },
    },
    signIn: {
      authorized: {
        ru: 'Вы уже авторизованы.',
        en: 'Already authorized.',
      },
      emailError: {
        ru: 'Пользователь с указанным email не найден.',
        en: 'User not found.',
      },
      passwordError: {
        ru: 'Введён неправильный пароль.',
        en: 'Wrong password.',
      },
      success: {
        ru: `Здравствуйте! Рады Вас снова видеть.`,
        en: 'Hello! Glad to see you again.',
      },
    },
    signOut: {
      error: {
        ru: 'Вы не авторизованы.',
        en: 'Not authorized.',
      },
      success: {
        ru: 'Вы вышли из аккаунта.',
        en: 'Signed out.',
      },
    },
  },
};

export default metricTranslations;
