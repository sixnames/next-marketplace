import { RoleRuleModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import { roleRulesBase } from '../../../lib/roleRuleUtils';

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
