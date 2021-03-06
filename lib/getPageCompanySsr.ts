import { CityModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { getSsrDomainCompany } from 'db/ssr/company/getSsrDomainCompany';
import { GetServerSidePropsContext } from 'next';
import { PagePropsInterface } from 'pages/_app';
import { getDomain } from 'tldts';
import { alwaysString } from './arrayUtils';
import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG, DEFAULT_LOCALE } from './config/common';
import { getPageDataSsr } from './getPageDataSsr';
import { getI18nLocaleValue } from './i18n';
import { noNaN } from './numbers';
import { castDbData } from './ssrUtils';

interface GetPageSsrInitialStateInterface {
  context: GetServerSidePropsContext;
}

interface GetPageSsrInitialStatePayloadInterface extends PagePropsInterface {
  path: string;
  host: string;
  domain: string | null;
  companyNotFound: boolean;
}

export async function getPageCompanySsr({
  context,
}: GetPageSsrInitialStateInterface): Promise<GetPageSsrInitialStatePayloadInterface> {
  const { locale, resolvedUrl, query } = context;
  const collections = await getDbCollections();
  const citiesCollection = collections.citiesCollection();

  const path = `${resolvedUrl}`;
  const host = `${context.req.headers.host}`;
  const domain = getDomain(host, { validHosts: ['localhost'] });
  const sessionLocale = locale || DEFAULT_LOCALE;

  // Session city
  let currentCity: CityModel | null | undefined;
  const queryCitySlug = alwaysString(query.citySlug);
  if (queryCitySlug) {
    const initialCity = await citiesCollection.findOne({ slug: queryCitySlug });
    currentCity = castDbData(initialCity);
  }
  if (!currentCity) {
    const defaultCity = await citiesCollection.findOne({ slug: DEFAULT_CITY });
    currentCity = castDbData(defaultCity);
  }
  const citySlug = currentCity?.slug || DEFAULT_CITY;

  // Domain company
  const domainCompany = await getSsrDomainCompany({ domain });
  /// domain company for development
  // const domainCompany = await getSsrDomainCompany({ slug: `company_a` });
  // const domainCompany = await getSsrDomainCompany({ slug: `5` });
  let companyNotFound = false;
  if (!domainCompany) {
    companyNotFound = true;
  }

  // Page initial data
  const rawInitialData = await getPageDataSsr({
    locale: sessionLocale,
    citySlug,
    companySlug: domainCompany ? domainCompany.slug : DEFAULT_COMPANY_SLUG,
  });
  const initialData = castDbData(rawInitialData);

  // Site theme accent color
  const themeColor = rawInitialData.configs.siteThemeColor;
  const fallbackColor = `219, 83, 96`;
  const themeRGB = `${themeColor}`.split(',').map((num) => noNaN(num));
  const toShort = themeRGB.length < 3;
  const finalThemeColor = toShort ? fallbackColor : themeColor;

  const themeR = toShort ? '219' : themeRGB[0];
  const themeG = toShort ? '83' : themeRGB[1];
  const themeB = toShort ? '96' : themeRGB[2];
  const themeStyle = {
    '--theme': `rgb(${finalThemeColor})`,
    '--themeR': `${themeR}`,
    '--themeG': `${themeG}`,
    '--themeB': `${themeB}`,
  };

  return {
    path,
    host,
    domain,
    initialData,
    themeStyle,
    domainCompany: castDbData(domainCompany),
    companySlug: domainCompany ? domainCompany.slug : DEFAULT_COMPANY_SLUG,
    citySlug,
    sessionLocale,
    companyNotFound,
    currentCity: currentCity
      ? {
          ...currentCity,
          name: getI18nLocaleValue(currentCity.nameI18n, sessionLocale),
        }
      : null,
  };
}
