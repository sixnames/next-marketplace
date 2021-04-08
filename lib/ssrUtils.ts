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
import { PageUrlsInterface } from 'layout/Meta';
import { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import {
  getCatalogueNavRubrics,
  getPageInitialData,
  PageInitialDataPayload,
} from 'lib/catalogueUtils';
import { getI18nLocaleValue } from 'lib/i18n';
import { getFullName, getShortName } from 'lib/nameUtils';
import { Db } from 'mongodb';
import { GetServerSidePropsContext, Redirect } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';
import { PagePropsInterface } from 'pages/_app';
import { getSubdomain, getDomain } from 'tldts';

interface GetPageInitialStateInterface {
  context: GetServerSidePropsContext;
}

interface GetPageInitialStatePayloadInterface {
  db: Db;
  path: string;
  host: string;
  domain: string | null;
  session: Session | null;
  initialData: PageInitialDataPayload;
  currentCity: CityModel | null | undefined;
  sessionCity: string;
  sessionLocale: string;
  pageUrls: PageUrlsInterface;
  company: CompanyModel | null | undefined;
  initialDataProps: {
    locale: string;
    city: string;
  };
}

async function getPageInitialState({
  context,
}: GetPageInitialStateInterface): Promise<GetPageInitialStatePayloadInterface> {
  const db = await getDatabase();
  const { locale, resolvedUrl } = context;
  const path = `${resolvedUrl}`;
  const host = `${context.req.headers.host}`;
  const subdomain = getSubdomain(host, { validHosts: ['localhost'] });
  const domain = getDomain(host, { validHosts: ['localhost'] });
  const sessionLocale = locale || DEFAULT_LOCALE;

  // Check if user authenticated
  const session = await getSession(context);

  // Session city
  let currentCity: CityModel | null | undefined;
  const citiesCollection = db.collection<CityModel>(COL_CITIES);
  if (subdomain) {
    const initialCity = await citiesCollection.findOne({ slug: subdomain });
    currentCity = castDbData(initialCity);
  }
  if (!currentCity) {
    const initialCity = await citiesCollection.findOne({ slug: DEFAULT_CITY });
    currentCity = currentCity = castDbData(initialCity);
  }
  const sessionCity = currentCity?.slug || DEFAULT_CITY;

  const initialDataProps = {
    locale: sessionLocale,
    city: sessionCity,
  };

  // Session company
  let company: CompanyModel | null | undefined = null;
  if (domain && process.env.DEFAULT_DOMAIN && domain !== process.env.DEFAULT_DOMAIN) {
    const db = await getDatabase();
    company = await db.collection<CompanyModel>(COL_COMPANIES).findOne({ domain });
  }

  // Page initial data
  const rawInitialData = await getPageInitialData({
    ...initialDataProps,
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
    company,
    currentCity: currentCity
      ? {
          ...currentCity,
          name: getI18nLocaleValue(currentCity.nameI18n, sessionLocale),
        }
      : null,
    sessionCity,
    sessionLocale,
    initialDataProps,
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
    db,
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

  // Session user
  // const sessionUserStart = new Date().getTime();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const userAggregation = await usersCollection
    .aggregate([
      {
        $match: {
          email: `${session.user.email}`,
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
                let: { allowedAppNavigation: '$allowedAppNavigation' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: ['$_id', '$$allowedAppNavigation'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                name: `$nameI18n.${sessionLocale}`,
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

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  if (!user.role) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  if (user.role.slug !== ROLE_SLUG_ADMIN && isCms) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  if (
    user.role.slug !== ROLE_SLUG_COMPANY_MANAGER &&
    user.role.slug !== ROLE_SLUG_COMPANY_OWNER &&
    !isCms
  ) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  const sessionUser: UserModel = {
    ...user,
    fullName: getFullName(user),
    shortName: getShortName(user),
  };
  // console.log(sessionUser);
  // console.log('Session user ', new Date().getTime() - sessionUserStart);

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
    initialDataProps,
    company,
  } = await getPageInitialState({ context });

  // initial data
  const rawNavRubrics = await getCatalogueNavRubrics(initialDataProps);
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
    },
  };
}
