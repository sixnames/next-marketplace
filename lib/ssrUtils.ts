import {
  CATALOGUE_NAV_VISIBLE_ATTRIBUTES,
  CATALOGUE_NAV_VISIBLE_OPTIONS,
  DEFAULT_COMPANY_SLUG,
  COOKIE_CITY,
  COOKIE_COMPANY_SLUG,
  COOKIE_LOCALE,
  DEFAULT_CITY,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  ROLE_SLUG_ADMIN,
  ROUTE_CONSOLE,
  ROUTE_CONSOLE_NAV_GROUP,
  ROUTE_CMS,
  ROUTE_CMS_NAV_GROUP,
  ROUTE_SIGN_IN,
  SORT_ASC,
  SORT_DESC,
  PAGE_STATE_PUBLISHED,
} from 'config/common';
import {
  COL_CITIES,
  COL_COMPANIES,
  COL_CONFIGS,
  COL_COUNTRIES,
  COL_LANGUAGES,
  COL_NAV_ITEMS,
  COL_PAGES,
  COL_PAGES_GROUP,
  COL_ROLES,
  COL_SHOP_PRODUCTS,
  COL_USERS,
} from 'db/collectionNames';
import { getCatalogueRubricPipeline } from 'db/constantPipelines';
import {
  CityModel,
  CompanyModel,
  ConfigModel,
  CountryModel,
  LanguageModel,
  RubricModel,
  ShopProductModel,
  UserModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  CityInterface,
  ConfigInterface,
  PageInterface,
  PagesGroupInterface,
  RubricInterface,
  UserInterface,
} from 'db/uiInterfaces';
import {
  SiteLayoutCatalogueCreatedPages,
  SiteLayoutProviderInterface,
} from 'layout/SiteLayoutProvider';
import { getCityFieldLocaleString, getFieldStringLocale, getI18nLocaleValue } from 'lib/i18n';
import { getFullName, getShortName } from 'lib/nameUtils';
import { noNaN } from 'lib/numbers';
import { getRubricNavAttributes } from 'lib/rubricUtils';
import { Db, ObjectId } from 'mongodb';
import { GetServerSidePropsContext, Redirect } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';
import { PagePropsInterface } from 'pages/_app';
import { getSubdomain, getDomain } from 'tldts';
import nookies from 'nookies';

export interface GetCatalogueNavRubricsInterface {
  locale: string;
  city: string;
  company?: CompanyModel | null;
}

export const getCatalogueNavRubrics = async ({
  city,
  locale,
  company,
}: GetCatalogueNavRubricsInterface): Promise<RubricModel[]> => {
  // console.log(' ');
  // console.log('=================== getCatalogueNavRubrics =======================');
  // const timeStart = new Date().getTime();
  const { db } = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const companySlug = company?.slug || DEFAULT_COMPANY_SLUG;

  // Get configs
  const catalogueFilterVisibleAttributesCount = await configsCollection.findOne({
    slug: 'stickyNavVisibleAttributesCount',
    companySlug,
  });
  const catalogueFilterVisibleOptionsCount = await configsCollection.findOne({
    slug: 'stickyNavVisibleOptionsCount',
    companySlug,
  });
  const visibleAttributesCount =
    noNaN(catalogueFilterVisibleAttributesCount?.cities[DEFAULT_CITY][DEFAULT_LOCALE][0]) ||
    noNaN(CATALOGUE_NAV_VISIBLE_ATTRIBUTES);
  const visibleOptionsCount =
    noNaN(catalogueFilterVisibleOptionsCount?.cities[DEFAULT_CITY][DEFAULT_LOCALE][0]) ||
    noNaN(CATALOGUE_NAV_VISIBLE_OPTIONS);

  // console.log('Before rubrics', new Date().getTime() - timeStart);

  const sortStage = {
    [`priorities.${companySlug}.${city}`]: SORT_DESC,
    [`views.${companySlug}.${city}`]: SORT_DESC,
    _id: SORT_DESC,
  };

  const rubricsPipeline = getCatalogueRubricPipeline({
    city,
    companySlug,
    visibleAttributesCount,
    visibleOptionsCount,
    viewVariant: 'nav',
  });

  const companyRubricsMatch = company ? { companyId: new ObjectId(company._id) } : {};
  const shopRubricsAggregation = await shopProductsCollection
    .aggregate<RubricInterface>([
      {
        $match: {
          ...companyRubricsMatch,
          citySlug: city,
        },
      },
      {
        $project: {
          selectedOptionsSlugs: true,
          rubricId: true,
        },
      },
      ...rubricsPipeline,
      {
        $sort: sortStage,
      },
      {
        $project: {
          descriptionI18n: false,
          shortDescriptionI18n: false,
          attributesGroupsIds: false,
          views: false,
          priorities: false,
          variantId: false,
        },
      },
    ])
    .toArray();
  // console.log(shopRubricsAggregation);
  // console.log(JSON.stringify(shopRubricsAggregation, null, 2));
  // console.log(JSON.stringify(shopRubricsAggregation[0], null, 2));
  // console.log('After shopRubricsAggregation', new Date().getTime() - timeStart);

  const rubrics: RubricInterface[] = [];
  shopRubricsAggregation.forEach(({ nameI18n, attributes, ...restRubric }) => {
    rubrics.push({
      ...restRubric,
      nameI18n: {},
      name: getI18nLocaleValue<string>(nameI18n, locale),
      attributes: getRubricNavAttributes({
        attributes: attributes || [],
        locale,
      }),
    });
  });

  // console.log('Nav >>>>>>>>>>>>>>>> ', new Date().getTime() - timeStart);

  // return sortedRubrics;
  return rubrics;
};

