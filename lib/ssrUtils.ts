import {
  CATALOGUE_NAV_VISIBLE_ATTRIBUTES,
  CATALOGUE_NAV_VISIBLE_OPTIONS,
  CONFIG_DEFAULT_COMPANY_SLUG,
  DEFAULT_CITY,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  ROLE_SLUG_ADMIN,
  ROLE_SLUG_COMPANY_MANAGER,
  ROLE_SLUG_COMPANY_OWNER,
  ROUTE_APP_NAV_GROUP,
  ROUTE_CMS_NAV_GROUP,
  ROUTE_SIGN_IN,
  SORT_ASC,
  SORT_DESC,
} from 'config/common';
import {
  COL_CITIES,
  COL_COMPANIES,
  COL_CONFIGS,
  COL_COUNTRIES,
  COL_LANGUAGES,
  COL_NAV_ITEMS,
  COL_ROLES,
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_USERS,
} from 'db/collectionNames';
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
import { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
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
  const db = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);

  // Get configs
  const catalogueFilterVisibleAttributesCount = await configsCollection.findOne({
    slug: 'stickyNavVisibleAttributesCount',
    companySlug: company?.slug || CONFIG_DEFAULT_COMPANY_SLUG,
  });
  const catalogueFilterVisibleOptionsCount = await configsCollection.findOne({
    slug: 'stickyNavVisibleOptionsCount',
    companySlug: company?.slug || CONFIG_DEFAULT_COMPANY_SLUG,
  });
  const visibleAttributesCount =
    noNaN(catalogueFilterVisibleAttributesCount?.cities[DEFAULT_CITY][DEFAULT_LOCALE][0]) ||
    noNaN(CATALOGUE_NAV_VISIBLE_ATTRIBUTES);
  const visibleOptionsCount =
    noNaN(catalogueFilterVisibleOptionsCount?.cities[DEFAULT_CITY][DEFAULT_LOCALE][0]) ||
    noNaN(CATALOGUE_NAV_VISIBLE_OPTIONS);

  // console.log('Before rubrics', new Date().getTime() - timeStart);

  const companyRubricsMatch = company ? { companyId: new ObjectId(company._id) } : {};
  const shopRubricsAggregation = await shopProductsCollection
    .aggregate<RubricModel>([
      {
        $match: {
          ...companyRubricsMatch,
          citySlug: city,
        },
      },
      {
        $unwind: '$selectedOptionsSlugs',
      },
      {
        $group: {
          _id: '$rubricId',
          selectedOptionsSlugs: {
            $addToSet: '$selectedOptionsSlugs',
          },
        },
      },
      {
        $lookup: {
          from: COL_RUBRICS,
          as: 'rubrics',
          let: { rubricId: '$_id', selectedOptionsSlugs: '$selectedOptionsSlugs' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$rubricId'],
                },
              },
            },
            {
              $sort: {
                priorities: -1,
                views: -1,
              },
            },
            {
              $lookup: {
                from: COL_RUBRIC_ATTRIBUTES,
                as: 'attributes',
                let: { rubricId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$rubricId', '$rubricId'],
                      },
                      showInCatalogueNav: true,
                    },
                  },
                  {
                    $sort: {
                      priorities: -1,
                      views: -1,
                    },
                  },
                  {
                    $project: {
                      variant: false,
                      viewVariant: false,
                      optionsGroupId: false,
                      capitalise: false,
                      positioningInTitle: false,
                      attributeId: false,
                      rubricId: false,
                      showInCatalogueNav: false,
                      showInCatalogueFilter: false,
                      views: false,
                      priorities: false,
                      'options.views': false,
                      'options.priorities': false,
                      'options.variants': false,
                      'options.optionsGroupId': false,
                    },
                  },
                  {
                    $limit: visibleAttributesCount,
                  },
                  {
                    $addFields: {
                      'options.options': [],
                    },
                  },
                  {
                    $addFields: {
                      options: {
                        $filter: {
                          input: '$options',
                          as: 'option',
                          cond: {
                            $in: ['$$option.slug', '$$selectedOptionsSlugs'],
                          },
                        },
                      },
                    },
                  },
                  {
                    $addFields: {
                      options: {
                        $slice: ['$options', visibleOptionsCount],
                      },
                    },
                  },
                ],
              },
            },
            {
              $project: {
                _id: 1,
                slug: 1,
                nameI18n: 1,
                priorities: 1,
                views: 1,
                attributes: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          rubric: { $arrayElemAt: ['$rubrics', 0] },
        },
      },
      {
        $project: {
          rubrics: false,
        },
      },
      { $replaceRoot: { newRoot: '$rubric' } },
    ])
    .toArray();
  // console.log(shopRubricsAggregation);
  // console.log(JSON.stringify(shopRubricsAggregation, null, 2));
  // console.log('After shopRubricsAggregation', new Date().getTime() - timeStart);

  const rubrics: RubricModel[] = [];
  shopRubricsAggregation.forEach(({ nameI18n, attributes, ...restRubric }) => {
    rubrics.push({
      ...restRubric,
      attributes: [],
      nameI18n: {},
      name: getI18nLocaleValue<string>(nameI18n, locale),
      navItems: getRubricNavAttributes({
        attributes,
        locale,
      }),
    });
  });
  const companySlug = company?.slug || CONFIG_DEFAULT_COMPANY_SLUG;
  const sortedRubrics = rubrics.sort((rubricA, rubricB) => {
    const rubricAViews = rubricA.views[companySlug] || { [city]: rubricA._id.getTimestamp() };
    const rubricAPriorities = rubricA.priorities[companySlug] || {
      [city]: rubricA._id.getTimestamp(),
    };
    const rubricBViews = rubricB.views[companySlug] || { [city]: rubricB._id.getTimestamp() };
    const rubricBPriorities = rubricB.priorities[companySlug] || {
      [city]: rubricB._id.getTimestamp(),
    };

    const rubricACounter = noNaN(rubricAViews[city]) + noNaN(rubricAPriorities[city]);
    const rubricBCounter = noNaN(rubricBViews[city]) + noNaN(rubricBPriorities[city]);
    return rubricBCounter - rubricACounter;
  });

  // console.log('Nav >>>>>>>>>>>>>>>> ', new Date().getTime() - timeStart);

  return sortedRubrics;
};

