import { COL_ROLE_RULES } from 'db/collectionNames';
import { UserModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { RoleInterface } from 'db/uiInterfaces';
import { getApiMessageValue, getValidationMessages } from 'db/utils/apiMessageUtils';
import {
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
} from 'lib/config/common';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import nookies from 'nookies';
import { NexusContext } from 'types/apiContextTypes';
import { MessageSlug } from 'types/messageSlugTypes';
import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import { ArraySchema, ObjectSchema } from 'yup';
import { getCityFieldData, getI18nLocaleValue } from './i18n';
import { RoleRuleSlugType } from './roleRuleUtils';

export const getSessionUser = async (context: NexusContext): Promise<UserModel | null> => {
  // Get session user
  const session = await getSession(context);
  if (!session?.user?.email) {
    return null;
  }

  // Get session user from db
  const collections = await getDbCollections();
  const usersCollection = collections.usersCollection();
  const user = await usersCollection.findOne({ email: session.user.email });

  return user;
};

interface GetSessionRolePayloadInterface {
  role: RoleInterface;
  user?: UserModel | null;
}

export const getSessionRole = async (
  context: NexusContext,
): Promise<GetSessionRolePayloadInterface> => {
  // Get session user
  const user = await getSessionUser(context);

  const collections = await getDbCollections();
  const rolesCollection = collections.rolesCollection();

  // Get guest role if user is unauthenticated
  const roleMatch = user ? { _id: user.roleId } : { slug: ROLE_SLUG_GUEST };
  const userRoleAggregation = await rolesCollection
    .aggregate<RoleInterface>([
      {
        $match: roleMatch,
      },
      {
        $lookup: {
          from: COL_ROLE_RULES,
          as: 'rules',
          localField: '_id',
          foreignField: 'roleId',
        },
      },
    ])
    .toArray();
  const userRole = userRoleAggregation[0];
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
  role: RoleInterface;
}

export const getOperationPermission = async ({
  context,
  slug,
}: GetOperationPermissionInterface): Promise<GetOperationPermissionPayloadInterface> => {
  const collections = await getDbCollections();
  const roleRulesCollection = collections.roleRulesCollection();
  const { role, user } = await getSessionRole(context);

  if (!user) {
    return {
      allow: false,
      message: '',
      user,
      role,
    };
  }

  if (role.slug === ROLE_SLUG_ADMIN) {
    return {
      allow: true,
      message: '',
      user,
      role,
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
      role,
    };
  }

  return {
    allow: rule.allow,
    message: '',
    user,
    role,
  };
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
  citySlug: string;
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
  const citySlug = getSessionCity(context);
  const companySlug = getSessionCompanySlug(context);

  function getI18nLocale<T>(i18nField: Record<string, T>): T {
    return getI18nLocaleValue(i18nField, locale);
  }

  function getCityData<T>(cityField: Record<string, T>): T {
    return getCityFieldData(cityField, citySlug);
  }

  function getFieldLocale(i18nField?: Record<string, string> | null): string {
    if (!i18nField) {
      return '';
    }

    let translation = getI18nLocale<string>(i18nField);

    // Get fallback locale if chosen locale not found
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
    citySlug,
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
  statusCode?: number | null;
}

function getResponseStatus(payload: GetResponseStatusInterface): number {
  if (payload.statusCode) {
    return payload.statusCode;
  }

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
