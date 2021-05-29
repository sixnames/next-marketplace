import { ROUTE_APP_NAV_GROUP, ROUTE_CMS_NAV_GROUP } from '../../../../config/common';
import { NavItemModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const navItemsDefaultSlug = 'navItem';

const navItems: NavItemModel[] = [
  {
    _id: getObjectId(`${navItemsDefaultSlug} app-orders`),
    slug: 'app-orders',
    nameI18n: {
      ru: 'Заказы',
      en: 'Orders',
    },
    index: 0,
    icon: 'cart',
    path: '/orders',
    navGroup: ROUTE_APP_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} app-shops`),
    slug: 'app-shops',
    nameI18n: {
      ru: 'Магазины',
      en: 'Shops',
    },
    index: 1,
    icon: 'pageProps',
    path: '/shops',
    navGroup: ROUTE_APP_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} app-config`),
    slug: 'app-config',
    nameI18n: {
      ru: 'Настройки сайта',
      en: 'Site settings',
    },
    index: 99,
    icon: 'gear',
    path: '/config',
    navGroup: ROUTE_APP_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-orders`),
    nameI18n: {
      ru: 'Заказы',
      en: 'Orders',
    },
    index: 0,
    slug: 'cms-orders',
    path: '/cms/orders',
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-rubrics`),
    nameI18n: {
      ru: 'Рубрикатор',
      en: 'Rubrics',
    },
    index: 2,
    slug: 'cms-rubrics',
    path: '/cms/rubrics',
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-companies`),
    nameI18n: {
      ru: 'Компании',
      en: 'Companies',
    },
    index: 3,
    slug: 'cms-companies',
    path: '/cms/companies',
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-rubric-variants`),
    nameI18n: {
      ru: 'Типы рубрик',
      en: 'Rubric variants',
    },
    index: 5,
    slug: 'cms-rubric-variants',
    path: '/cms/rubric-variants',
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-attributes-groups`),
    nameI18n: {
      ru: 'Группы атрибутов',
      en: 'Attributes groups',
    },
    index: 6,
    slug: 'cms-attributes',
    path: '/cms/attributes',
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-options-groups`),
    nameI18n: {
      ru: 'Группы опций',
      en: 'Options groups',
    },
    index: 7,
    slug: 'cms-options-groups',
    path: '/cms/options',
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-languages`),
    nameI18n: {
      ru: 'Языки сайта',
      en: 'Site languages',
    },
    index: 8,
    slug: 'cms-languages',
    path: '/cms/languages',
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-users`),
    nameI18n: {
      ru: 'Пользователи',
      en: 'Users',
    },
    index: 9,
    slug: 'cms-users',
    path: '/cms/users',
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-config`),
    nameI18n: {
      ru: 'Настройки сайта',
      en: 'Site settings',
    },
    index: 98,
    slug: 'cms-config',
    path: '/cms/config',
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-roles`),
    nameI18n: {
      ru: 'Роли',
      en: 'Roles',
    },
    index: 99,
    slug: 'cms-roles',
    path: '/cms/roles',
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
];

// @ts-ignore
export = navItems;