export interface GetPageInitialDataInterface {
  locale: string;
  city: string;
  companySlug?: string;
}

export interface PageInitialDataPayload {
  configs: ConfigModel[];
  cities: CityModel[];
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
  const db = await getDatabase();

  // configs
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const initialConfigs = await configsCollection
    .aggregate([
      {
        $match: {
          companySlug: companySlug || CONFIG_DEFAULT_COMPANY_SLUG,
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

  const db = await getDatabase();
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
          as: 'roles',
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
                let: { allowedAppNavigation: '$allowedAppNavigation', slug: '$slug' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          { $in: ['$_id', '$$allowedAppNavigation'] },
                          { $eq: ['$$slug', ROLE_SLUG_ADMIN] },
                        ],
                      },
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
                      $eq: ['$$navItem.navGroup', ROUTE_APP_NAV_GROUP],
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
          role: { $arrayElemAt: ['$roles', 0] },
        },
      },
      {
        $project: {
          password: false,
          roles: false,
          createdAt: false,
          updatedAt: false,
        },
      },
    ])
    .toArray();
  const user = userAggregation[0];
  const sessionUser: UserModel | null = user
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
  const db = await getDatabase();
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
  // company = await companiesCollection.findOne({ slug: 'alkoliner' });

  // Page initial data
  const rawInitialData = await getPageInitialData({
    locale: sessionLocale,
    city: sessionCity,
    companySlug: company?.slug,
  });
  const initialData = castDbData(rawInitialData);

  return {
    db,
    path,
    host,
    domain,
    session,
    initialData,
    company: castDbData(company),
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

interface GetAppInitialDataInterface {
  context: GetServerSidePropsContext;
  isCms?: boolean;
}

interface GetAppInitialDataPayloadInterface<T> {
  props?: T;
  redirect?: Redirect;
  notFound?: true;
}

export async function getAppInitialData({
  context,
  isCms,
}: GetAppInitialDataInterface): Promise<GetAppInitialDataPayloadInterface<PagePropsInterface>> {
  const {
    sessionUser,
    pageUrls,
    currentCity,
    sessionCity,
    sessionLocale,
    initialData,
    session,
  } = await getPageInitialState({ context });

  // Check if user authenticated
  if (!session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  if (!sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  if (!sessionUser.role || noNaN(sessionUser.companies?.length) < 1) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  if (sessionUser.role.slug !== ROLE_SLUG_ADMIN && isCms) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  if (
    sessionUser.role.slug !== ROLE_SLUG_COMPANY_MANAGER &&
    sessionUser.role.slug !== ROLE_SLUG_COMPANY_OWNER &&
    !isCms
  ) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  return {
    props: {
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
  } = await getPageInitialState({ context });

  // initial data
  const rawNavRubrics = await getCatalogueNavRubrics({
    locale: sessionLocale,
    city: sessionCity,
    company,
  });
  const navRubrics = castDbData(rawNavRubrics);

  // console.log('getSiteInitialData total time ', new Date().getTime() - timeStart);

  return {
    props: {
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
