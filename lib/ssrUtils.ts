import {
  DEFAULT_CITY,
  DEFAULT_LOCALE,
  ROLE_SLUG_ADMIN,
  ROLE_SLUG_COMPANY_MANAGER,
  ROLE_SLUG_COMPANY_OWNER,
  ROUTE_APP_NAV_GROUP,
  ROUTE_CMS_NAV_GROUP,
  ROUTE_SIGN_IN,
} from 'config/common';
import { COL_CITIES, COL_COMPANIES, COL_NAV_ITEMS, COL_ROLES, COL_USERS } from 'db/collectionNames';
import { CityModel, CompanyModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getCatalogueNavRubrics, getPageInitialData } from 'lib/catalogueUtils';
import { getI18nLocaleValue } from 'lib/i18n';
import { getFullName, getShortName } from 'lib/nameUtils';
import { Db } from 'mongodb';
import { GetServerSidePropsContext, Redirect } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';
import { PagePropsInterface } from 'pages/_app';
import { getSubdomain, getDomain } from 'tldts';

export interface GetPageSessionUserInterface {
  email?: string | null;
  locale: string;
}

export async function getPageSessionUser({
  email,
  locale,
}: GetPageSessionUserInterface): Promise<UserModel | null | undefined> {
  if (!email) {
    return null;
  }

  const db = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const userAggregation = await usersCollection
    .aggregate([
      {
        $match: {
          email,
        },
      },
      {
        $lookup: {
          from: COL_COMPANIES,
          as: 'companies',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $eq: ['$ownerId', '$$userId'],
                    },
                    {
                      $in: ['$$userId', '$staffIds'],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: COL_ROLES,
          as: 'roles',
          let: { roleId: '$roleId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$roleId'],
                },
              },
            },
            {
              $lookup: {
                from: COL_NAV_ITEMS,
                as: 'navItems',
                let: { allowedAppNavigation: '$allowedAppNavigation', slug: '$slug' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          { $in: ['$_id', '$$allowedAppNavigation'] },
                          { $eq: ['$$slug', ROLE_SLUG_ADMIN] },
                        ],
                      },
                    },
                  },
                  {
                    $addFields: {
                      name: `$nameI18n.${locale}`,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                name: `$nameI18n.${locale}`,
                appNavigation: {
                  $filter: {
                    input: '$navItems',
                    as: 'navItem',
                    cond: {
                      $eq: ['$$navItem.navGroup', ROUTE_APP_NAV_GROUP],
                    },
                  },
                },
                cmsNavigation: {
                  $filter: {
                    input: '$navItems',
                    as: 'navItem',
                    cond: {
                      $eq: ['$$navItem.navGroup', ROUTE_CMS_NAV_GROUP],
                    },
                  },
                },
              },
            },
            {
              $project: {
                nameI18n: false,
                navItems: false,
                createdAt: false,
                updatedAt: false,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          role: { $arrayElemAt: ['$roles', 0] },
        },
      },
      {
        $project: {
          password: false,
          roles: false,
          createdAt: false,
          updatedAt: false,
        },
      },
    ])
    .toArray();
  const user = userAggregation[0];
  const sessionUser: UserModel | null = user
    ? {
        ...user,
        fullName: getFullName(user),
        shortName: getShortName(user),
      }
    : null;
  return sessionUser;
}

interface GetPageInitialStateInterface {
  context: GetServerSidePropsContext;
}

interface GetPageInitialStatePayloadInterface extends PagePropsInterface {
  db: Db;
  path: string;
  host: string;
  domain: string | null;
  session: Session | null;
}

