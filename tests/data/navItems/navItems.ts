import { NavItemModel } from 'db/dbModels';
import { NAV_GROUP_CMS, NAV_GROUP_CONSOLE } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getObjectId } from 'mongo-seeding';

const navItemsDefaultSlug = 'navItem';
const links = getProjectLinks();
type NavItemBaseMode = Omit<NavItemModel, '_id' | 'index' | 'navGroup'>;
function getNavItems(navItemBaseList: NavItemBaseMode[], navGroup: string): NavItemModel[] {
  return navItemBaseList.map((base, index) => {
    return {
      _id: getObjectId(`${navItemsDefaultSlug} ${base.slug}`),
      index,
      navGroup,
      ...base,
    };
  });
}

function getConsoleLink(url: string): string {
  const urlParts = url.split('/').filter((path) => path);
  const cleanUrlParts = urlParts.slice(2);
  const finalUrl = `/${cleanUrlParts.join('/')}`;
  if (finalUrl === '/') {
    return '';
  }
  return finalUrl;
}

// Console
const consoleNavItemBases: NavItemBaseMode[] = [
  {
    nameI18n: {
      ru: 'Панель управления',
      en: 'Console',
    },
    slug: 'console',
    path: getConsoleLink(links.console.companyId.url),
  },
  {
    nameI18n: {
      ru: 'Мои задачи',
      en: 'My tasks',
    },
    slug: 'console-my-tasks',
    path: getConsoleLink(links.console.companyId.myTasks.url),
  },
  {
    nameI18n: {
      ru: 'Заказы',
      en: 'Orders',
    },
    slug: 'console-orders',
    path: getConsoleLink(links.console.companyId.orders.url),
  },
  {
    nameI18n: {
      ru: 'Клиенты',
      en: 'Customers',
    },
    slug: 'console-customers',
    path: getConsoleLink(links.console.companyId.users.url),
  },
  {
    nameI18n: {
      ru: 'Категории клиентов',
      en: 'Customer categories',
    },
    slug: 'console-user-categories',
    path: getConsoleLink(links.console.companyId.userCategories.url),
  },
  {
    nameI18n: {
      ru: 'Магазины',
      en: 'Shops',
    },
    slug: 'console-shops',
    path: getConsoleLink(links.console.companyId.shops.url),
  },
  {
    nameI18n: {
      ru: 'Страницы',
      en: 'Pages',
    },
    slug: 'console-pages',
    path: getConsoleLink(links.console.companyId.pages.url),
  },
  {
    nameI18n: {
      ru: 'Блог',
      en: 'Blog',
    },
    slug: 'console-blog',
    path: getConsoleLink(links.console.companyId.blog.url),
  },
  {
    nameI18n: {
      ru: 'Акции',
      en: 'Promo',
    },
    slug: 'console-promo',
    path: getConsoleLink(links.console.companyId.promo.url),
  },
  {
    nameI18n: {
      ru: 'Рубрикатор',
      en: 'Rubrics',
    },
    slug: 'console-rubrics',
    path: getConsoleLink(links.console.companyId.rubrics.url),
  },
  {
    nameI18n: {
      ru: 'Рубрикатор мероприятий',
      en: 'Events',
    },
    slug: 'console-events',
    path: getConsoleLink(links.console.companyId.eventRubrics.url),
  },
  {
    nameI18n: {
      ru: 'Подарочные сертификаты',
      en: 'Gift certificates',
    },
    slug: 'gift-certificates',
    path: getConsoleLink(links.console.companyId.giftCertificates.url),
  },
  {
    nameI18n: {
      ru: 'Задачи',
      en: 'Tasks',
    },
    slug: 'tasks',
    path: getConsoleLink(links.console.companyId.tasks.url),
  },
  {
    nameI18n: {
      ru: 'Типы задач',
      en: 'Task variants',
    },
    slug: 'task-variants',
    path: getConsoleLink(links.console.companyId.taskVariants.url),
  },
  {
    nameI18n: {
      ru: 'Настройки',
      en: 'Settings',
    },
    slug: 'console-config',
    path: getConsoleLink(links.console.companyId.config.url),
  },
];

