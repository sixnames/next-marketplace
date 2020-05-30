import { AuthenticationError } from 'apollo-server-express';
import { ContextInterface } from '../types/context';
import { User, UserModel } from '../entities/User';
import { compare } from 'bcryptjs';
import { IN_TEST } from '../config';

type Request = ContextInterface['req'];

const signedIn = (req: Request) => {
  return req.session && req.session.userId;
};

export const attemptSignIn = async (email: User['email'], password: User['password']) => {
  const emailErrorMessage = 'Пользователь с указанным email не найден';
  const passwordErrorMessage = 'Введён неправильный пароль';

  const user = await UserModel.findOne({ email });

  if (!user) {
    return {
      user: null,
      message: emailErrorMessage,
    };
  }

  const matches = await compare(password, user.password);

  if (!matches) {
    return {
      user: null,
      message: passwordErrorMessage,
    };
  }

  return {
    user,
    message: `Здравствуйте ${user.name}! Рады Вас снова видеть.`,
  };
};

export const ensureSignedIn = (req: Request) => {
  if (!signedIn(req)) {
    throw new AuthenticationError('Вы не авторизованы.');
  }
};

export const ensureSignedOut = (req: Request) => {
  return !signedIn(req);
};

export const attemptSignOut = async (req: Request) => {
  return new Promise((resolve) => {
    // TODO [Slava] temporary. Remove after apollo-server-integration-testing update or fork the package
    if (IN_TEST) {
      req.session!.userId = null;
      resolve(true);
    }

    if (req.session && req.session.destroy) {
      req.session.destroy((error) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } else {
      resolve(false);
    }
  });
};
