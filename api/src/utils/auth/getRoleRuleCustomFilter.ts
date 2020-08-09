import { ContextInterface } from '../../types/context';
import { FilterQuery } from 'mongoose';
import { AuthCheckerConfigInterface, RoleRuleInterface } from './customAuthChecker';

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

  const entityRule: RoleRuleInterface | undefined = rules.find(
    ({ entity: ruleEntity }: RoleRuleInterface) => ruleEntity === entity,
  );

  if (!entityRule) {
    return {};
  }

  const entityRuleOperation = entityRule.operations.find(
    ({ operationType: ruleOperationType }) => ruleOperationType === operationType,
  );

  if (!entityRuleOperation) {
    return {};
  }

  const { customFilter = '{}' } = entityRuleOperation;
  const customFilterResult = customFilter.replace(/__authenticatedUser/gi, `${userId}`);

  return JSON.parse(customFilterResult);
}
