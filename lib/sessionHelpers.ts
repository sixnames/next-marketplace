import { RoleRuleSlugType } from 'lib/roleUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { CartModel, RoleModel, RoleRuleModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  CART_COOKIE_KEY,
  CITY_COOKIE_KEY,
  COMPANY_SLUG_COOKIE_KEY,
  COOKIE_CURRENCY,
  DEFAULT_CITY,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  LOCALE_COOKIE_KEY,
  LOCALE_HEADER,
  ROLE_SLUG_ADMIN,
  ROLE_SLUG_GUEST,
  SECONDARY_LOCALE,
} from 'config/common';
import nookies from 'nookies';
import { NexusContext } from 'types/apiContextTypes';
import { COL_CARTS, COL_ROLE_RULES, COL_ROLES, COL_USERS } from 'db/collectionNames';
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

  // Get session user from db
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const user = await usersCollection.findOne({ email: session.user.email });

  return user;
};

interface GetSessionRolePayloadInterface {
  role: RoleModel;
  user?: UserModel | null;
}

export const getSessionRole = async (
  context: NexusContext,
): Promise<GetSessionRolePayloadInterface> => {
  // Get session user
  const user = await getSessionUser(context);

  const { db } = await getDatabase();
  const rolesCollection = db.collection<RoleModel>(COL_ROLES);

  // Get guest role if user is unauthenticated
  if (!user) {
    const guestRole = await rolesCollection.findOne({ slug: ROLE_SLUG_GUEST });
    if (!guestRole) {
      throw Error('Guest role not found in getSessionRole');
    }
    return {
      role: guestRole,
      user,
    };
  }

  const userRole = await rolesCollection.findOne({ _id: user.roleId });
  if (!userRole) {
    throw Error('User role not found in getSessionRole');
  }
  return {
    role: userRole,
    user,
  };
};

// Get locale slug form cookies
export const getSessionLocale = (context: NexusContext): string => {
  const cookies = nookies.get(context);
  return (
    cookies?.[LOCALE_COOKIE_KEY] ||
    context?.[LOCALE_COOKIE_KEY] ||
    context?.req?.headers[LOCALE_HEADER] ||
    DEFAULT_LOCALE
  );
};

// Get locale slug form cookies
export const getSessionCurrency = (context: NexusContext): string => {
  const cookies = nookies.get(context);
  return cookies?.[COOKIE_CURRENCY] || DEFAULT_CURRENCY;
};

// Get city slug form cookies
export const getSessionCity = (context: NexusContext): string => {
  const cookies = nookies.get(context);
  return cookies?.[CITY_COOKIE_KEY] || context?.[CITY_COOKIE_KEY] || DEFAULT_CITY;
};

// Get company slug form cookies
export const getSessionCompanySlug = (context: NexusContext): string => {
  const cookies = nookies.get(context);
  return cookies?.[COMPANY_SLUG_COOKIE_KEY] || DEFAULT_CITY;
};

interface GetOperationPermissionInterface {
  context: any;
  slug: RoleRuleSlugType;
}

interface GetOperationPermissionPayloadInterface {
  allow: boolean;
  message: string;
  user?: UserModel | null;
}

export const getOperationPermission = async ({
  context,
  slug,
}: GetOperationPermissionInterface): Promise<GetOperationPermissionPayloadInterface> => {
  const { db } = await getDatabase();
  const roleRulesCollection = db.collection<RoleRuleModel>(COL_ROLE_RULES);
  const { role, user } = await getSessionRole(context);

  if (!user) {
    return {
      allow: false,
      message: '',
      user,
    };
  }

  if (role.slug === ROLE_SLUG_ADMIN) {
    return {
      allow: true,
      message: '',
      user,
    };
  }

  const rule = await roleRulesCollection.findOne({
    slug,
    roleId: role._id,
  });

  if (!rule?.allow) {
    const locale = getSessionLocale(context);

    return {
      allow: false,
      message: await getApiMessageValue({
        slug: 'permission.error',
        locale,
      }),
    };
  }

  return {
    allow: rule.allow,
    message: '',
    user,
  };
};

export const getSessionCart = async (context: NexusContext): Promise<CartModel> => {
  // Get session user
  const user = await getSessionUser(context);
  const userCartId = user ? user.cartId : null;
  const { db } = await getDatabase();
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
      createdAt: new Date(),
      updatedAt: new Date(),
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
        { returnDocument: 'after' },
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

export interface GetApiResolverValidationSchemaInterface {
  req: NextApiRequest;
  res: NextApiResponse;
  schema: (args: ValidationSchemaArgsInterface) => ResolverValidationSchema;
}

export async function getApiResolverValidationSchema({
  req,
  res,
  schema,
}: GetApiResolverValidationSchemaInterface) {
  const locale = getSessionLocale({ req, res });
  const messages = await getValidationMessages();
  return schema({ locale, messages });
}

export type GetFieldLocaleType = (i18nField?: Record<string, string> | null) => string;

export interface GetRequestParamsPayloadInterface {
  locale: string;
  city: string;
  currency: string;
  companySlug: string;
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
  const currency = getSessionCurrency(context);
  const city = getSessionCity(context);
  const companySlug = getSessionCompanySlug(context);

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
      translation = '';
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
    currency,
    companySlug,
    getI18nLocale,
    getFieldLocale,
    getCityData,
    getCityLocale,
    getApiMessage,
  };
};

interface GetResponseStatusInterface extends Record<any, any> {
  success: boolean;
}

function getResponseStatus(payload: GetResponseStatusInterface): number {
  if (payload.success) {
    return 200;
  }
  return 500;
}

interface SendApiRouteResponseInterface {
  payload: GetResponseStatusInterface;
  res: NextApiResponse;
}

export function sendApiRouteResponse({ payload, res }: SendApiRouteResponseInterface) {
  res.status(getResponseStatus(payload)).send(payload);
  return;
}

export function sendApiRouteWrongMethod(res: NextApiResponse) {
  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
}