async function getPageInitialState({
  context,
}: GetPageInitialStateInterface): Promise<GetPageInitialStatePayloadInterface> {
  const { locale, resolvedUrl } = context;
  const db = await getDatabase();
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const citiesCollection = db.collection<CityModel>(COL_CITIES);

  const path = `${resolvedUrl}`;
  const host = `${context.req.headers.host}`;
  const subdomain = getSubdomain(host, { validHosts: ['localhost'] });
  const domain = getDomain(host, { validHosts: ['localhost'] });
  const sessionLocale = locale || DEFAULT_LOCALE;

  // Get session
  const session = await getSession(context);
  // Session user
  // const sessionUserStart = new Date().getTime();
  const sessionUser = await getPageSessionUser({
    email: session?.user?.email,
    locale: sessionLocale,
  });
  // console.log(sessionUser);
  // console.log('Session user ', new Date().getTime() - sessionUserStart);

  // Session city
  let currentCity: CityModel | null | undefined;
  if (subdomain) {
    const initialCity = await citiesCollection.findOne({ slug: subdomain });
    currentCity = castDbData(initialCity);
  }
  if (!currentCity) {
    const initialCity = await citiesCollection.findOne({ slug: DEFAULT_CITY });
    currentCity = currentCity = castDbData(initialCity);
  }
  const sessionCity = currentCity?.slug || DEFAULT_CITY;

  // Session company
  let company: CompanyModel | null | undefined = null;
  if (domain && process.env.DEFAULT_DOMAIN && domain !== process.env.DEFAULT_DOMAIN) {
    company = await companiesCollection.findOne({ domain });
  }
  // For development
  // company = await companiesCollection.findOne({ slug: 'alkoliner' });

  // Page initial data
  const rawInitialData = await getPageInitialData({
    locale: sessionLocale,
    city: sessionCity,
    companySlug: company?.slug,
  });
  const initialData = castDbData(rawInitialData);

  return {
    db,
    path,
    host,
    domain,
    session,
    initialData,
    company: castDbData(company),
    sessionCity,
    sessionLocale,
    sessionUser,
    currentCity: currentCity
      ? {
          ...currentCity,
          name: getI18nLocaleValue(currentCity.nameI18n, sessionLocale),
        }
      : null,
    pageUrls: {
      canonicalUrl: `https://${host}${path}`,
      siteUrl: `https://${host}`,
      domain: `${domain}`,
    },
  };
}

interface GetAppInitialDataInterface {
  context: GetServerSidePropsContext;
  isCms?: boolean;
}

interface GetAppInitialDataPayloadInterface<T> {
  props?: T;
  redirect?: Redirect;
  notFound?: true;
}

export async function getAppInitialData({
  context,
  isCms,
}: GetAppInitialDataInterface): Promise<GetAppInitialDataPayloadInterface<PagePropsInterface>> {
  const {
    sessionUser,
    pageUrls,
    currentCity,
    sessionCity,
    sessionLocale,
    initialData,
    session,
  } = await getPageInitialState({ context });

  // Check if user authenticated
  if (!session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  if (!sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  if (!sessionUser.role) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  if (sessionUser.role.slug !== ROLE_SLUG_ADMIN && isCms) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  if (
    sessionUser.role.slug !== ROLE_SLUG_COMPANY_MANAGER &&
    sessionUser.role.slug !== ROLE_SLUG_COMPANY_OWNER &&
    !isCms
  ) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  return {
    props: {
      initialData,
      currentCity,
      sessionCity,
      sessionUser: castDbData(sessionUser),
      sessionLocale,
      pageUrls,
    },
  };
}

export function castDbData(data: any): any {
  return JSON.parse(JSON.stringify(data));
}

export interface GetSiteInitialDataInterface {
  context: GetServerSidePropsContext;
}

export interface SiteInitialDataPropsInterface
  extends PagePropsInterface,
    Omit<SiteLayoutInterface, 'description' | 'title'> {}

export interface SiteInitialDataPayloadInterface {
  props: SiteInitialDataPropsInterface;
}

export async function getSiteInitialData({
  context,
}: GetSiteInitialDataInterface): Promise<SiteInitialDataPayloadInterface> {
  // console.log(' ');
  // console.log('=================== getSiteInitialData =======================');
  // const timeStart = new Date().getTime();
  const {
    pageUrls,
    currentCity,
    sessionCity,
    sessionLocale,
    initialData,
    company,
    sessionUser,
  } = await getPageInitialState({ context });

  // initial data
  const rawNavRubrics = await getCatalogueNavRubrics({
    locale: sessionLocale,
    city: sessionCity,
    company,
  });
  const navRubrics = castDbData(rawNavRubrics);

  // console.log('getSiteInitialData total time ', new Date().getTime() - timeStart);

  return {
    props: {
      initialData,
      navRubrics,
      currentCity,
      sessionCity,
      sessionLocale,
      company,
      pageUrls,
      sessionUser: castDbData(sessionUser),
    },
  };
}
