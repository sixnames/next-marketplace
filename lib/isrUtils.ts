import { GetStaticPropsContext } from 'next';
import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG, DEFAULT_LOCALE } from '../config/common';
import { COL_CITIES } from '../db/collectionNames';
import { CityModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import { SiteLayoutProviderInterface } from '../layout/SiteLayout';
import { PagePropsInterface } from '../pages/_app';
import { alwaysString } from './arrayUtils';
import { getI18nLocaleValue } from './i18n';
import { noNaN } from './numbers';
import {
  castDbData,
  getCatalogueCreatedPages,
  getCatalogueNavRubrics,
  getPageInitialData,
  getSsrDomainCompany,
} from './ssrUtils';

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
  cityNotFound: boolean;
  companyNotFound: boolean;
}

export async function getPageInitialState({
  context,
}: GetPageInitialStateInterface): Promise<GetPageInitialStatePayloadInterface> {
  const { locale, params } = context;
  const { db } = await getDatabase();
  const citiesCollection = db.collection<CityModel>(COL_CITIES);
  const sessionLocale = locale || DEFAULT_LOCALE;
  const citySlug = alwaysString(params?.citySlug);
  const companySlug = alwaysString(params?.companySlug);
  let cityNotFound = false;
  let companyNotFound = false;

  // Session city
  let currentCity: CityModel | null | undefined;
  if (citySlug) {
    const initialCity = await citiesCollection.findOne({ slug: citySlug });
    if (citySlug !== DEFAULT_CITY && !initialCity) {
      cityNotFound = true;
    }
    currentCity = castDbData(initialCity);
  }
  if (!currentCity) {
    const initialCity = await citiesCollection.findOne({ slug: DEFAULT_CITY });
    currentCity = currentCity = castDbData(initialCity);
  }
  const sessionCity = currentCity?.slug || DEFAULT_CITY;

  // Domain company
  const domainCompany = await getSsrDomainCompany({
    slug: companySlug,
  });
  if (companySlug !== DEFAULT_COMPANY_SLUG && !domainCompany) {
    companyNotFound = true;
  }

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
  const themeRGB = `${themeColor}`.split(',').map((num) => noNaN(num));
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
    cityNotFound,
    companyNotFound,
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
    Omit<SiteLayoutProviderInterface, 'description' | 'title' | 'showForIndex'> {}

export interface SiteInitialDataPayloadInterface {
  props: SiteInitialDataPropsInterface;
  redirect?: string | null;
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
    cityNotFound,
    companyNotFound,
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

  let redirect = null;
  if (cityNotFound && companyNotFound) {
    redirect = `/${DEFAULT_COMPANY_SLUG}/${DEFAULT_CITY}`;
  }

  return {
    redirect,
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
