import { GetServerSidePropsContext, Redirect } from 'next';
import {
  DEFAULT_COMPANY_SLUG,
  PAGE_STATE_PUBLISHED,
  ROLE_SLUG_ADMIN,
  ROUTE_CMS,
  ROUTE_SIGN_IN,
  SORT_ASC,
} from '../config/common';
import { COL_PAGES, COL_PAGES_GROUP } from '../db/collectionNames';
import { getCatalogueNavRubrics } from '../db/dao/ssr/getCatalogueNavRubrics';
import { getPageSessionUser, SessionUserPayloadInterface } from '../db/dao/user/getPageSessionUser';
import { getDatabase } from '../db/mongodb';
import { CompanyInterface, PageInterface, PagesGroupInterface } from '../db/uiInterfaces';
import { SiteLayoutCatalogueCreatedPages, SiteLayoutProviderInterface } from '../layout/SiteLayout';
import { PagePropsInterface } from '../pages/_app';
import { getPageCompanySsr } from './getPageCompanySsr';
import { getI18nLocaleValue } from './i18n';

export interface GetPageInitialDataCommonInterface {
  locale: string;
  citySlug: string;
  companySlug?: string;
}

interface CheckPagePermissionInterface {
  allowedAppNavItems?: string[];
  url: string;
  isCms: boolean;
}
function checkPagePermission({
  allowedAppNavItems,
  url,
  isCms,
}: CheckPagePermissionInterface): boolean {
  const excludedExtension = '.json';
  const initialAllowedAppNavItems = allowedAppNavItems || [];
  let finalUrl = url;

  // Check cms root url
  if (isCms) {
    const cmsRootUrlList = finalUrl.split(ROUTE_CMS);
    if (!cmsRootUrlList[1] || cmsRootUrlList[1] === excludedExtension) {
      return initialAllowedAppNavItems.includes(ROUTE_CMS);
    }
  }

  // Check console root url
  if (!isCms) {
    finalUrl = `/${url.split('/').slice(3).join('/')}`;
  }

  // Check nested urls
  const finalAllowedAppNavItems = initialAllowedAppNavItems.filter((path) => {
    return path !== ROUTE_CMS && path !== '';
  });

  if (finalUrl === '/') {
    return true;
  }

  return finalAllowedAppNavItems.some((path) => {
    const reg = RegExp(path);
    return reg.test(finalUrl);
  });
}

interface GetConsoleInitialDataInterface {
  context: GetServerSidePropsContext;
}

interface GetConsoleInitialDataLayoutProps {
  pageCompany: CompanyInterface;
  sessionUser: SessionUserPayloadInterface;
}

// console props
export interface GetConsoleInitialDataPropsInterface extends PagePropsInterface {
  layoutProps: GetConsoleInitialDataLayoutProps;
}

interface GetConsoleInitialDataPayloadInterface {
  props?: GetConsoleInitialDataPropsInterface;
  redirect?: Redirect;
  notFound?: true;
}

