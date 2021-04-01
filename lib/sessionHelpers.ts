import { getSession } from 'next-auth/client';
import { CartModel, RoleModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  CART_COOKIE_KEY,
  CITY_HEADER,
  DEFAULT_CITY,
  DEFAULT_LOCALE,
  LOCALE_HEADER,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
  ROLE_SLUG_GUEST,
  SECONDARY_LOCALE,
} from 'config/common';
import { NexusContext } from 'types/apiContextTypes';
import { COL_CARTS, COL_ROLES, COL_USERS } from 'db/collectionNames';
import { getCityFieldData, getI18nLocaleValue } from 'lib/i18n';
import { MessageSlug } from 'types/messageSlugTypes';
import { getApiMessageValue, getValidationMessages } from 'lib/apiMessageUtils';
import Cookies from 'cookies';
import { ObjectId } from 'mongodb';
import { ObjectSchema, ArraySchema } from 'yup';
import { ValidationSchemaArgsInterface } from 'types/validataionTypes';

export const getSessionUser = async (context: NexusContext): Promise<UserModel | null> => {
  // Get session user
  const session = await getSession(context);
  if (!session?.user?.email) {
    return null;
  }

  // TODO add id field to the session user after NextAuth update
  // Get session user from db
  const db = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const user = await usersCollection.findOne({ email: session.user.email });

  return user;
};

export const getSessionRole = async (context: NexusContext): Promise<RoleModel> => {
  // Get session user
  const user = await getSessionUser(context);

  const db = await getDatabase();
  const rolesCollection = db.collection<RoleModel>(COL_ROLES);

  // Get guest role if user is unauthenticated
  if (!user) {
    const guestRole = await rolesCollection.findOne({ slug: ROLE_SLUG_GUEST });
    if (!guestRole) {
      throw Error('Guest role not found in getSessionRole');
    }
    return guestRole;
  }

  const userRole = await rolesCollection.findOne({ _id: user.roleId });
  if (!userRole) {
    throw Error('User role not found in getSessionRole');
  }
  return userRole;
};

export const getSessionLocale = (context: NexusContext): string => {
  // Get locale form context if request form server
  // Otherwise get locale from Content-Language header
  // populated with Apollo client
  return context?.locale || context?.req?.headers[LOCALE_HEADER] || DEFAULT_LOCALE;
};

export const getSessionCity = (context: NexusContext): string => {
  // Get city form context if request form server
  // Otherwise get city from x-city header
  // populated with Apollo client
  const headerCity = context?.req?.headers[CITY_HEADER];
  if (headerCity) {
    return `${headerCity}`;
  }
  return context?.city || DEFAULT_CITY;
};

export const getSessionCart = async (context: NexusContext): Promise<CartModel> => {
  // Get session user
  const user = await getSessionUser(context);
  const userCartId = user ? user.cartId : null;
  const db = await getDatabase();
  const cartsCollection = db.collection<CartModel>(COL_CARTS);
  const usersCollection = db.collection<UserModel>(COL_USERS);

  // Get cart id from cookies or session user
  const cookies = new Cookies(context.req, context.res);
  const cartId = userCartId || cookies.get(CART_COOKIE_KEY);

  // Find exiting cart
  const cart = cartId ? await cartsCollection.findOne({ _id: new ObjectId(cartId) }) : null;

  // If cart not exist
  if (!cartId || !cart) {
    const newCartResult = await cartsCollection.insertOne({
      cartProducts: [],
    });

    const newCart = newCartResult.ops[0];
    if (!newCartResult.result.ok || !newCart) {
      throw Error('Cart creation error');
    }

    // Set cart _id to cookies
    cookies.set(CART_COOKIE_KEY, newCart._id.toHexString(), {
      httpOnly: true, // true by default
    });

    // Update user cartId field
    if (user) {
      await usersCollection.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            cartId: newCart._id,
          },
        },
        { returnOriginal: false },
      );

      if (!newCartResult) {
        throw Error('User cart creation error');
      }
    }

    return newCart;
  }

  return cart;
};

// Resolver validation
export type ResolverValidationSchema = ObjectSchema<any> | ArraySchema<any>;
export interface ValidateResolverInterface {
  context: NexusContext;
  schema: (args: ValidationSchemaArgsInterface) => ResolverValidationSchema;
}

export async function getResolverValidationSchema({ context, schema }: ValidateResolverInterface) {
  const locale = getSessionLocale(context);
  const messages = await getValidationMessages();
  return schema({ locale, messages });
}

export type GetFieldLocaleType = (i18nField?: Record<string, string> | null) => string;

export interface GetRequestParamsPayloadInterface {
  locale: string;
  city: string;
  getI18nLocale<T>(i18nField: Record<string, T>): T;
  getCityData<T>(cityField: Record<string, T>): T;
  getFieldLocale: GetFieldLocaleType;
  getCityLocale<T>(cityField: Record<string, Record<string, T>>): T;
  getApiMessage(slug: MessageSlug): Promise<string>;
}

// City, locale and api messages helper
export const getRequestParams = async (
  context: NexusContext,
): Promise<GetRequestParamsPayloadInterface> => {
  const locale = getSessionLocale(context);
  const city = getSessionCity(context);

  function getI18nLocale<T>(i18nField: Record<string, T>): T {
    return getI18nLocaleValue(i18nField, locale);
  }

  function getCityData<T>(cityField: Record<string, T>): T {
    return getCityFieldData(cityField, city);
  }

  function getFieldLocale(i18nField?: Record<string, string> | null): string {
    if (!i18nField) {
      return '';
    }

    let translation = getI18nLocale<string>(i18nField);

    // Get fallback language if chosen not found
    if (!translation) {
      translation = i18nField[SECONDARY_LOCALE];
    }

    // Get default language if fallback not found
    if (!translation) {
      translation = i18nField[DEFAULT_LOCALE];
    }

    // Set warning massage if fallback language not found
    if (!translation) {
      translation = LOCALE_NOT_FOUND_FIELD_MESSAGE;
    }

    return translation;
  }

  function getCityLocale<T>(cityField: Record<string, Record<string, T>>): T {
    const cityData = getCityData(cityField);
    const cityLocale = getI18nLocale(cityData);
    if (!cityLocale) {
      throw Error('getCityLocale error');
    }
    return cityLocale;
  }

  async function getApiMessage(slug: MessageSlug): Promise<string> {
    return getApiMessageValue({ slug, locale });
  }

  return {
    locale,
    city,
    getI18nLocale,
    getFieldLocale,
    getCityData,
    getCityLocale,
    getApiMessage,
  };
};
