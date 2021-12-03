import {
  CATALOGUE_PRODUCTS_LIMIT,
  COOKIE_CITY,
  COOKIE_COMPANY_SLUG,
  COOKIE_CURRENCY,
  COOKIE_LOCALE,
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
} from 'config/common';
import { CityInterface, CompanyInterface, SsrConfigsInterface } from 'db/uiInterfaces';
import { useRouter } from 'next/router';
import * as React from 'react';
import { setCookie, destroyCookie } from 'nookies';

interface ConfigContextInterface {
  configs: SsrConfigsInterface;
  cities: CityInterface[];
  currentCity?: CityInterface | null;
  domainCompany?: CompanyInterface | null;
}

const ConfigContext = React.createContext<ConfigContextInterface>({
  cities: [],
  configs: {
    isOneShopCompany: true,
    siteName: '',
    siteFoundationYear: 0,
    yaVerification: '',
    yaMetrica: '',
    googleAnalytics: '',
    siteLogo: '',
    siteLogoDark: '',
    siteLogoWidth: '',
    siteMobileLogoWidth: '',
    siteThemeColor: '',
    siteTopBarBgLightTheme: '',
    headerTopBarBgDarkTheme: '',
    headerTopBarTextLightTheme: '',
    headerTopBarTextDarkTheme: '',
    siteNavBarBgLightTheme: '',
    siteNavBarBgDarkTheme: '',
    siteNavBarTextLightTheme: '',
    siteNavBarTextDarkTheme: '',
    siteNavDropdownBgLightTheme: '',
    siteNavDropdownBgDarkTheme: '',
    siteNavDropdownTextLightTheme: '',
    siteNavDropdownTextDarkTheme: '',
    siteNavDropdownAttributeLightTheme: '',
    siteNavDropdownAttributeDarkTheme: '',
    showAdultModal: false,
    showBlog: false,
    showBlogPostViews: false,
    contactEmail: [],
    phone: [],
    robotsTxt: [],
    facebook: '',
    instagram: '',
    vkontakte: '',
    odnoklassniki: '',
    youtube: '',
    twitter: '',
    telegram: '',
    pageDefaultPreviewImage: '',
    androidChrome192: '',
    androidChrome512: '',
    appleTouchIcon: '',
    faviconIco: '',
    iconSvg: '',
    contactsContent: '',
    actualAddress: '',
    pageDefaultTitle: '',
    pageDefaultDescription: '',
    seoTextTitle: '',
    seoText: '',
    mainBannerAutoplaySpeed: 5000,
    showCardArticle: true,
    stickyNavVisibleAttributesCount: 5,
    stickyNavVisibleOptionsCount: 5,
    catalogueFilterVisibleAttributesCount: 5,
    catalogueFilterVisibleOptionsCount: 5,
    stickyNavVisibleCategoriesCount: 4,
    stickyNavVisibleSubCategoriesCount: 5,
    snippetAttributesCount: 5,
    cardListFeaturesCount: 5,
    catalogueMetaPrefix: '',
    cardMetaPrefix: '',
    mapMarkerDarkTheme: '',
    mapMarkerLightTheme: '',
    showReservationDate: false,
    buyButtonText: '',
    visibleCategoriesInNavDropdown: [],
    cartBookingButtonDescription: '',
    catalogueProductsCount: CATALOGUE_PRODUCTS_LIMIT,
  },
});

const ConfigContextProvider: React.FC<ConfigContextInterface> = ({
  configs,
  cities = [],
  currentCity,
  children,
  domainCompany,
}) => {
  const { locale } = useRouter();

  // set session cookies
  React.useEffect(() => {
    const cookieOptions = {
      path: '/',
    };

    // set company slug as a cookie
    const domainCompanySlug = domainCompany?.slug || DEFAULT_COMPANY_SLUG;
    destroyCookie(null, COOKIE_COMPANY_SLUG);
    setCookie(null, COOKIE_COMPANY_SLUG, domainCompanySlug, cookieOptions);

    // set locale as a cookie
    const sessionLocale = locale || DEFAULT_LOCALE;
    destroyCookie(null, COOKIE_LOCALE);
    setCookie(null, COOKIE_LOCALE, sessionLocale, cookieOptions);

    // set city slug as a cookie
    const sessionCity = currentCity?.slug || DEFAULT_CITY;
    destroyCookie(null, COOKIE_CITY);
    setCookie(null, COOKIE_CITY, sessionCity, cookieOptions);

    // set currency as a cookie
    const sessionCurrency = currentCity?.currency || DEFAULT_CURRENCY;
    destroyCookie(null, COOKIE_CURRENCY);
    setCookie(null, COOKIE_CURRENCY, sessionCurrency, cookieOptions);
  }, [currentCity, domainCompany, locale]);

  const initialValue = React.useMemo(() => {
    return {
      configs,
      cities,
      currentCity,
      domainCompany,
    };
  }, [currentCity, configs, cities, domainCompany]);

  return <ConfigContext.Provider value={initialValue}>{children}</ConfigContext.Provider>;
};

function useConfigContext() {
  const context = React.useContext<ConfigContextInterface>(ConfigContext);
  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigContextProvider');
  }

  return context;
}

export { ConfigContextProvider, useConfigContext };