export interface GetPageInitialDataInterface {
  locale: string;
  city: string;
  companySlug?: string;
}

export interface PageInitialDataPayload {
  configs: ConfigInterface[];
  cities: CityInterface[];
  languages: LanguageModel[];
  currency: string;
}

export const getPageInitialData = async ({
  locale,
  city,
  companySlug,
}: GetPageInitialDataInterface): Promise<PageInitialDataPayload> => {
  // console.log(' ');
  // console.log('=================== getPageInitialData =======================');
  // const timeStart = new Date().getTime();
  const { db } = await getDatabase();

  // configs
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const initialConfigs = await configsCollection
    .aggregate([
      {
        $match: {
          companySlug: companySlug || DEFAULT_COMPANY_SLUG,
        },
      },
      {
        $sort: { _id: SORT_ASC },
      },
    ])
    .toArray();
  const configs = initialConfigs.map((config) => {
    return {
      ...config,
      value: getCityFieldLocaleString({ cityField: config.cities, city, locale }),
      singleValue: getCityFieldLocaleString({ cityField: config.cities, city, locale })[0],
    };
  });
  // console.log('After configs ', new Date().getTime() - timeStart);

  // languages
  const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
  const languages = await languagesCollection
    .find(
      {},
      {
        sort: {
          _id: SORT_ASC,
        },
      },
    )
    .toArray();
  // console.log('After languages ', new Date().getTime() - timeStart);

  // cities
  const citiesCollection = db.collection<CityModel>(COL_CITIES);
  const initialCities = await citiesCollection.find({}, { sort: { _id: SORT_DESC } }).toArray();
  const cities = initialCities.map((city) => {
    return {
      ...city,
      name: getFieldStringLocale(city.nameI18n, locale),
    };
  });
  // console.log('After cities ', new Date().getTime() - timeStart);

  // currency
  const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);
  let currency = DEFAULT_CURRENCY;
  const sessionCity = initialCities.find(({ slug }) => slug === city);
  const country = await countriesCollection.findOne({ citiesIds: sessionCity?._id });
  if (country) {
    currency = country.currency;
  }
  // console.log('After currency ', new Date().getTime() - timeStart);

  return {
    configs,
    languages,
    cities,
    currency,
  };
};

export interface GetPageSessionUserInterface {
  email?: string | null;
  locale: string;
}

