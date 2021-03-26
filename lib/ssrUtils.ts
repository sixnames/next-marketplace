import { DEFAULT_CITY, DEFAULT_LOCALE, ROLE_SLUG_ADMIN, ROUTE_SIGN_IN } from 'config/common';
import { COL_COMPANIES, COL_ROLES, COL_USERS } from 'db/collectionNames';
import { CompanyModel, RoleModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getCatalogueNavRubrics, getPageInitialData } from 'lib/catalogueUtils';
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
  const db = await getDatabase();
  const user = await db.collection<UserModel>(COL_USERS).findOne(
    { email: `${session.user.email}` },
    {
      projection: {
        password: false,
      },
    },
  );

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  const role = await db.collection<RoleModel>(COL_ROLES).findOne({ _id: user.roleId });
  if ((!role || role.slug !== ROLE_SLUG_ADMIN) && isCms) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  const initialDataProps = {
    locale: `${sessionLocale}`,
    city: sessionCity,
  };

  const rawInitialData = await getPageInitialData(initialDataProps);
  const initialData = castDbData(rawInitialData);

  const currentCity = rawInitialData.cities.find(({ slug }) => {
    return slug === sessionCity;
  });

  return {
    props: {
      initialData,
      sessionCity: currentCity ? sessionCity : DEFAULT_CITY,
      sessionLocale,
      sessionUser: castDbData(user),
      domain: `${domain}`,
      canonicalUrl: `https://${host}${path}`,
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

  const currentCity = rawInitialData.cities.find(({ slug }) => {
    return slug === sessionCity;
  });

  let company: CompanyModel | null | undefined = null;

  if (domain && process.env.DEFAULT_DOMAIN && domain !== process.env.DEFAULT_DOMAIN) {
    const db = await getDatabase();
    company = await db.collection<CompanyModel>(COL_COMPANIES).findOne({ domain });
  }

  return {
    props: {
      initialData,
      navRubrics,
      sessionCity: currentCity ? sessionCity : DEFAULT_CITY,
      sessionLocale,
      company,
      domain: `${domain}`,
      canonicalUrl: `https://${host}${path}`,
    },
  };
}
