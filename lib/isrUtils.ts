import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG, DEFAULT_LOCALE } from 'config/common';
import { COL_CITIES } from 'db/collectionNames';
import { CityModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import { alwaysString } from 'lib/arrayUtils';
import { getI18nLocaleValue } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import {
  castDbData,
  getCatalogueCreatedPages,
  getCatalogueNavRubrics,
  getPageInitialData,
  getSsrDomainCompany,
} from 'lib/ssrUtils';
import { GetStaticPropsContext } from 'next';
// import nookies from 'nookies';
import { PagePropsInterface } from 'pages/_app';

type ParamsInterface = {
  companySlug: string;
  citySlug: string;
  [key: string]: any;
};
export type IsrContextInterface = GetStaticPropsContext<ParamsInterface>;

interface GetPageInitialStateInterface {
  context: IsrContextInterface;
}

interface GetPageInitialStatePayloadInterface extends PagePropsInterface {
  urlPrefix: string;
}

export async function getPageInitialState({
  context,
}: GetPageInitialStateInterface): Promise<GetPageInitialStatePayloadInterface> {
  const { locale, params } = context;
  const { db } = await getDatabase();
  const citiesCollection = db.collection<CityModel>(COL_CITIES);
  const sessionLocale = locale || DEFAULT_LOCALE;
  const citySlug = alwaysString(params?.citySlug);

  // Session city
  let currentCity: CityModel | null | undefined;
  if (citySlug) {
    const initialCity = await citiesCollection.findOne({ slug: citySlug });
    currentCity = castDbData(initialCity);
  }
  if (!currentCity) {
    const initialCity = await citiesCollection.findOne({ slug: DEFAULT_CITY });
    currentCity = currentCity = castDbData(initialCity);
  }
  const sessionCity = currentCity?.slug || DEFAULT_CITY;

  // Domain company
  const domainCompany = await getSsrDomainCompany({
    slug: `${params?.companySlug}`,
  });

  // Page initial data
  const rawInitialData = await getPageInitialData({
    locale: sessionLocale,
    citySlug: sessionCity,
    companySlug: domainCompany ? domainCompany.slug : DEFAULT_COMPANY_SLUG,
  });
  const initialData = castDbData(rawInitialData);

  // Site theme accent color
  const themeColor = rawInitialData.configs.siteThemeColor;
  const fallbackColor = `219, 83, 96`;
  const themeRGB = themeColor ? themeColor.split(',').map((num) => noNaN(num)) : fallbackColor;
  const toShort = themeRGB.length < 3;
  const finalThemeColor = toShort ? fallbackColor : themeColor;

  const themeR = toShort ? '219' : themeRGB[0];
  const themeG = toShort ? '83' : themeRGB[1];
  const themeB = toShort ? '96' : themeRGB[2];
  const themeStyle = {
    '--theme': `rgb(${finalThemeColor})`,
    '--themeR': `${themeR}`,
    [`--themeG`]: `${themeG}`,
    [`--themeB`]: `${themeB}`,
  };

  return {
    initialData,
    themeStyle,
    urlPrefix: `/${domainCompany?.slug || DEFAULT_COMPANY_SLUG}/${sessionCity}`,
    domainCompany: domainCompany ? castDbData(domainCompany) : null,
    companySlug: domainCompany ? domainCompany.slug : DEFAULT_COMPANY_SLUG,
    sessionCity,
    sessionLocale,
    currentCity: currentCity
      ? {
          ...currentCity,
          name: getI18nLocaleValue(currentCity.nameI18n, sessionLocale),
        }
      : null,
  };
}

export interface GetSiteInitialDataInterface {
  context: IsrContextInterface;
}

export interface SiteInitialDataPropsInterface
  extends PagePropsInterface,
    Omit<SiteLayoutProviderInterface, 'description' | 'title'> {}

export interface SiteInitialDataPayloadInterface {
  props: SiteInitialDataPropsInterface;
}

export async function getIsrSiteInitialData({
  context,
}: GetSiteInitialDataInterface): Promise<SiteInitialDataPayloadInterface> {
  const {
    currentCity,
    sessionCity,
    sessionLocale,
    initialData,
    domainCompany,
    companySlug,
    themeStyle,
    urlPrefix,
  } = await getPageInitialState({ context });

  // initial data
  const rawNavRubrics = await getCatalogueNavRubrics({
    locale: sessionLocale,
    city: sessionCity,
    domainCompany,
    stickyNavVisibleCategoriesCount: initialData.configs.stickyNavVisibleCategoriesCount,
    stickyNavVisibleAttributesCount: initialData.configs.stickyNavVisibleAttributesCount,
    stickyNavVisibleOptionsCount: initialData.configs.stickyNavVisibleOptionsCount,
    visibleCategoriesInNavDropdown: initialData.configs.visibleCategoriesInNavDropdown,
  });
  const navRubrics = castDbData(rawNavRubrics);
  const catalogueCreatedPages = await getCatalogueCreatedPages({
    sessionCity,
    sessionLocale,
    companySlug,
  });

  return {
    props: {
      ...catalogueCreatedPages,
      themeStyle,
      companySlug,
      initialData,
      navRubrics,
      currentCity,
      sessionCity,
      sessionLocale,
      domainCompany,
      urlPrefix,
    },
  };
}