export async function getPageSessionUser({
  email,
  locale,
}: GetPageSessionUserInterface): Promise<UserModel | null | undefined> {
  if (!email) {
    return null;
  }

  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const userAggregation = await usersCollection
    .aggregate([
      {
        $match: {
          email,
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
          as: 'role',
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
                let: {
                  allowedAppNavigation: '$allowedAppNavigation',
                  slug: '$slug',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          { $in: ['$path', '$$allowedAppNavigation'] },
                          { $eq: ['$$slug', ROLE_SLUG_ADMIN] },
                        ],
                      },
                      // exclude base paths
                      path: {
                        $nin: [ROUTE_CMS, ROUTE_CONSOLE],
                      },
                    },
                  },
                  {
                    $sort: {
                      index: SORT_ASC,
                    },
                  },
                  {
                    $addFields: {
                      name: `$nameI18n.${locale}`,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                name: `$nameI18n.${locale}`,
                appNavigation: {
                  $filter: {
                    input: '$navItems',
                    as: 'navItem',
                    cond: {
                      $eq: ['$$navItem.navGroup', ROUTE_CONSOLE_NAV_GROUP],
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
          role: { $arrayElemAt: ['$role', 0] },
        },
      },
      {
        $project: {
          password: false,
          createdAt: false,
          updatedAt: false,
        },
      },
    ])
    .toArray();
  const user = userAggregation[0];
  const sessionUser: UserInterface | null = user
    ? {
        ...user,
        fullName: getFullName(user),
        shortName: getShortName(user),
      }
    : null;
  return sessionUser;
}

interface GetPageInitialStateInterface {
  context: GetServerSidePropsContext;
}

interface GetPageInitialStatePayloadInterface extends PagePropsInterface {
  db: Db;
  path: string;
  host: string;
  domain: string | null;
  session: Session | null;
}

export async function getPageInitialState({
  context,
}: GetPageInitialStateInterface): Promise<GetPageInitialStatePayloadInterface> {
  const { locale, resolvedUrl } = context;
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const citiesCollection = db.collection<CityModel>(COL_CITIES);

  const path = `${resolvedUrl}`;
  const host = `${context.req.headers.host}`;
  const subdomain = getSubdomain(host, { validHosts: ['localhost'] });
  const domain = getDomain(host, { validHosts: ['localhost'] });
  const sessionLocale = locale || DEFAULT_LOCALE;

  // Get session
  const session = await getSession(context);
  // Session user
  // const sessionUserStart = new Date().getTime();
  const sessionUser = await getPageSessionUser({
    email: session?.user?.email,
    locale: sessionLocale,
  });
  // console.log(sessionUser);
  // console.log('Session user ', new Date().getTime() - sessionUserStart);

  // Session city
  let currentCity: CityModel | null | undefined;
  if (subdomain) {
    const initialCity = await citiesCollection.findOne({ slug: subdomain });
    currentCity = castDbData(initialCity);
  }
  if (!currentCity) {
    const initialCity = await citiesCollection.findOne({ slug: DEFAULT_CITY });
    currentCity = currentCity = castDbData(initialCity);
  }
  const sessionCity = currentCity?.slug || DEFAULT_CITY;

  // Session company
  let company: CompanyModel | null | undefined = null;
  if (domain && process.env.DEFAULT_DOMAIN && domain !== process.env.DEFAULT_DOMAIN) {
    company = await companiesCollection.findOne({ domain });
  }
  // For development
  // company = await companiesCollection.findOne({ slug: 'company_a' });

  // Page initial data
  const rawInitialData = await getPageInitialData({
    locale: sessionLocale,
    city: sessionCity,
    companySlug: company?.slug,
  });
  const initialData = castDbData(rawInitialData);

  // Set company slug as a cookie
  nookies.set(context, COOKIE_COMPANY_SLUG, company ? company.slug : DEFAULT_COMPANY_SLUG, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
  });

  // Set sessionLocale as a cookie
  nookies.set(context, COOKIE_LOCALE, sessionLocale, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
  });

  // Set sessionCity as a cookie
  nookies.set(context, COOKIE_CITY, sessionCity, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
  });

  return {
    db,
    path,
    host,
    domain,
    session,
    initialData,
    company: castDbData(company),
    companySlug: company ? company.slug : DEFAULT_COMPANY_SLUG,
    sessionCity,
    sessionLocale,
    sessionUser,
    currentCity: currentCity
      ? {
          ...currentCity,
          name: getI18nLocaleValue(currentCity.nameI18n, sessionLocale),
        }
      : null,
    pageUrls: {
      canonicalUrl: `https://${host}${path}`,
      siteUrl: `https://${host}`,
      domain: `${domain}`,
    },
  };
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

interface GetCompanyAppInitialDataInterface {
  context: GetServerSidePropsContext;
}

interface GetCompanyAppInitialDataPropsInterface extends PagePropsInterface {
  currentCompany?: CompanyModel;
}

interface GetCompanyAppInitialDataPayloadInterface {
  props?: GetCompanyAppInitialDataPropsInterface;
  redirect?: Redirect;
  notFound?: true;
}

