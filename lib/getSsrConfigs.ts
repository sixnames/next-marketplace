import {
  CATALOGUE_PRODUCTS_LIMIT,
  CONFIG_GROUP_PROJECT,
  DEFAULT_COMPANY_SLUG,
} from '../config/common';
import { COL_CONFIGS, COL_SHOPS } from '../db/collectionNames';
import { ConfigModel, ShopModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import { SsrConfigsInterface } from '../db/uiInterfaces';
import {
  castConfigs,
  getConfigBooleanValue,
  getConfigListValue,
  getConfigNumberValue,
  getConfigStringValue,
} from './configsUtils';
import { GetPageInitialDataCommonInterface } from './ssrUtils';

export const getSsrConfigs = async ({
  locale,
  citySlug,
  companySlug,
}: GetPageInitialDataCommonInterface): Promise<SsrConfigsInterface> => {
  const { db } = await getDatabase();
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const companyShopsCount = await shopsCollection.countDocuments({
    companySlug,
    citySlug,
  });
  const minimalShopsCount = 2;
  const isOneShopCompany =
    companySlug === DEFAULT_COMPANY_SLUG ? false : companyShopsCount < minimalShopsCount;

  const projectConfigs = await configsCollection
    .aggregate<ConfigModel>([
      {
        $match: {
          group: CONFIG_GROUP_PROJECT,
          companySlug: DEFAULT_COMPANY_SLUG,
        },
      },
    ])
    .toArray();

  const companyConfigs = await configsCollection
    .aggregate<ConfigModel>([
      {
        $match: {
          group: {
            $ne: CONFIG_GROUP_PROJECT,
          },
          companySlug: companySlug || DEFAULT_COMPANY_SLUG,
          slug: {
            $nin: ['smsApiKey', 'smsApiEmail', 'emailApiHost', 'emailApiLogin', 'emailApiPassword'],
          },
        },
      },
    ])
    .toArray();

  const initialConfigs = [...companyConfigs, ...projectConfigs];
  const configs = castConfigs({
    configs: initialConfigs,
    locale,
    citySlug,
  });

  // get configs
  const actualAddress = getConfigStringValue({
    configs,
    slug: 'actualAddress',
  });
  const androidChrome192 = getConfigStringValue({
    configs,
    slug: 'android-chrome-192x192',
  });
  const androidChrome512 = getConfigStringValue({
    configs,
    slug: 'android-chrome-512x512',
  });
  const appleTouchIcon = getConfigStringValue({
    configs,
    slug: 'apple-touch-icon',
  });
  const cardListFeaturesCount =
    getConfigNumberValue({
      configs,
      slug: 'cardListFeaturesCount',
    }) || 5;
  const catalogueFilterVisibleAttributesCount =
    getConfigNumberValue({
      configs,
      slug: 'catalogueFilterVisibleAttributesCount',
    }) || 10;
  const catalogueFilterVisibleOptionsCount =
    getConfigNumberValue({
      configs,
      slug: 'catalogueFilterVisibleOptionsCount',
    }) || 5;
  const contactEmail = getConfigListValue({
    configs,
    slug: 'contactEmail',
  });
  const robotsTxt = getConfigListValue({
    configs,
    slug: 'robotsTxt',
  });
  const contactsContent = getConfigStringValue({
    configs,
    slug: 'contactsContent',
  });
  const facebook = getConfigStringValue({
    configs,
    slug: 'facebook',
  });
  const faviconIco = getConfigStringValue({
    configs,
    slug: 'favicon-ico',
  });
  const googleAnalytics = getConfigStringValue({
    configs,
    slug: 'googleAnalytics',
  });
  const headerTopBarBgDarkTheme = getConfigStringValue({
    configs,
    slug: 'headerTopBarBgDarkTheme',
  });
  const headerTopBarTextDarkTheme = getConfigStringValue({
    configs,
    slug: 'headerTopBarTextDarkTheme',
  });
  const headerTopBarTextLightTheme = getConfigStringValue({
    configs,
    slug: 'headerTopBarTextLightTheme',
  });
  const iconSvg = getConfigStringValue({
    configs,
    slug: 'icon-svg',
  });
  const instagram = getConfigStringValue({
    configs,
    slug: 'instagram',
  });
  const mainBannerAutoplaySpeed =
    getConfigNumberValue({
      configs,
      slug: 'mainBannerAutoplaySpeed',
    }) || 5000;
  const odnoklassniki = getConfigStringValue({
    configs,
    slug: 'odnoklassniki',
  });
  const pageDefaultDescription = getConfigStringValue({
    configs,
    slug: 'pageDefaultDescription',
  });
  const pageDefaultPreviewImage = getConfigStringValue({
    configs,
    slug: 'pageDefaultPreviewImage',
  });
  const pageDefaultTitle = getConfigStringValue({
    configs,
    slug: 'pageDefaultTitle',
  });
  const phone = getConfigListValue({
    configs,
    slug: 'phone',
  });
  const seoText = getConfigStringValue({
    configs,
    slug: 'seoText',
  });
  const seoTextBottom = getConfigStringValue({
    configs,
    slug: 'seoTextBottom',
  });
  const seoTextTitle = getConfigStringValue({
    configs,
    slug: 'seoTextTitle',
  });
  const showAdultModal = getConfigBooleanValue({ configs, slug: 'showAdultModal' });
  const showBlog = getConfigBooleanValue({ configs, slug: 'showBlog' });
  const showBlogPostViews = getConfigBooleanValue({ configs, slug: 'showBlogPostViews' });
  const showCardArticle = getConfigBooleanValue({ configs, slug: 'showCardArticle' });
  const siteFoundationYear = getConfigNumberValue({
    configs,
    slug: 'siteFoundationYear',
  });
  const siteLogo = getConfigStringValue({
    configs,
    slug: 'siteLogo',
  });
  const siteLogoDark = getConfigStringValue({
    configs,
    slug: 'siteLogoDark',
  });
  const siteLogoWidth = getConfigStringValue({
    configs,
    slug: 'siteLogoWidth',
  });
  const siteMobileLogoWidth = getConfigStringValue({
    configs,
    slug: 'siteMobileLogoWidth',
  });
  const siteName = getConfigStringValue({
    configs,
    slug: 'siteName',
  });
  const siteNavBarBgDarkTheme = getConfigStringValue({
    configs,
    slug: 'siteNavBarBgDarkTheme',
  });
  const siteNavBarBgLightTheme = getConfigStringValue({
    configs,
    slug: 'siteNavBarBgLightTheme',
  });
  const siteNavBarTextDarkTheme = getConfigStringValue({
    configs,
    slug: 'siteNavBarTextDarkTheme',
  });
  const siteNavBarTextLightTheme = getConfigStringValue({
    configs,
    slug: 'siteNavBarTextLightTheme',
  });
  const siteNavDropdownAttributeDarkTheme = getConfigStringValue({
    configs,
    slug: 'siteNavDropdownAttributeDarkTheme',
  });
  const siteNavDropdownAttributeLightTheme = getConfigStringValue({
    configs,
    slug: 'siteNavDropdownAttributeLightTheme',
  });
  const siteNavDropdownBgDarkTheme = getConfigStringValue({
    configs,
    slug: 'siteNavDropdownBgDarkTheme',
  });
  const siteNavDropdownBgLightTheme = getConfigStringValue({
    configs,
    slug: 'siteNavDropdownBgLightTheme',
  });
  const siteNavDropdownTextDarkTheme = getConfigStringValue({
    configs,
    slug: 'siteNavDropdownTextDarkTheme',
  });
  const siteNavDropdownTextLightTheme = getConfigStringValue({
    configs,
    slug: 'siteNavDropdownTextLightTheme',
  });
  const siteThemeColor = getConfigStringValue({
    configs,
    slug: 'siteThemeColor',
  });
  const siteTopBarBgLightTheme = getConfigStringValue({
    configs,
    slug: 'siteTopBarBgLightTheme',
  });
  const snippetAttributesCount =
    getConfigNumberValue({
      configs,
      slug: 'snippetAttributesCount',
    }) || 5;
  const stickyNavVisibleAttributesCount =
    getConfigNumberValue({
      configs,
      slug: 'stickyNavVisibleAttributesCount',
    }) || 5;
  const stickyNavVisibleCategoriesCount =
    getConfigNumberValue({
      configs,
      slug: 'stickyNavVisibleCategoriesCount',
    }) || 4;
  const stickyNavVisibleSubCategoriesCount =
    getConfigNumberValue({
      configs,
      slug: 'stickyNavVisibleSubCategoriesCount',
    }) || 5;
  const stickyNavVisibleOptionsCount =
    getConfigNumberValue({
      configs,
      slug: 'stickyNavVisibleOptionsCount',
    }) || 5;
  const telegram = getConfigStringValue({
    configs,
    slug: 'telegram',
  });
  const twitter = getConfigStringValue({
    configs,
    slug: 'twitter',
  });
  const vkontakte = getConfigStringValue({
    configs,
    slug: 'vkontakte',
  });
  const yaMetrica = getConfigStringValue({
    configs,
    slug: 'yaMetrica',
  });
  const yaVerification = getConfigStringValue({
    configs,
    slug: 'yaVerification',
  });
  const youtube = getConfigStringValue({
    configs,
    slug: 'youtube',
  });
  const buyButtonText = getConfigStringValue({
    configs,
    slug: 'buyButtonText',
  });
  const mapMarkerDarkTheme = getConfigStringValue({
    configs,
    slug: 'mapMarkerDarkTheme',
  });
  const mapMarkerLightTheme = getConfigStringValue({
    configs,
    slug: 'mapMarkerLightTheme',
  });
  const showReservationDate = getConfigBooleanValue({
    configs,
    slug: 'showReservationDate',
  });
  const useNoIndexRules = getConfigBooleanValue({
    configs,
    slug: 'useNoIndexRules',
  });
  const visibleCategoriesInNavDropdown = getConfigListValue({
    configs,
    slug: 'visibleCategoriesInNavDropdown',
  });
  const categoriesAsNavItems = getConfigListValue({
    configs,
    slug: 'categoriesAsNavItems',
  });
  const cartBookingButtonDescription = getConfigStringValue({
    configs,
    slug: 'cartBookingButtonDescription',
  });
  const catalogueProductsCount =
    getConfigNumberValue({
      configs,
      slug: 'catalogueProductsCount',
    }) || CATALOGUE_PRODUCTS_LIMIT;
  const chat = getConfigStringValue({
    configs,
    slug: 'chat',
  });
  const showShopProductAvailability = getConfigBooleanValue({
    configs,
    slug: 'showShopProductAvailability',
  });
  const catalogueTitleMetaPrefix = getConfigStringValue({
    configs,
    slug: 'catalogueTitleMetaPrefix',
  });
  const catalogueDescriptionMetaPrefix = getConfigStringValue({
    configs,
    slug: 'catalogueDescriptionMetaPrefix',
  });
  const catalogueTitleMetaPostfix = getConfigStringValue({
    configs,
    slug: 'catalogueTitleMetaPostfix',
  });
  const catalogueDescriptionMetaPostfix = getConfigStringValue({
    configs,
    slug: 'catalogueDescriptionMetaPostfix',
  });
  const cardTitleMetaPrefix = getConfigStringValue({
    configs,
    slug: 'cardTitleMetaPrefix',
  });
  const cardDescriptionMetaPrefix = getConfigStringValue({
    configs,
    slug: 'cardDescriptionMetaPrefix',
  });
  const cardTitleMetaPostfix = getConfigStringValue({
    configs,
    slug: 'cardTitleMetaPostfix',
  });
  const cardDescriptionMetaPostfix = getConfigStringValue({
    configs,
    slug: 'cardDescriptionMetaPostfix',
  });
  const catalogueTitleMetaMiddle = getConfigStringValue({
    configs,
    slug: 'catalogueTitleMetaMiddle',
  });
  const catalogueDescriptionMetaMiddle = getConfigStringValue({
    configs,
    slug: 'catalogueDescriptionMetaMiddle',
  });
  const cardTitleMetaMiddle = getConfigStringValue({
    configs,
    slug: 'cardTitleMetaMiddle',
  });
  const cardDescriptionMetaMiddle = getConfigStringValue({
    configs,
    slug: 'cardDescriptionMetaMiddle',
  });
  const contactsTitle = getConfigStringValue({
    configs,
    slug: 'contactsTitle',
  });
  const contactsMetaTitle = getConfigStringValue({
    configs,
    slug: 'contactsMetaTitle',
  });
  const contactsMetaDescription = getConfigStringValue({
    configs,
    slug: 'contactsMetaDescription',
  });
  const blogTitlePrefix = getConfigStringValue({
    configs,
    slug: 'blogTitlePrefix',
  });
  const blogTitlePostfix = getConfigStringValue({
    configs,
    slug: 'blogTitlePostfix',
  });
  const blogTitleMetaPrefix = getConfigStringValue({
    configs,
    slug: 'blogTitleMetaPrefix',
  });
  const blogTitleMetaPostfix = getConfigStringValue({
    configs,
    slug: 'blogTitleMetaPostfix',
  });
  const blogDescriptionMetaPrefix = getConfigStringValue({
    configs,
    slug: 'blogDescriptionMetaPrefix',
  });
  const blogDescriptionMetaPostfix = getConfigStringValue({
    configs,
    slug: 'blogDescriptionMetaPostfix',
  });
  const ipRegistryApiKey = getConfigStringValue({
    configs,
    slug: 'ipRegistryApiKey',
  });

  return {
    ipRegistryApiKey,
    contactsTitle,
    contactsMetaTitle,
    contactsMetaDescription,
    blogTitlePrefix,
    blogTitlePostfix,
    blogTitleMetaPrefix,
    blogTitleMetaPostfix,
    blogDescriptionMetaPrefix,
    blogDescriptionMetaPostfix,
    showShopProductAvailability,
    catalogueTitleMetaMiddle,
    catalogueDescriptionMetaMiddle,
    cardTitleMetaMiddle,
    cardDescriptionMetaMiddle,
    catalogueTitleMetaPrefix,
    catalogueTitleMetaPostfix,
    catalogueDescriptionMetaPrefix,
    catalogueDescriptionMetaPostfix,
    cardTitleMetaPrefix,
    cardTitleMetaPostfix,
    cardDescriptionMetaPrefix,
    cardDescriptionMetaPostfix,
    chat,
    isOneShopCompany,
    useNoIndexRules,
    categoriesAsNavItems,
    seoTextBottom,
    robotsTxt,
    cartBookingButtonDescription,
    catalogueProductsCount,
    showReservationDate,
    mapMarkerDarkTheme,
    mapMarkerLightTheme,
    actualAddress,
    androidChrome192,
    androidChrome512,
    appleTouchIcon,
    cardListFeaturesCount,
    catalogueFilterVisibleAttributesCount,
    catalogueFilterVisibleOptionsCount,
    stickyNavVisibleCategoriesCount,
    stickyNavVisibleSubCategoriesCount,
    visibleCategoriesInNavDropdown,
    contactEmail,
    contactsContent,
    facebook,
    faviconIco,
    googleAnalytics,
    headerTopBarBgDarkTheme,
    headerTopBarTextDarkTheme,
    headerTopBarTextLightTheme,
    iconSvg,
    instagram,
    mainBannerAutoplaySpeed,
    odnoklassniki,
    pageDefaultDescription,
    pageDefaultPreviewImage,
    pageDefaultTitle,
    phone,
    seoText,
    seoTextTitle,
    showAdultModal,
    showBlog,
    showBlogPostViews,
    showCardArticle,
    siteFoundationYear,
    siteLogo,
    siteLogoDark,
    siteLogoWidth,
    siteMobileLogoWidth,
    siteName,
    siteNavBarBgDarkTheme,
    siteNavBarBgLightTheme,
    siteNavBarTextDarkTheme,
    siteNavBarTextLightTheme,
    siteNavDropdownAttributeDarkTheme,
    siteNavDropdownAttributeLightTheme,
    siteNavDropdownBgDarkTheme,
    siteNavDropdownBgLightTheme,
    siteNavDropdownTextDarkTheme,
    siteNavDropdownTextLightTheme,
    siteThemeColor,
    siteTopBarBgLightTheme,
    snippetAttributesCount,
    stickyNavVisibleAttributesCount,
    stickyNavVisibleOptionsCount,
    telegram,
    twitter,
    vkontakte,
    yaMetrica,
    yaVerification,
    youtube,
    buyButtonText,
  };
};
