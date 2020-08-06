import { ContextInterface } from '../../types/context';
import { RoleRule, RoleRuleOperation } from '../../entities/Role';
import { FilterQuery } from 'mongoose';
import { AuthCheckerConfigInterface } from './customAuthChecker';

interface GetRoleRuleCustomFilterInterface {
  req: ContextInterface['req'];
  entity: string;
  operationType: AuthCheckerConfigInterface['operationType'];
}

export function getRoleRuleCustomFilter<T>({
  req,
  entity,
  operationType,
}: GetRoleRuleCustomFilterInterface): FilterQuery<T> {
  const {
    userRole: { rules },
    userId,
  } = req.session!;

  const entityRule: RoleRule | undefined = rules.find(
    ({ entity: ruleEntity }: RoleRule) => ruleEntity === entity,
  );

  if (!entityRule) {
    return {};
  }

  const entityRuleOperation: RoleRuleOperation | undefined = entityRule.operations.find(
    ({ operationType: ruleOperationType }) => ruleOperationType === operationType,
  );

  if (!entityRuleOperation) {
    return {};
  }

  const { customFilter = '{}' } = entityRuleOperation;
  const customFilterResult = customFilter.replace(/__authenticatedUser/gi, `${userId}`);

  return JSON.parse(customFilterResult);
}
