import { RoleRuleModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const roleRules: RoleRuleModel[] = [
  {
    _id: getObjectId('roleRule 1'),
    slug: 'updateOrder',
    allow: true,
    nameI18n: {
      ru: 'Обновление заказа',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
  {
    _id: getObjectId('roleRule 2'),
    slug: 'confirmOrder',
    allow: true,
    nameI18n: {
      ru: 'Подтверждение заказа',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
  {
    _id: getObjectId('roleRule 3'),
    slug: 'cancelOrder',
    allow: true,
    nameI18n: {
      ru: 'Отмена заказа',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
  {
    _id: getObjectId('roleRule 4'),
    slug: 'createOrder',
    allow: true,
    nameI18n: {
      ru: 'Создание заказа',
    },
    descriptionI18n: {},
    roleId: getObjectId('companyOwnerRole'),
  },
];

// @ts-ignore
export = roleRules;
