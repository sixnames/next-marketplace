import { AuthenticationError } from 'apollo-server-express';
import { ContextInterface } from '../../types/context';
import { User, UserModel } from '../../entities/User';
import { compare } from 'bcryptjs';
import { IN_TEST } from '../../config';
import getApiMessage from '../translations/getApiMessage';
import { DecoratorOperationType } from '../../decorators/methodDecorators';

type Request = ContextInterface['req'];

const signedIn = (req: Request) => {
  return req.session && req.session.userId;
};

export const attemptSignIn = async (
  email: User['email'],
  password: User['password'],
  lang: string,
) => {
  const emailErrorMessage = await getApiMessage({ key: `users.signIn.emailError`, lang });
  const passwordErrorMessage = await getApiMessage({ key: `users.signIn.passwordError`, lang });

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
    message: await getApiMessage({ key: `users.signIn.success`, lang }),
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
    // TODO temporary. Remove after apollo-server-integration-testing update or fork the package
    if (IN_TEST) {
      req.session!.user = null;
      req.session!.userId = null;
      req.session!.roleId = null;
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

export function getOperationsConfigs(entity: string) {
  // TODO make operation name as constant
  return {
    operationConfigCreate: {
      entity,
      operationType: 'create' as DecoratorOperationType,
    },
    operationConfigRead: {
      entity,
      operationType: 'read' as DecoratorOperationType,
    },
    operationConfigUpdate: {
      entity,
      operationType: 'update' as DecoratorOperationType,
    },
    operationConfigDelete: {
      entity,
      operationType: 'delete' as DecoratorOperationType,
    },
  };
}