export async function getConsoleInitialData({
  context,
}: GetCompanyAppInitialDataInterface): Promise<GetCompanyAppInitialDataPayloadInterface> {
  const {
    sessionUser,
    pageUrls,
    currentCity,
    sessionCity,
    sessionLocale,
    initialData,
    companySlug,
    session,
  } = await getPageInitialState({ context });

  // Check if user authenticated
  if (!session?.user || !sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  // Check if page is allowed
  const isAllowed = checkPagePermission({
    allowedAppNavItems: sessionUser.role?.allowedAppNavigation,
    url: context.resolvedUrl,
    isCms: false,
  });

  if (!isAllowed || !sessionUser.role || !sessionUser.role.isCompanyStaff) {
    return {
      notFound: true,
    };
  }

  // Get current company
  const currentCompany = (sessionUser.companies || []).find((company) => {
    return company._id.toHexString() === `${context.query.companyId}`;
  });

  return {
    props: {
      companySlug,
      initialData,
      currentCity,
      sessionCity,
      sessionUser: castDbData(sessionUser),
      currentCompany: currentCompany ? castDbData(currentCompany) : null,
      sessionLocale,
      pageUrls,
    },
  };
}

interface GetAppInitialDataInterface {
  context: GetServerSidePropsContext;
}

interface GetAppInitialDataPayloadInterface<T> {
  props?: T;
  redirect?: Redirect;
  notFound?: true;
}

export async function getAppInitialData({
  context,
}: GetAppInitialDataInterface): Promise<GetAppInitialDataPayloadInterface<PagePropsInterface>> {
  const {
    sessionUser,
    pageUrls,
    currentCity,
    sessionCity,
    sessionLocale,
    initialData,
    companySlug,
    session,
  } = await getPageInitialState({ context });

  // Check if user authenticated
  if (!session?.user || !sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  // Check if page is allowed
  const isAllowed = checkPagePermission({
    allowedAppNavItems: sessionUser.role?.allowedAppNavigation,
    url: context.resolvedUrl,
    isCms: true,
  });
  if (!isAllowed && sessionUser.role?.slug !== ROLE_SLUG_ADMIN) {
    return {
      notFound: true,
    };
  }

  if (!sessionUser.role?.isStaff) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      companySlug,
      initialData,
      currentCity,
      sessionCity,
      sessionUser: castDbData(sessionUser),
      sessionLocale,
      pageUrls,
    },
  };
}

export function castDbData(data: any): any {
  return JSON.parse(JSON.stringify(data));
}

interface GetCatalogueCreatedPagesInterface {
  companySlug: string;
  sessionLocale: string;
  sessionCity: string;
}

async function getCatalogueCreatedPages({
  companySlug,
  sessionCity,
  sessionLocale,
}: GetCatalogueCreatedPagesInterface): Promise<SiteLayoutCatalogueCreatedPages> {
  const { db } = await getDatabase();
  const pageGroupsCollection = db.collection<PagesGroupInterface>(COL_PAGES_GROUP);
  const pageGroupsAggregationInterface = await pageGroupsCollection
    .aggregate([
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
                citySlug: sessionCity,
                state: PAGE_STATE_PUBLISHED,
                $expr: {
                  $eq: ['$pagesGroupId', '$$pagesGroupId'],
                },
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
        const content = JSON.parse(page.content);
        if ((content.rows || []).length < 1) {
          return acc;
        }

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
    Omit<SiteLayoutProviderInterface, 'description' | 'title'> {}

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
    pageUrls,
    currentCity,
    sessionCity,
    sessionLocale,
    initialData,
    company,
    sessionUser,
    companySlug,
  } = await getPageInitialState({ context });

  // initial data
  const rawNavRubrics = await getCatalogueNavRubrics({
    locale: sessionLocale,
    city: sessionCity,
    company,
  });
  const navRubrics = castDbData(rawNavRubrics);
  const catalogueCreatedPages = await getCatalogueCreatedPages({
    sessionCity,
    sessionLocale,
    companySlug,
  });

  // console.log('getSiteInitialData total time ', new Date().getTime() - timeStart);

  return {
    props: {
      ...catalogueCreatedPages,
      companySlug,
      initialData,
      navRubrics,
      currentCity,
      sessionCity,
      sessionLocale,
      company,
      pageUrls,
      sessionUser: castDbData(sessionUser),
    },
  };
}
