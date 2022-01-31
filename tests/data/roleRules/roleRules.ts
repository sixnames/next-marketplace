import { RoleRuleModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import { roleRulesBase } from '../../../lib/roleUtils';

/*const roleRules: RoleRuleModel[] = [
  {
    _id: getObjectId('roleRule updateOrder'),
    slug: 'updateOrder',
    allow: true,
    nameI18n: {
      ru: 'Обновление заказа',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
  {
    _id: getObjectId('roleRule confirmOrder'),
    slug: 'confirmOrder',
    allow: true,
    nameI18n: {
      ru: 'Подтверждение заказа',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
  {
    _id: getObjectId('roleRule cancelOrder'),
    slug: 'cancelOrder',
    allow: true,
    nameI18n: {
      ru: 'Отмена заказа',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
  {
    _id: getObjectId('roleRule createOrder'),
    slug: 'createOrder',
    allow: true,
    nameI18n: {
      ru: 'Создание заказа',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
  {
    _id: getObjectId('roleRule createUserCategory'),
    slug: 'createUserCategory',
    allow: true,
    nameI18n: {
      ru: 'Создание категории пользователя',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
  {
    _id: getObjectId('roleRule updateUserCategory'),
    slug: 'updateUserCategory',
    allow: true,
    nameI18n: {
      ru: 'Обновление категории пользователя',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
  {
    _id: getObjectId('roleRule deleteUserCategory'),
    slug: 'deleteUserCategory',
    allow: true,
    nameI18n: {
      ru: 'Удаление категории пользователя',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
  {
    _id: getObjectId('roleRule setUserCategory'),
    slug: 'setUserCategory',
    allow: true,
    nameI18n: {
      ru: 'Назначение категории пользователя',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
  {
    _id: getObjectId('roleRule createBlogPost'),
    slug: 'createBlogPost',
    allow: true,
    nameI18n: {
      ru: 'Создание блог-поста',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
  {
    _id: getObjectId('roleRule updateBlogPost'),
    slug: 'updateBlogPost',
    allow: true,
    nameI18n: {
      ru: 'Обновление блог-поста',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
  {
    _id: getObjectId('roleRule deleteBlogPost'),
    slug: 'deleteBlogPost',
    allow: true,
    nameI18n: {
      ru: 'Удаление блог-поста',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
];*/

const roleRules: RoleRuleModel[] = roleRulesBase.map((base) => {
  return {
    ...base,
    _id: getObjectId(`roleRule ${base.slug}`),
    allow: true,
    roleId: getObjectId('companyOwnerRole'),
  };
});

// @ts-ignore
export = roleRules;
