import { Db, ObjectId } from 'mongodb';
import { GetServerSidePropsContext, Redirect } from 'next';
import { getDomain } from 'tldts';
import {
  CATALOGUE_PRODUCTS_LIMIT,
  CONFIG_GROUP_PROJECT,
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  FILTER_SEPARATOR,
  PAGE_STATE_PUBLISHED,
  ROLE_SLUG_ADMIN,
  ROUTE_CMS,
  ROUTE_SIGN_IN,
  SORT_ASC,
  SORT_DESC,
} from '../config/common';
import {
  COL_ATTRIBUTES,
  COL_CATEGORIES,
  COL_CITIES,
  COL_COMPANIES,
  COL_CONFIGS,
  COL_ICONS,
  COL_LANGUAGES,
  COL_OPTIONS,
  COL_PAGES,
  COL_PAGES_GROUP,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from '../db/collectionNames';
import { castAttributeForUI } from '../db/dao/attributes/castAttributesGroupForUI';
import { ignoreNoImageStage } from '../db/dao/constantPipelines';
import { getPageSessionUser, SessionUserPayloadInterface } from '../db/dao/user/getPageSessionUser';
import {
  AttributeModel,
  CategoryModel,
  CityModel,
  ConfigModel,
  LanguageModel,
  ObjectIdModel,
  RubricModel,
  ShopModel,
  ShopProductModel,
} from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import {
  CityInterface,
  CompanyInterface,
  PageInterface,
  PagesGroupInterface,
  RubricInterface,
  SsrConfigsInterface,
} from '../db/uiInterfaces';
import { SiteLayoutCatalogueCreatedPages, SiteLayoutProviderInterface } from '../layout/SiteLayout';
import { PagePropsInterface } from '../pages/_app';
import { alwaysString } from './arrayUtils';
import {
  castConfigs,
  getConfigBooleanValue,
  getConfigListValue,
  getConfigNumberValue,
  getConfigStringValue,
} from './configsUtils';
import { getFieldStringLocale, getI18nLocaleValue } from './i18n';
import { noNaN } from './numbers';
import { phoneToRaw, phoneToReadable } from './phoneUtils';
import { getTreeFromList } from './treeUtils';

export async function getSsrDomainCompany(
  match: Record<any, any>,
): Promise<CompanyInterface | null> {
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const domainCompanyAggregation = await companiesCollection
    .aggregate<CompanyInterface>([
      {
        $match: match,
      },

      // get main shop
      {
        $lookup: {
          from: COL_SHOPS,
          as: 'mainShop',
          let: { companyId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$companyId', '$companyId'],
                },
              },
            },
            {
              $project: {
                assets: false,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          mainShop: {
            $arrayElemAt: ['$mainShop', 0],
          },
        },
      },
    ])
    .toArray();
  const domainCompany = domainCompanyAggregation[0]
    ? {
        ...domainCompanyAggregation[0],
        mainShop: domainCompanyAggregation[0].mainShop
          ? {
              ...domainCompanyAggregation[0].mainShop,
              contacts: {
                ...domainCompanyAggregation[0].mainShop.contacts,
                formattedPhones: domainCompanyAggregation[0].mainShop.contacts.phones.map(
                  (phone) => {
                    return {
                      raw: phoneToRaw(phone),
                      readable: phoneToReadable(phone),
                    };
                  },
                ),
              },
            }
          : null,
      }
    : null;

  if (!domainCompany?.domain) {
    return null;
  }

  return domainCompany;
}

export interface GetCatalogueNavRubricsInterface {
  locale: string;
  city: string;
  domainCompany?: CompanyInterface | null;
  stickyNavVisibleCategoriesCount: number;
  stickyNavVisibleAttributesCount: number;
  stickyNavVisibleOptionsCount: number;
  visibleCategoriesInNavDropdown: string[];
}

interface CatalogueNavConfigItemInterface {
  attributeSlug: string;
  optionSlug: string;
}

interface CatalogueGroupedNavConfigItemInterface {
  attributeSlug: string;
  optionSlugs: string[];
}

interface CatalogueGroupedNavConfigsInterface {
  _id: ObjectIdModel;
  attributeSlugs: string[];
  attributeConfigs: CatalogueGroupedNavConfigItemInterface[];
}

interface CatalogueNavConfigsInterface {
  _id: ObjectIdModel;
  attributeConfigs: CatalogueNavConfigItemInterface[];
}

interface CatalogueNavCategoriesConfigInterface {
  rubricId: ObjectIdModel;
  categoryIds: ObjectIdModel[];
}

export const getCatalogueNavRubrics = async ({
  city,
  locale,
  domainCompany,
  stickyNavVisibleCategoriesCount,
  stickyNavVisibleAttributesCount,
  stickyNavVisibleOptionsCount,
  visibleCategoriesInNavDropdown,
}: GetCatalogueNavRubricsInterface): Promise<RubricModel[]> => {
  // console.log(' ');
  // console.log('=================== getCatalogueNavRubrics =======================');
  // const timeStart = new Date().getTime();
  const { db } = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
  const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
  const companySlug = domainCompany?.slug || DEFAULT_COMPANY_SLUG;

  // console.log('Before rubrics', new Date().getTime() - timeStart);

  let categoryConfigs: CatalogueNavCategoriesConfigInterface[] = [];
  visibleCategoriesInNavDropdown.forEach((configString) => {
    const configParts = configString.split(FILTER_SEPARATOR);
    const rubricId = configParts[0] ? new ObjectId(`${configParts[0]}`) : null;
    const categoryId = configParts[1] ? new ObjectId(`${configParts[1]}`) : null;
    if (rubricId && categoryId) {
      const existingIndex = categoryConfigs.findIndex((config) => {
        return config.rubricId.equals(rubricId);
      });
      if (existingIndex > -1) {
        categoryConfigs[existingIndex].categoryIds.push(categoryId);
      } else {
        categoryConfigs.push({
          rubricId,
          categoryIds: [categoryId],
        });
      }
    }
  });

  const sortStage = {
    [`priorities.${companySlug}.${city}`]: SORT_DESC,
    [`views.${companySlug}.${city}`]: SORT_DESC,
    _id: SORT_DESC,
  };

  const companyRubricsMatch = domainCompany ? { companyId: new ObjectId(domainCompany._id) } : {};

  const attributesLimit = stickyNavVisibleAttributesCount
    ? [
        {
          $limit: stickyNavVisibleAttributesCount,
        },
      ]
    : [];

  const optionsLimit = stickyNavVisibleOptionsCount
    ? [
        {
          $limit: stickyNavVisibleOptionsCount,
        },
      ]
    : [];

  const catalogueNavConfigs = await shopProductsCollection
    .aggregate<CatalogueNavConfigsInterface>([
      {
        $match: {
          ...companyRubricsMatch,
          citySlug: city,
          ...ignoreNoImageStage,
        },
      },
      {
        $project: {
          selectedOptionsSlugs: true,
          rubricId: true,
        },
      },
      {
        $unwind: {
          path: '$selectedOptionsSlugs',
          preserveNullAndEmptyArrays: true,
        },
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
        $unwind: {
          path: '$selectedOptionsSlugs',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          slugArray: {
            $split: ['$selectedOptionsSlugs', FILTER_SEPARATOR],
          },
        },
      },
      {
        $addFields: {
          attributeSlug: {
            $arrayElemAt: ['$slugArray', 0],
          },
          optionSlug: {
            $arrayElemAt: ['$slugArray', 1],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          attributesSlugs: {
            $addToSet: '$attributeSlug',
          },
          attributeConfigs: {
            $push: {
              attributeSlug: '$attributeSlug',
              optionSlug: '$optionSlug',
            },
          },
        },
      },
    ])
    .toArray();

  const catalogueGroupedNavConfigs: CatalogueGroupedNavConfigsInterface[] = catalogueNavConfigs.map(
    (rubricConfig) => {
      return {
        _id: rubricConfig._id,
        attributeSlugs: rubricConfig.attributeConfigs.map(({ attributeSlug }) => attributeSlug),
        attributeConfigs: rubricConfig.attributeConfigs.reduce(
          (acc: CatalogueGroupedNavConfigItemInterface[], config) => {
            const existingConfigIndex = acc.findIndex(({ attributeSlug }) => {
              return attributeSlug === config.attributeSlug;
            });
            if (existingConfigIndex > -1) {
              acc[existingConfigIndex] = {
                attributeSlug: config.attributeSlug,
                optionSlugs: [...acc[existingConfigIndex].optionSlugs, config.optionSlug],
              };
              return acc;
            }

            return [
              ...acc,
              {
                attributeSlug: config.attributeSlug,
                optionSlugs: [config.optionSlug],
              },
            ];
          },
          [],
        ),
      };
    },
  );

  const rubricsIds = catalogueGroupedNavConfigs.map(({ _id }) => _id);
  const initialRubricsAggregation = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $match: {
          _id: {
            $in: rubricsIds,
          },
        },
      },
      {
        $sort: sortStage,
      },
      // Lookup rubric variant
      {
        $lookup: {
          from: COL_RUBRIC_VARIANTS,
          as: 'variant',
          let: {
            variantId: '$variantId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$variantId', '$_id'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          variant: {
            $arrayElemAt: ['$variant', 0],
          },
        },
      },
    ])
    .toArray();

  const rubrics: RubricInterface[] = [];
  for await (const rubric of initialRubricsAggregation) {
    const rubricConfig = catalogueGroupedNavConfigs.find((config) => {
      return rubric._id.equals(config._id);
    });

    if (rubricConfig) {
      const rubricAttributesAggregation = await attributesCollection
        .aggregate<AttributeModel>([
          {
            $match: {
              showInCatalogueNav: true,
              slug: {
                $in: rubricConfig.attributeSlugs,
              },
            },
          },
          {
            $sort: sortStage,
          },
          ...attributesLimit,
          {
            $project: {
              capitalise: false,
              variant: false,
              viewVariant: false,
              positioningInTitle: false,
              positioningInCardTitle: false,
              showAsBreadcrumb: false,
              showAsCatalogueBreadcrumb: false,
              notShowAsAlphabet: false,
              showInSnippet: false,
              showInCard: false,
              showInCatalogueFilter: false,
              showInCatalogueNav: false,
              showInCatalogueTitle: false,
              showInCardTitle: false,
              showInSnippetTitle: false,
              showNameInTitle: false,
              showNameInSelectedAttributes: false,
              showNameInCardTitle: false,
              showNameInSnippetTitle: false,
            },
          },
          {
            $addFields: {
              config: rubricConfig.attributeConfigs,
            },
          },
          {
            $addFields: {
              config: {
                $filter: {
                  input: '$config',
                  as: 'config',
                  cond: {
                    $eq: ['$$config.attributeSlug', '$slug'],
                  },
                },
              },
            },
          },
          {
            $addFields: {
              config: {
                $arrayElemAt: ['$config', 0],
              },
            },
          },
          {
            $match: {
              config: {
                $exists: true,
              },
            },
          },
          // Lookup rubric attribute options
          {
            $lookup: {
              from: COL_OPTIONS,
              as: 'options',
              let: {
                optionsGroupId: '$optionsGroupId',
                optionsSlugs: '$config.optionSlugs',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$optionsGroupId', '$optionsGroupId'],
                        },
                        {
                          $in: ['$slug', '$$optionsSlugs'],
                        },
                      ],
                    },
                    $or: [
                      {
                        parentId: {
                          $exists: false,
                        },
                      },
                      {
                        parentId: null,
                      },
                    ],
                  },
                },
                {
                  $sort: sortStage,
                },
                ...optionsLimit,

                // Lookup nested options
                {
                  $lookup: {
                    from: COL_OPTIONS,
                    as: 'options',
                    let: {
                      parentId: '$_id',
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [
                              {
                                $eq: ['$$optionsGroupId', '$optionsGroupId'],
                              },
                              {
                                $in: ['$slug', '$$optionsSlugs'],
                              },
                              {
                                $eq: ['$parentId', '$$parentId'],
                              },
                            ],
                          },
                        },
                      },
                      {
                        $sort: sortStage,
                      },
                      ...optionsLimit,
                    ],
                  },
                },
              ],
            },
          },
        ])
        .toArray();

      let categories: CategoryModel[] = [];
      if (rubric.variant?.showCategoriesInNav) {
        const rubricCategoriesConfig = categoryConfigs.find(({ rubricId }) => {
          return rubricId.equals(rubric._id);
        });

        if (rubricCategoriesConfig) {
          categories = await categoriesCollection
            .aggregate<CategoryModel>([
              {
                $match: {
                  _id: {
                    $in: rubricCategoriesConfig.categoryIds,
                  },
                  rubricId: rubric._id,
                  slug: {
                    $in: rubricConfig.attributeSlugs,
                  },
                },
              },
              {
                $lookup: {
                  from: COL_ICONS,
                  as: 'icon',
                  let: {
                    documentId: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        collectionName: COL_CATEGORIES,
                        $expr: {
                          $eq: ['$documentId', '$$documentId'],
                        },
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  icon: {
                    $arrayElemAt: ['$icon', 0],
                  },
                },
              },
            ])
            .toArray();
        }
      }

      const categoriesTree = getTreeFromList({
        list: categories,
        childrenFieldName: 'categories',
        locale,
      });

      rubrics.push({
        ...rubric,
        nameI18n: {},
        name: getFieldStringLocale(rubric.nameI18n, locale),
        categories: categoriesTree.slice(0, stickyNavVisibleCategoriesCount),
        attributes: rubricAttributesAggregation.map((attribute) => {
          return castAttributeForUI({
            attribute,
            locale,
          });
        }),
      });
    }
  }
  // console.log('Nav >>>>>>>>>>>>>>>> ', new Date().getTime() - timeStart);

  return rubrics;
};

