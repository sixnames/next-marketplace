import { AuthChecker } from 'type-graphql';
import { ContextInterface } from '../../types/context';
import { RoleRule } from '../../entities/Role';

export interface AuthCheckerConfigInterface {
  entity: string;
  operationType: 'create' | 'read' | 'update' | 'delete';
  target: 'operation' | 'field';
}

// TODO check if field
// TODO check customFilter
export const customAuthChecker: AuthChecker<ContextInterface, AuthCheckerConfigInterface> = async (
  {
    // info,
    context: {
      req: { session },
    },
  },
  operationTypes,
): Promise<boolean> => {
  // const { fieldName } = info;
  const operationConfig = operationTypes[0];
  const roleRules: RoleRule[] = session!.userRole.rules;
  const operationRule = roleRules.find(({ entity }) => entity === operationConfig.entity);
  if (!operationRule) {
    return true;
  }

  const operationTypeRule = operationRule.operations.find(
    ({ operationType }) => operationType === operationConfig.operationType,
  );
  if (!operationTypeRule) {
    return true;
  }

  return operationTypeRule.allowed;
};