export async function getConsoleInitialData({
  context,
}: GetConsoleInitialDataInterface): Promise<GetConsoleInitialDataPayloadInterface> {
  const { currentCity, citySlug, sessionLocale, initialData, companySlug, themeStyle } =
    await getPageCompanySsr({ context });

  // Session user
  const sessionUser = await getPageSessionUser({
    context,
    locale: sessionLocale,
  });

  // Check if user authenticated
  if (!sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  // Check if page is allowed
  const isAllowed = checkPagePermission({
    allowedAppNavItems: sessionUser?.me.role?.allowedAppNavigation,
    url: context.resolvedUrl,
    isCms: false,
  });

  if (!isAllowed || !sessionUser?.me.role || !sessionUser?.me.role.isCompanyStaff) {
    return {
      notFound: true,
    };
  }

  // Get current company
  const companies = sessionUser?.me.companies || [];
  if (companies.length < 1) {
    return {
      notFound: true,
    };
  }

  const pageCompany = companies.find((company) => {
    return company._id.toHexString() === `${context.query.companyId}`;
  });
  if (!pageCompany) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  return {
    props: {
      layoutProps: {
        sessionUser: castDbData(sessionUser),
        pageCompany: castDbData(pageCompany),
      },
      companySlug,
      initialData,
      currentCity,
      citySlug: citySlug,
      themeStyle,
      sessionLocale,
    },
  };
}

interface GetConsoleMainPageDataInterface {
  context: GetServerSidePropsContext;
}

interface GetConsoleMainPageDataLayoutProps {
  sessionUser: SessionUserPayloadInterface;
}

// console main page props
export interface GetConsoleMainPageDataPropsInterface extends PagePropsInterface {
  layoutProps: GetConsoleMainPageDataLayoutProps;
}

interface GetConsoleMainPageDataPayloadInterface {
  props?: GetConsoleMainPageDataPropsInterface;
  redirect?: Redirect;
  notFound?: true;
}

export async function getConsoleMainPageData({
  context,
}: GetConsoleMainPageDataInterface): Promise<GetConsoleMainPageDataPayloadInterface> {
  const { currentCity, citySlug, sessionLocale, initialData, companySlug, themeStyle } =
    await getPageCompanySsr({ context });

  // Session user
  const sessionUser = await getPageSessionUser({
    context,
    locale: sessionLocale,
  });

  // Check if user authenticated
  if (!sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  // Check if page is allowed
  const isAllowed = checkPagePermission({
    allowedAppNavItems: sessionUser?.me.role?.allowedAppNavigation,
    url: context.resolvedUrl,
    isCms: false,
  });

  if (!isAllowed || !sessionUser?.me.role || !sessionUser?.me.role.isCompanyStaff) {
    return {
      notFound: true,
    };
  }

  // Get current company
  const companies = sessionUser?.me.companies || [];
  if (companies.length < 1) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      layoutProps: {
        sessionUser: castDbData(sessionUser),
      },
      companySlug,
      initialData,
      currentCity,
      citySlug: citySlug,
      themeStyle,
      sessionLocale,
    },
  };
}

interface GetAppInitialDataInterface {
  context: GetServerSidePropsContext;
}

interface GetAppInitialDataLayoutProps {
  sessionUser: SessionUserPayloadInterface;
}

// cms props
export interface GetAppInitialDataPropsInterface extends PagePropsInterface {
  layoutProps: GetAppInitialDataLayoutProps;
}

interface GetAppInitialDataPayloadInterface {
  props?: GetAppInitialDataPropsInterface;
  redirect?: Redirect;
  notFound?: true;
}

export async function getAppInitialData({
  context,
}: GetAppInitialDataInterface): Promise<GetAppInitialDataPayloadInterface> {
  const { currentCity, citySlug, sessionLocale, initialData, companySlug, themeStyle } =
    await getPageCompanySsr({ context });

  // Session user
  const sessionUser = await getPageSessionUser({
    context,
    locale: sessionLocale,
  });

  // Check if user authenticated
  if (!sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  // Check if page is allowed
  const isAllowed = checkPagePermission({
    allowedAppNavItems: sessionUser?.me.role?.allowedAppNavigation,
    url: context.resolvedUrl,
    isCms: true,
  });
  if (!isAllowed && sessionUser?.me.role?.slug !== ROLE_SLUG_ADMIN) {
    return {
      notFound: true,
    };
  }

  if (!sessionUser?.me.role?.isStaff) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      layoutProps: {
        sessionUser: castDbData(sessionUser),
      },
      themeStyle,
      companySlug,
      initialData,
      currentCity,
      citySlug,
      sessionLocale,
    },
  };
}

export function castDbData(data: any): any {
  return JSON.parse(JSON.stringify(data));
}

interface GetCatalogueCreatedPagesInterface {
  companySlug: string;
  sessionLocale: string;
  citySlug: string;
}

