import { ROUTE_CONSOLE_NAV_GROUP, ROUTE_CMS, ROUTE_CMS_NAV_GROUP } from '../../../config/common';
import { NavItemModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const navItemsDefaultSlug = 'navItem';

const navItems: NavItemModel[] = [
  // Console
  {
    _id: getObjectId(`${navItemsDefaultSlug} console-base`),
    slug: 'console',
    nameI18n: {
      ru: 'Панель управления',
      en: 'Console',
    },
    index: 0,
    icon: 'cart',
    path: '',
    navGroup: ROUTE_CONSOLE_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} console-orders`),
    slug: 'console-orders',
    nameI18n: {
      ru: 'Заказы',
      en: 'Orders',
    },
    index: 1,
    icon: 'cart',
    path: `/orders`,
    navGroup: ROUTE_CONSOLE_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} console-customers`),
    slug: 'console-customers',
    nameI18n: {
      ru: 'Клиенты',
      en: 'Customers',
    },
    index: 2,
    icon: 'user',
    path: `/users`,
    navGroup: ROUTE_CONSOLE_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} console-user-categories`),
    slug: 'console-user-categories',
    nameI18n: {
      ru: 'Категории клиентов',
      en: 'Customer categories',
    },
    index: 3,
    icon: 'user',
    path: `/user-categories`,
    navGroup: ROUTE_CONSOLE_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} console-shops`),
    slug: 'console-shops',
    nameI18n: {
      ru: 'Магазины',
      en: 'Shops',
    },
    index: 4,
    icon: 'marker',
    path: `/shops`,
    navGroup: ROUTE_CONSOLE_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} console-pages`),
    nameI18n: {
      ru: 'Страницы',
      en: 'Pages',
    },
    index: 5,
    icon: 'filter',
    slug: 'console-pages',
    path: `/pages`,
    navGroup: ROUTE_CONSOLE_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} console-blog`),
    nameI18n: {
      ru: 'Блог',
      en: 'Blog',
    },
    index: 6,
    icon: 'pencil',
    slug: 'console-blog',
    path: `/blog`,
    navGroup: ROUTE_CONSOLE_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} console-promo`),
    nameI18n: {
      ru: 'Акции',
      en: 'Promo',
    },
    index: 7,
    icon: 'pencil',
    slug: 'console-promo',
    path: `/promo`,
    navGroup: ROUTE_CONSOLE_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} console-rubrics`),
    nameI18n: {
      ru: 'Рубрикатор',
      en: 'Rubrics',
    },
    index: 8,
    icon: 'filter',
    slug: 'console-rubrics',
    path: `/rubrics`,
    navGroup: ROUTE_CONSOLE_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} gift-certificates`),
    nameI18n: {
      ru: 'Подарочные сертификаты',
      en: 'Gift certificates',
    },
    index: 9,
    icon: 'filter',
    slug: 'gift-certificates',
    path: `/gift-certificates`,
    navGroup: ROUTE_CONSOLE_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} console-config`),
    slug: 'console-config',
    nameI18n: {
      ru: 'Настройки',
      en: 'Settings',
    },
    index: 99,
    icon: 'gear',
    path: `/config`,
    navGroup: ROUTE_CONSOLE_NAV_GROUP,
  },

  // CMS
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-base`),
    nameI18n: {
      ru: 'CMS',
      en: 'CMS',
    },
    index: 0,
    slug: 'cms-base',
    icon: 'cart',
    path: ROUTE_CMS,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-orders`),
    nameI18n: {
      ru: 'Заказы',
      en: 'Orders',
    },
    index: 1,
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
    path: `${ROUTE_CMS}/rubrics`,
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
    path: `${ROUTE_CMS}/companies`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-sync-errors`),
    nameI18n: {
      ru: 'Ошибки синхронизации',
      en: 'Sync errors',
    },
    index: 4,
    slug: 'cms-sync-errors',
    path: `${ROUTE_CMS}/sync-errors`,
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
    path: `${ROUTE_CMS}/rubric-variants`,
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
    path: `${ROUTE_CMS}/attributes`,
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
    path: `${ROUTE_CMS}/options`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-metrics`),
    nameI18n: {
      ru: 'Единицы измерения',
      en: 'Metrics',
    },
    index: 8,
    slug: 'cms-metrics',
    path: `${ROUTE_CMS}/metrics`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-order-statuses`),
    nameI18n: {
      ru: 'Статусы заказа',
      en: 'Order statuses',
    },
    index: 9,
    slug: 'cms-order-statuses',
    path: `${ROUTE_CMS}/order-statuses`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-brands`),
    nameI18n: {
      ru: 'Бренды',
      en: 'Brands',
    },
    index: 10,
    slug: 'cms-brands',
    path: `${ROUTE_CMS}/brands`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-manufacturers`),
    nameI18n: {
      ru: 'Производители',
      en: 'Manufacturers',
    },
    index: 11,
    slug: 'cms-manufacturers',
    path: `${ROUTE_CMS}/manufacturers`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-suppliers`),
    nameI18n: {
      ru: 'Поставщики',
      en: 'Suppliers',
    },
    index: 12,
    slug: 'cms-suppliers',
    path: `${ROUTE_CMS}/suppliers`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-users`),
    nameI18n: {
      ru: 'Пользователи',
      en: 'Users',
    },
    index: 13,
    slug: 'cms-users',
    path: `${ROUTE_CMS}/users`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-blog`),
    nameI18n: {
      ru: 'Блог',
      en: 'Blog',
    },
    index: 93,
    slug: 'cms-blog',
    path: `${ROUTE_CMS}/blog`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-pages`),
    nameI18n: {
      ru: 'Страницы',
      en: 'Pages',
    },
    index: 94,
    slug: 'cms-pages',
    path: `${ROUTE_CMS}/pages`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-page-templates`),
    nameI18n: {
      ru: 'Шаблоны страниц',
      en: 'Page templates',
    },
    index: 95,
    slug: 'cms-page-templates',
    path: `${ROUTE_CMS}/page-templates`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-languages`),
    nameI18n: {
      ru: 'Языки сайта',
      en: 'Site languages',
    },
    index: 96,
    slug: 'cms-languages',
    path: `${ROUTE_CMS}/languages`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-nav-items`),
    nameI18n: {
      ru: 'Навигация',
      en: 'Navigation',
    },
    index: 97,
    slug: 'cms-nav-items',
    path: `${ROUTE_CMS}/nav`,
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
    path: `${ROUTE_CMS}/config`,
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
    path: `${ROUTE_CMS}/roles`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
];

// @ts-ignore
export = navItems;