// CMS
const cmsNavItemBases: NavItemBaseMode[] = [
  {
    nameI18n: {
      ru: 'CMS',
      en: 'CMS',
    },
    slug: 'cms-base',
    path: links.cms.url,
  },
  {
    nameI18n: {
      ru: 'Мои задачи',
      en: 'My tasks',
    },
    slug: 'cms-my-tasks',
    path: links.cms.myTasks.url,
  },
  {
    nameI18n: {
      ru: 'Заказы',
      en: 'Orders',
    },
    slug: 'cms-orders',
    path: links.cms.orders.url,
  },
  {
    nameI18n: {
      ru: 'Рубрикатор',
      en: 'Rubrics',
    },
    slug: 'cms-rubrics',
    path: links.cms.rubrics.url,
  },
  {
    nameI18n: {
      ru: 'Рубрикатор мероприятий',
      en: 'Events',
    },
    slug: 'cms-events',
    path: links.cms.eventRubrics.url,
  },
  {
    nameI18n: {
      ru: 'Компании',
      en: 'Companies',
    },
    slug: 'cms-companies',
    path: links.cms.companies.url,
  },
  {
    nameI18n: {
      ru: 'Ошибки синхронизации',
      en: 'Sync errors',
    },
    slug: 'cms-sync-errors',
    path: links.cms.syncErrors.url,
  },
  {
    nameI18n: {
      ru: 'Типы рубрик',
      en: 'Rubric variants',
    },
    slug: 'cms-rubric-variants',
    path: links.cms.rubricVariants.url,
  },
  {
    nameI18n: {
      ru: 'Группы атрибутов',
      en: 'Attributes groups',
    },
    slug: 'cms-attributes',
    path: links.cms.attributes.url,
  },
  {
    nameI18n: {
      ru: 'Группы опций',
      en: 'Options groups',
    },
    slug: 'cms-options-groups',
    path: links.cms.options.url,
  },
  {
    nameI18n: {
      ru: 'Единицы измерения',
      en: 'Metrics',
    },
    slug: 'cms-metrics',
    path: links.cms.metrics.url,
  },
  {
    nameI18n: {
      ru: 'Статусы заказа',
      en: 'Order statuses',
    },
    slug: 'cms-order-statuses',
    path: links.cms.orderStatuses.url,
  },
  {
    nameI18n: {
      ru: 'Задачи',
      en: 'Tasks',
    },
    slug: 'cms-tasks',
    path: links.cms.tasks.url,
  },
  {
    nameI18n: {
      ru: 'Типы задач',
      en: 'Task variants',
    },
    slug: 'cms-task-variants',
    path: links.cms.taskVariants.url,
  },
  {
    nameI18n: {
      ru: 'Бренды',
      en: 'Brands',
    },
    slug: 'cms-brands',
    path: links.cms.brands.url,
  },
  {
    nameI18n: {
      ru: 'Производители',
      en: 'Manufacturers',
    },
    slug: 'cms-manufacturers',
    path: links.cms.manufacturers.url,
  },
  {
    nameI18n: {
      ru: 'Поставщики',
      en: 'Suppliers',
    },
    slug: 'cms-suppliers',
    path: links.cms.suppliers.url,
  },
  {
    nameI18n: {
      ru: 'Пользователи',
      en: 'Users',
    },
    slug: 'cms-users',
    path: links.cms.users.url,
  },
  {
    nameI18n: {
      ru: 'Блог',
      en: 'Blog',
    },
    slug: 'cms-blog',
    path: links.cms.blog.url,
  },
  {
    nameI18n: {
      ru: 'Страницы',
      en: 'Pages',
    },
    slug: 'cms-pages',
    path: links.cms.pages.url,
  },
  {
    nameI18n: {
      ru: 'Шаблоны страниц',
      en: 'Page templates',
    },
    slug: 'cms-page-templates',
    path: links.cms.pageTemplates.url,
  },
  {
    nameI18n: {
      ru: 'Языки сайта',
      en: 'Site languages',
    },
    slug: 'cms-languages',
    path: links.cms.languages.url,
  },
  {
    nameI18n: {
      ru: 'Навигация',
      en: 'Navigation',
    },
    slug: 'cms-nav-items',
    path: links.cms.nav.url,
  },
  {
    nameI18n: {
      ru: 'Настройки сайта',
      en: 'Site settings',
    },
    slug: 'cms-config',
    path: links.cms.config.url,
  },
  {
    nameI18n: {
      ru: 'Роли',
      en: 'Roles',
    },
    slug: 'cms-roles',
    path: links.cms.roles.url,
  },
];

const consoleNavItems = getNavItems(consoleNavItemBases, NAV_GROUP_CONSOLE);
const cmsNavItems = getNavItems(cmsNavItemBases, NAV_GROUP_CMS);
const navItems: NavItemModel[] = [...consoleNavItems, ...cmsNavItems];

// @ts-ignore
export = navItems;
