import { RoleModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const roles: RoleModel[] = [
  {
    _id: getObjectId('adminRole'),
    nameI18n: {
      ru: 'admin',
    },
    description: 'Администратор сайта',
    slug: 'admin',
    isStaff: true,
    rules: [],
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
    description: 'Роль назначается новым или не авторизованным пользователям',
    slug: 'guest',
    isStaff: false,
    rules: [],
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
    description: 'Владелец компании',
    slug: 'companyOwner',
    isStaff: false,
    rules: [],
    allowedAppNavigation: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('companyManagerRole'),
    nameI18n: {
      ru: 'Сотрудник компании',
      en: 'Company manager',
    },
    description: 'Сотрудник компании',
    slug: 'companyManager',
    isStaff: false,
    rules: [],
    allowedAppNavigation: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export = roles;
