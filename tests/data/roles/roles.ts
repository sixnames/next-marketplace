import { RoleModel } from 'db/dbModels';
import { NAV_GROUP_CMS, NAV_GROUP_CONSOLE } from 'lib/config/common';
import { getObjectId } from 'mongo-seeding';
import navItems from '../navItems/navItems';

const roles: RoleModel[] = [
  {
    _id: getObjectId('adminRole'),
    nameI18n: {
      ru: 'admin',
    },
    descriptionI18n: {
      ru: 'Администратор сайта',
    },
    slug: 'admin',
    isStaff: true,
    isCompanyStaff: false,
    isModerator: true,
    showAdminUiInCatalogue: true,
    allowedAppNavigation: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('contentManagerRole'),
    nameI18n: {
      ru: 'Контент менеджер',
    },
    descriptionI18n: {
      ru: 'Контент менеджер',
    },
    slug: 'contentManager',
    isStaff: true,
    isCompanyStaff: false,
    isContentManager: true,
    allowedAppNavigation: navItems.reduce((acc: string[], { path, navGroup }) => {
      if (navGroup === NAV_GROUP_CMS) {
        return [...acc, path];
      }
      return acc;
    }, []),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('contentManagerRoleB'),
    nameI18n: {
      ru: 'Контент менеджер B',
    },
    descriptionI18n: {
      ru: 'Контент менеджер B',
    },
    slug: 'contentManagerB',
    isStaff: true,
    isCompanyStaff: false,
    isContentManager: true,
    allowedAppNavigation: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('guestRole'),
    nameI18n: {
      ru: 'Гость',
      en: 'Guest',
    },
    descriptionI18n: {
      ru: 'Роль назначается новым или не авторизованным пользователям',
    },
    slug: 'guest',
    isStaff: false,
    isCompanyStaff: false,
    allowedAppNavigation: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('companyOwnerRole'),
    nameI18n: {
      ru: 'Владелец компании',
      en: 'Company owner',
    },
    descriptionI18n: {
      ru: 'Владелец компании',
    },
    slug: 'companyOwner',
    isStaff: false,
    isCompanyStaff: true,
    allowedAppNavigation: navItems.reduce((acc: string[], { path, navGroup }) => {
      if (navGroup === NAV_GROUP_CONSOLE) {
        return [...acc, path];
      }
      return acc;
    }, []),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('companyManagerRole'),
    nameI18n: {
      ru: 'Сотрудник компании',
      en: 'Company manager',
    },
    descriptionI18n: {
      ru: 'Сотрудник компании',
    },
    slug: 'companyManager',
    isStaff: false,
    isCompanyStaff: true,
    allowedAppNavigation: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
export = roles;