export interface GetPageInitialDataCommonInterface {
  locale: string;
  citySlug: string;
  companySlug?: string;
}

export interface GetSsrConfigsInterface extends GetPageInitialDataCommonInterface {
  db: Db;
}

export const getSsrConfigs = async ({
  locale,
  citySlug,
  companySlug,
  db,
}: GetSsrConfigsInterface): Promise<SsrConfigsInterface> => {
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
  const cardMetaPrefix = getConfigStringValue({
    configs,
    slug: 'cardMetaPrefix',
  });
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
  const catalogueMetaPrefix = getConfigStringValue({
    configs,
    slug: 'catalogueMetaPrefix',
  });
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
  const cartBookingButtonDescription = getConfigStringValue({
    configs,
    slug: 'cartBookingButtonDescription',
  });
  const catalogueProductsCount =
    getConfigNumberValue({
      configs,
      slug: 'catalogueProductsCount',
    }) || CATALOGUE_PRODUCTS_LIMIT;

  return {
    isOneShopCompany,
    useNoIndexRules,
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
    cardMetaPrefix,
    catalogueFilterVisibleAttributesCount,
    catalogueFilterVisibleOptionsCount,
    stickyNavVisibleCategoriesCount,
    stickyNavVisibleSubCategoriesCount,
    visibleCategoriesInNavDropdown,
    catalogueMetaPrefix,
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

export interface PageInitialDataPayload {
  configs: SsrConfigsInterface;
  cities: CityInterface[];
  languages: LanguageModel[];
  currency: string;
}

export interface GetPageInitialDataInterface extends GetPageInitialDataCommonInterface {
  locale: string;
  citySlug: string;
  companySlug?: string;
}

export const getPageInitialData = async ({
  locale,
  citySlug,
  companySlug,
}: GetPageInitialDataInterface): Promise<PageInitialDataPayload> => {
  // console.log(' ');
  // console.log('=================== getPageInitialData =======================');
  // const timeStart = new Date().getTime();
  const { db } = await getDatabase();

  // configs
  const configs = await getSsrConfigs({
    db,
    citySlug,
    locale,
    companySlug,
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
  let currency = DEFAULT_CURRENCY;
  const sessionCity = initialCities.find(({ slug }) => slug === citySlug);
  if (sessionCity) {
    currency = sessionCity.currency || DEFAULT_CURRENCY;
  }
  // console.log('After currency ', new Date().getTime() - timeStart);

  return {
    configs,
    languages,
    cities,
    currency,
  };
};

interface GetPageInitialStateInterface {
  context: GetServerSidePropsContext;
}

interface GetPageInitialStatePayloadInterface extends PagePropsInterface {
  path: string;
  host: string;
  domain: string | null;
  urlPrefix: string;
  companyNotFound: boolean;
}

export async function getPageInitialState({
  context,
}: GetPageInitialStateInterface): Promise<GetPageInitialStatePayloadInterface> {
  const { locale, resolvedUrl, query } = context;
  const { db } = await getDatabase();
  const citiesCollection = db.collection<CityModel>(COL_CITIES);

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
    const initialCity = await citiesCollection.findOne({ slug: DEFAULT_CITY });
    currentCity = currentCity = castDbData(initialCity);
  }
  const sessionCity = currentCity?.slug || DEFAULT_CITY;

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
    path,
    host,
    domain,
    initialData,
    themeStyle,
    urlPrefix: `/${domainCompany?.slug || DEFAULT_COMPANY_SLUG}/${sessionCity}`,
    domainCompany: castDbData(domainCompany),
    companySlug: domainCompany ? domainCompany.slug : DEFAULT_COMPANY_SLUG,
    sessionCity,
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
  const { currentCity, sessionCity, sessionLocale, initialData, companySlug, themeStyle } =
    await getPageInitialState({ context });

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
      sessionCity,
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
  const { currentCity, sessionCity, sessionLocale, initialData, companySlug, themeStyle } =
    await getPageInitialState({ context });

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
      sessionCity,
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
  const { currentCity, sessionCity, sessionLocale, initialData, companySlug, themeStyle } =
    await getPageInitialState({ context });

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
      sessionCity,
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
  sessionCity: string;
}

export async function getCatalogueCreatedPages({
  companySlug,
  sessionCity,
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
            description: page.descriptionI18n
              ? getI18nLocaleValue(page.descriptionI18n, sessionLocale)
              : '',
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
    sessionCity,
    sessionLocale,
    initialData,
    domainCompany,
    companySlug,
    themeStyle,
    urlPrefix,
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

  // console.log('getSiteInitialData total time ', new Date().getTime() - timeStart);

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
      companyNotFound,
    },
  };
}
