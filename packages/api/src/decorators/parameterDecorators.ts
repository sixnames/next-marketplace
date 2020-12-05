import { createParamDecorator } from 'type-graphql';
import { ContextInterface } from '../types/context';
import { AuthDecoratorConfigInterface } from './methodDecorators';
import { CART_COOKIE_KEY, MessageKey, ROLE_SLUG_ADMIN } from '@yagu/config';
import getApiMessage from '../utils/translations/getApiMessage';
import getLangField from '../utils/translations/getLangField';
import { Translation } from '../entities/Translation';
import cookie from 'cookie';
import { CartModel } from '../entities/Cart';
import { UserModel } from '../entities/User';

export function SessionUser() {
  return createParamDecorator<ContextInterface>(({ context }) => {
    return context.getUser();
  });
}

export function SessionUserId() {
  return createParamDecorator<ContextInterface>(({ context }) => {
    return context.getUser()?.id.toString();
  });
}

export function SessionCart() {
  return createParamDecorator<ContextInterface>(async ({ context }) => {
    const user = context.getUser();
    const userCartId = user ? user.cart : null;
    // console.log(user);
    // Get cart id from cookies or session user
    const cookies = cookie.parse(context.req.headers.cookie || '');
    const cartId = userCartId || cookies[CART_COOKIE_KEY];
    const cart = await CartModel.findById(cartId);

    // If cart not exist
    if (!cart || !cartId) {
      const newCart = await CartModel.create({
        products: [],
      });

      if (!newCart) {
        throw Error('Cart creation error');
      }

      // Set cart id to cookies
      context.res.cookie(CART_COOKIE_KEY, newCart.id);

      // Update user card field and set new user to session
      if (user) {
        await UserModel.findByIdAndUpdate(
          user.id,
          {
            cart: newCart.id,
          },
          { new: true },
        );

        if (!newCart) {
          throw Error('User cart creation error');
        }
      }

      return newCart;
    }

    return cart;
  });
}

export function SessionRole() {
  return createParamDecorator<ContextInterface>(async ({ context }) => {
    return context.req.role;
  });
}

export function CustomFilter(operationConfig: AuthDecoratorConfigInterface) {
  return createParamDecorator<ContextInterface>(async ({ context }) => {
    const { roleRules, role } = context.req;
    if (role.slug === ROLE_SLUG_ADMIN) {
      return {};
    }

    const currentRule = roleRules.find(({ entity }) => entity === operationConfig.entity);

    if (!currentRule) {
      return {};
    }

    const currentOperation: any | undefined = currentRule.operations.find(
      ({ operationType }: any) => operationType === operationConfig.operationType,
    );

    if (!currentOperation) {
      return {};
    }

    const user = context.getUser();
    const { customFilter = '{}' } = currentOperation;
    const customFilterResult = customFilter.replace(/__authenticatedUser/gi, `${user?.id}`);
    return JSON.parse(customFilterResult);
  });
}

export interface LocalizationPayloadInterface {
  lang: string;
  defaultLang: string;
  city: string;
  getApiMessage: (key: MessageKey) => Promise<string>;
  getLangField: (translations: Translation[] | null | undefined) => string;
}

export function Localization() {
  return createParamDecorator<ContextInterface>(({ context }) => {
    const { lang, defaultLang, city } = context.req;
    return {
      lang,
      defaultLang,
      city,
      getApiMessage: (key: MessageKey) => getApiMessage({ lang, key }),
      getLangField: (translations: Translation[] | null | undefined) => {
        return getLangField(translations, lang);
      },
    };
  });
}
