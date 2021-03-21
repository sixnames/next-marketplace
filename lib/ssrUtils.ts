import { DEFAULT_CITY, DEFAULT_LOCALE, ROUTE_SIGN_IN } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { CompanyModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getCatalogueNavRubrics, getPageInitialData } from 'lib/catalogueUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getSession } from 'next-auth/client';
import { PagePropsInterface } from 'pages/_app';
import { getSubdomain, getDomain } from 'tldts';

export async function getAppInitialData(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PagePropsInterface>> {
  const { locale } = context;
  const referer = `${process.env.SITE}`;
  const subdomain = getSubdomain(referer);
  const sessionCity = subdomain || DEFAULT_CITY;
  const sessionLocale = locale || DEFAULT_LOCALE;

  const initialDataProps = {
    locale: `${sessionLocale}`,
    city: sessionCity,
  };

  const rawInitialData = await getPageInitialData(initialDataProps);
  const initialData = castDbData(rawInitialData);

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

  const currentCity = rawInitialData.cities.find(({ slug }) => {
    return slug === sessionCity;
  });

  return {
    props: {
      initialData,
      sessionCity: currentCity ? sessionCity : DEFAULT_CITY,
      sessionLocale,
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
  const { locale } = context;
  const referer = `${process.env.SITE}`;
  const subdomain = getSubdomain(referer);
  const domain = getDomain(referer);
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

  if (domain && process.env.DEFAULT_DOMAIN && domain !== process.env.DEFAULT_DOMAIN) {
    const db = await getDatabase();
    const company = await db.collection<CompanyModel>(COL_COMPANIES).findOne({ domain });

    return {
      props: {
        initialData,
        navRubrics,
        sessionCity: currentCity ? sessionCity : DEFAULT_CITY,
        sessionLocale,
        domain,
        company,
      },
    };
  }

  return {
    props: {
      initialData,
      navRubrics,
      sessionCity: currentCity ? sessionCity : DEFAULT_CITY,
      sessionLocale,
      domain: process.env.SITE,
    },
  };
}
