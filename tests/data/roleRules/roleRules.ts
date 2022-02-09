import { RoleRuleModel } from 'db/dbModels';
import { getObjectId } from 'mongo-seeding';
import { roleRulesBase } from 'lib/roleRuleUtils';

const companyOwnerRoleRules: RoleRuleModel[] = roleRulesBase.map((base) => {
  return {
    ...base,
    _id: getObjectId(`companyOwnerRole ${base.slug}`),
    allow: true,
    roleId: getObjectId('companyOwnerRole'),
  };
});

const contentManagerRoleRules: RoleRuleModel[] = roleRulesBase.map((base) => {
  return {
    ...base,
    _id: getObjectId(`contentManagerRole ${base.slug}`),
    allow: true,
    roleId: getObjectId('contentManagerRole'),
  };
});

const roleRules = [...companyOwnerRoleRules, ...contentManagerRoleRules];

// @ts-ignore
export = roleRules;
