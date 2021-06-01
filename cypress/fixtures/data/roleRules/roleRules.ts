import { RoleRuleModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const roleRules: RoleRuleModel[] = [
  {
    _id: getObjectId('roleRule'),
    slug: 'slug',
    allow: false,
    nameI18n: {
      ru: 'fake',
    },
    descriptionI18n: {
      ru: 'fake',
    },
    roleId: getObjectId('fake'),
  },
];

// @ts-ignore
export = roleRules;
