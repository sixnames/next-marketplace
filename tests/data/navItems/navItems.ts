import { NAV_GROUP_CONSOLE, NAV_GROUP_CMS } from '../../../config/common';
import { NavItemModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import { getProjectLinks } from '../../../lib/getProjectLinks';

const navItemsDefaultSlug = 'navItem';
const links = getProjectLinks();

// Console
const consoleNavItems: NavItemModel[] = [
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
    navGroup: NAV_GROUP_CONSOLE,
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
    navGroup: NAV_GROUP_CONSOLE,
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
    navGroup: NAV_GROUP_CONSOLE,
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
    navGroup: NAV_GROUP_CONSOLE,
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
    navGroup: NAV_GROUP_CONSOLE,
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
    navGroup: NAV_GROUP_CONSOLE,
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
    navGroup: NAV_GROUP_CONSOLE,
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
    navGroup: NAV_GROUP_CONSOLE,
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
    navGroup: NAV_GROUP_CONSOLE,
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
    navGroup: NAV_GROUP_CONSOLE,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} console-tasks`),
    nameI18n: {
      ru: 'Задачи',
      en: 'Tasks',
    },
    index: 10,
    icon: 'filter',
    slug: 'tasks',
    path: `/tasks`,
    navGroup: NAV_GROUP_CONSOLE,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} console-task-variants`),
    nameI18n: {
      ru: 'Типы задач',
      en: 'Task variants',
    },
    index: 11,
    icon: 'filter',
    slug: 'task-variants',
    path: `/task-variants`,
    navGroup: NAV_GROUP_CONSOLE,
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
    navGroup: NAV_GROUP_CONSOLE,
  },
];

// CMS
const cmsNavItems: NavItemModel[] = [
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-base`),
    nameI18n: {
      ru: 'CMS',
      en: 'CMS',
    },
    index: 0,
    slug: 'cms-base',
    icon: 'cart',
    path: links.cms.url,
    navGroup: NAV_GROUP_CMS,
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
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-rubrics`),
    nameI18n: {
      ru: 'Рубрикатор',
      en: 'Rubrics',
    },
    index: 2,
    slug: 'cms-rubrics',
    path: links.cms.rubrics.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-companies`),
    nameI18n: {
      ru: 'Компании',
      en: 'Companies',
    },
    index: 3,
    slug: 'cms-companies',
    path: links.cms.companies.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-sync-errors`),
    nameI18n: {
      ru: 'Ошибки синхронизации',
      en: 'Sync errors',
    },
    index: 4,
    slug: 'cms-sync-errors',
    path: links.cms.syncErrors.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-rubric-variants`),
    nameI18n: {
      ru: 'Типы рубрик',
      en: 'Rubric variants',
    },
    index: 5,
    slug: 'cms-rubric-variants',
    path: links.cms.rubricVariants.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-attributes-groups`),
    nameI18n: {
      ru: 'Группы атрибутов',
      en: 'Attributes groups',
    },
    index: 6,
    slug: 'cms-attributes',
    path: links.cms.attributes.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-options-groups`),
    nameI18n: {
      ru: 'Группы опций',
      en: 'Options groups',
    },
    index: 7,
    slug: 'cms-options-groups',
    path: links.cms.options.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-metrics`),
    nameI18n: {
      ru: 'Единицы измерения',
      en: 'Metrics',
    },
    index: 8,
    slug: 'cms-metrics',
    path: links.cms.metrics.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-order-statuses`),
    nameI18n: {
      ru: 'Статусы заказа',
      en: 'Order statuses',
    },
    index: 9,
    slug: 'cms-order-statuses',
    path: links.cms.orderStatuses.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} tasks`),
    nameI18n: {
      ru: 'Задачи',
      en: 'Tasks',
    },
    index: 10,
    slug: 'cms-tasks',
    path: links.cms.tasks.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} task-variants`),
    nameI18n: {
      ru: 'Типы задач',
      en: 'Task variants',
    },
    index: 11,
    slug: 'cms-task-variants',
    path: links.cms.taskVariants.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-brands`),
    nameI18n: {
      ru: 'Бренды',
      en: 'Brands',
    },
    index: 12,
    slug: 'cms-brands',
    path: links.cms.brands.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-manufacturers`),
    nameI18n: {
      ru: 'Производители',
      en: 'Manufacturers',
    },
    index: 13,
    slug: 'cms-manufacturers',
    path: links.cms.manufacturers.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-suppliers`),
    nameI18n: {
      ru: 'Поставщики',
      en: 'Suppliers',
    },
    index: 14,
    slug: 'cms-suppliers',
    path: links.cms.suppliers.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-users`),
    nameI18n: {
      ru: 'Пользователи',
      en: 'Users',
    },
    index: 15,
    slug: 'cms-users',
    path: links.cms.users.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-blog`),
    nameI18n: {
      ru: 'Блог',
      en: 'Blog',
    },
    index: 93,
    slug: 'cms-blog',
    path: links.cms.blog.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-pages`),
    nameI18n: {
      ru: 'Страницы',
      en: 'Pages',
    },
    index: 94,
    slug: 'cms-pages',
    path: links.cms.pages.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-page-templates`),
    nameI18n: {
      ru: 'Шаблоны страниц',
      en: 'Page templates',
    },
    index: 95,
    slug: 'cms-page-templates',
    path: links.cms.pageTemplates.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-languages`),
    nameI18n: {
      ru: 'Языки сайта',
      en: 'Site languages',
    },
    index: 96,
    slug: 'cms-languages',
    path: links.cms.languages.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-nav-items`),
    nameI18n: {
      ru: 'Навигация',
      en: 'Navigation',
    },
    index: 97,
    slug: 'cms-nav-items',
    path: links.cms.nav.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-config`),
    nameI18n: {
      ru: 'Настройки сайта',
      en: 'Site settings',
    },
    index: 98,
    slug: 'cms-config',
    path: links.cms.config.url,
    navGroup: NAV_GROUP_CMS,
  },
  {
    _id: getObjectId(`${navItemsDefaultSlug} cms-roles`),
    nameI18n: {
      ru: 'Роли',
      en: 'Roles',
    },
    index: 99,
    slug: 'cms-roles',
    path: links.cms.roles.url,
    navGroup: NAV_GROUP_CMS,
  },
];

const navItems: NavItemModel[] = [...consoleNavItems, ...cmsNavItems];

// @ts-ignore
export = navItems;