export async function getCatalogueCreatedPages({
  companySlug,
  citySlug,
  sessionLocale,
}: GetCatalogueCreatedPagesInterface): Promise<SiteLayoutCatalogueCreatedPages> {
  const { db } = await getDatabase();
  const pageGroupsCollection = db.collection<PagesGroupInterface>(COL_PAGES_GROUP);
  const pageGroupsAggregationInterface = await pageGroupsCollection
    .aggregate<PagesGroupInterface>([
      {
        $match: {
          companySlug,
        },
      },
      {
        $sort: {
          index: SORT_ASC,
        },
      },
      {
        $lookup: {
          from: COL_PAGES,
          as: 'pages',
          let: {
            pagesGroupId: '$_id',
          },
          pipeline: [
            {
              $match: {
                citySlug: citySlug,
                state: PAGE_STATE_PUBLISHED,
                $expr: {
                  $eq: ['$pagesGroupId', '$$pagesGroupId'],
                },
              },
            },
            {
              $project: {
                _id: true,
                index: true,
                nameI18n: true,
                slug: true,
                mainBanner: true,
                mainBannerMobile: true,
                showAsMainBanner: true,
                mainBannerTextColor: true,
                mainBannerVerticalTextAlign: true,
                mainBannerHorizontalTextAlign: true,
                mainBannerTextAlign: true,
                mainBannerTextPadding: true,
                mainBannerTextMaxWidth: true,
                secondaryBanner: true,
                showAsSecondaryBanner: true,
                secondaryBannerTextColor: true,
                secondaryBannerVerticalTextAlign: true,
                secondaryBannerHorizontalTextAlign: true,
                secondaryBannerTextAlign: true,
                secondaryBannerTextPadding: true,
                secondaryBannerTextMaxWidth: true,
              },
            },
            {
              $sort: {
                index: SORT_ASC,
              },
            },
          ],
        },
      },
    ])
    .toArray();

  const initialHeaderPageGroups: PagesGroupInterface[] = [];
  const initialFooterPageGroups: PagesGroupInterface[] = [];

  pageGroupsAggregationInterface.forEach((pagesGroup) => {
    const castedPagesGroup = {
      ...pagesGroup,
      name: getI18nLocaleValue(pagesGroup.nameI18n, sessionLocale),
      pages: (pagesGroup.pages || []).reduce((acc: PageInterface[], page) => {
        return [
          ...acc,
          {
            ...page,
            name: getI18nLocaleValue(page.nameI18n, sessionLocale),
          },
        ];
      }, []),
    };
    if (castedPagesGroup.pages.length < 1) {
      return;
    }

    if (castedPagesGroup.showInHeader) {
      initialHeaderPageGroups.push(castedPagesGroup);
    }

    if (castedPagesGroup.showInFooter) {
      initialFooterPageGroups.push(castedPagesGroup);
    }
  });

  return {
    headerPageGroups: castDbData(initialHeaderPageGroups),
    footerPageGroups: castDbData(initialFooterPageGroups),
  };
}

export interface GetSiteInitialDataInterface {
  context: GetServerSidePropsContext;
}

export interface SiteInitialDataPropsInterface
  extends PagePropsInterface,
    Omit<SiteLayoutProviderInterface, 'description' | 'title' | 'showForIndex'> {
  companyNotFound: boolean;
  domain?: string | null;
}

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
    currentCity,
    citySlug,
    sessionLocale,
    initialData,
    domainCompany,
    companySlug,
    themeStyle,
    companyNotFound,
    domain,
  } = await getPageCompanySsr({ context });

  // initial data
  const rawNavRubrics = await getCatalogueNavRubrics({
    locale: sessionLocale,
    citySlug: citySlug,
    companySlug: domainCompany?.slug || DEFAULT_COMPANY_SLUG,
    stickyNavVisibleCategoriesCount: initialData.configs.stickyNavVisibleCategoriesCount,
    stickyNavVisibleAttributesCount: initialData.configs.stickyNavVisibleAttributesCount,
    stickyNavVisibleOptionsCount: initialData.configs.stickyNavVisibleOptionsCount,
    visibleCategoriesInNavDropdown: initialData.configs.visibleCategoriesInNavDropdown,
  });
  const navRubrics = castDbData(rawNavRubrics);
  const catalogueCreatedPages = await getCatalogueCreatedPages({
    citySlug: citySlug,
    sessionLocale,
    companySlug,
  });

  // console.log('getSiteInitialData total time ', new Date().getTime() - timeStart);

  return {
    props: {
      ...catalogueCreatedPages,
      themeStyle,
      companySlug,
      initialData,
      navRubrics,
      currentCity,
      citySlug: citySlug,
      sessionLocale,
      domainCompany,
      companyNotFound,
      domain,
    },
  };
}
