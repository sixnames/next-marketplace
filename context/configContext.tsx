import { CityInterface, SsrConfigsInterface } from 'db/uiInterfaces';
import * as React from 'react';

interface ConfigContextInterface {
  configs: SsrConfigsInterface;
  cities: CityInterface[];
  currentCity?: CityInterface | null;
}

const ConfigContext = React.createContext<ConfigContextInterface>({
  cities: [],
  configs: {
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
    facebook: '',
    instagram: '',
    vkontakte: '',
    odnoklassniki: '',
    youtube: '',
    twitter: '',
    pageDefaultPreviewImage: '',
    androidChrome192: '',
    androidChrome512: '',
    appleTouchIcon: '',
    faviconIco: '',
    iconSvg: '',
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
    snippetAttributesCount: 5,
    cardListFeaturesCount: 5,
    catalogueMetaPrefix: '',
    cardMetaPrefix: '',
    useUniqueConstructor: false,
  },
});

const ConfigContextProvider: React.FC<ConfigContextInterface> = ({
  configs,
  cities = [],
  currentCity,
  children,
}) => {
  const initialValue = React.useMemo(() => {
    return {
      configs,
      cities,
      currentCity,
    };
  }, [currentCity, configs, cities]);

  return <ConfigContext.Provider value={initialValue}>{children}</ConfigContext.Provider>;
};

function useConfigContext() {
  const context = React.useContext(ConfigContext);

  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigContextProvider');
  }

  return context;
}

export { ConfigContextProvider, useConfigContext };
