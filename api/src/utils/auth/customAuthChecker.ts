import { AuthChecker } from 'type-graphql';
import { ContextInterface } from '../../types/context';
import { RoleRule } from '../../entities/Role';
import { OPERATION_TARGET_FIELD } from '../../config';

export interface AuthCheckerConfigInterface {
  entity: string;
  operationType: 'create' | 'read' | 'update' | 'delete';
  target: 'operation' | 'field';
}

export const customAuthChecker: AuthChecker<ContextInterface, AuthCheckerConfigInterface> = async (
  {
    info,
    context: {
      req: { session },
    },
  },
  operationTypes,
): Promise<boolean> => {
  const operationConfig = operationTypes[0];
  const roleRules: RoleRule[] = session!.userRole.rules;
  const entityRule = roleRules.find(({ entity }) => entity === operationConfig.entity);
  if (!entityRule) {
    return true;
  }

  // Check if target is entity field
  if (operationConfig.target === OPERATION_TARGET_FIELD) {
    const restrictedField = entityRule.restrictedFields.includes(info.fieldName);
    return !restrictedField;
  }

  const entityRuleOperation = entityRule.operations.find(
    ({ operationType }) => operationType === operationConfig.operationType,
  );
  if (!entityRuleOperation) {
    return true;
  }

  return entityRuleOperation.allowed;
};
