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
import { COL_COMPANIES, COL_NAV_ITEMS, COL_ROLES, COL_USERS } from 'db/collectionNames';
import { CityModel, CompanyModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getCatalogueNavRubrics, getPageInitialData } from 'lib/catalogueUtils';
import { getI18nLocaleValue } from 'lib/i18n';
import { getFullName, getShortName } from 'lib/nameUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getSession } from 'next-auth/client';
import { PagePropsInterface } from 'pages/_app';
import { getSubdomain, getDomain } from 'tldts';

interface GetAppInitialDataInterface {
  context: GetServerSidePropsContext;
  isCms?: boolean;
}

export async function getAppInitialData({
  context,
  isCms,
}: GetAppInitialDataInterface): Promise<GetServerSidePropsResult<PagePropsInterface>> {
  const { locale, resolvedUrl } = context;
  const path = `${resolvedUrl}`;
  const host = `${context.req.headers.host}`;
  const subdomain = getSubdomain(host, { validHosts: ['localhost'] });
  const domain = getDomain(host, { validHosts: ['localhost'] });
  const sessionCity = subdomain || DEFAULT_CITY;
  const sessionLocale = locale || DEFAULT_LOCALE;

  // Check if user authenticated
  const session = await getSession(context);
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
  const db = await getDatabase();
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

  if (user.role.slug !== ROLE_SLUG_COMPANY_MANAGER && user.role.slug !== ROLE_SLUG_COMPANY_OWNER) {
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

  const initialDataProps = {
    locale: `${sessionLocale}`,
    city: sessionCity,
  };

  const rawInitialData = await getPageInitialData(initialDataProps);
  const initialData = castDbData(rawInitialData);

  const currentCity = initialData.cities.find(({ slug }: CityModel) => {
    return slug === sessionCity;
  });

  return {
    props: {
      initialData,
      currentCity: currentCity
        ? {
            ...currentCity,
            name: getI18nLocaleValue(currentCity.nameI18n, sessionLocale),
          }
        : null,
      sessionCity: currentCity ? sessionCity : DEFAULT_CITY,
      sessionUser: castDbData(sessionUser),
      sessionLocale,
      pageUrls: {
        canonicalUrl: `https://${host}${path}`,
        siteUrl: `https://${host}`,
        domain: `${domain}`,
      },
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

  const { locale, resolvedUrl } = context;
  const path = `${resolvedUrl}`;
  const host = `${context.req.headers.host}`;
  const subdomain = getSubdomain(host, { validHosts: ['localhost'] });
  const domain = getDomain(host, { validHosts: ['localhost'] });
  const sessionCity = subdomain || DEFAULT_CITY;
  const sessionLocale = locale || DEFAULT_LOCALE;

  const initialDataProps = {
    locale: sessionLocale,
    city: sessionCity,
  };

  // initial data
  const rawInitialData = await getPageInitialData(initialDataProps);
  const rawNavRubrics = await getCatalogueNavRubrics(initialDataProps);
  const initialData = castDbData(rawInitialData);
  const navRubrics = castDbData(rawNavRubrics);
  // console.log('After initial data ', new Date().getTime() - timeStart);

  const currentCity = initialData.cities.find(({ slug }: CityModel) => {
    return slug === sessionCity;
  });

  let company: CompanyModel | null | undefined = null;

  if (domain && process.env.DEFAULT_DOMAIN && domain !== process.env.DEFAULT_DOMAIN) {
    const db = await getDatabase();
    company = await db.collection<CompanyModel>(COL_COMPANIES).findOne({ domain });
  }

  // Cache header
  // context.res.setHeader('cache-control', `s-maxage=1, stale-while-revalidate=${ONE_WEEK}`);
  // context.res.setHeader('cache-control', `s-maxage=604800000, stale-while-revalidate=86400000`);

  // console.log('getSiteInitialData total time ', new Date().getTime() - timeStart);

  return {
    props: {
      initialData,
      navRubrics,
      currentCity: currentCity
        ? {
            ...currentCity,
            name: getI18nLocaleValue(currentCity.nameI18n, sessionLocale),
          }
        : null,
      sessionCity: currentCity ? sessionCity : DEFAULT_CITY,
      sessionLocale,
      company,
      pageUrls: {
        canonicalUrl: `https://${host}${path}`,
        siteUrl: `https://${host}`,
        domain: `${domain}`,
      },
    },
  };
}
