import { AuthChecker } from 'type-graphql';
import { ContextInterface } from '../../types/context';
import { OPERATION_TARGET_FIELD, ROLE_SLUG_GUEST } from '../../config';
import {
  RoleRuleModel,
  RoleRuleOperationModel,
  RoleRuleOperationTypeEnum,
} from '../../entities/RoleRule';
import { RoleModel } from '../../entities/Role';

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
  let currentRule;
  const userRoleId = session!.roleId;
  const operationConfig = operationTypes[0];

  if (!userRoleId) {
    const guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
    if (!guestRole) {
      throw Error('Guest role not found');
    }
    currentRule = await RoleRuleModel.findOne({
      roleId: guestRole.id,
      entity: operationConfig.entity,
    });
  } else {
    currentRule = await RoleRuleModel.findOne({
      roleId: userRoleId,
      entity: operationConfig.entity,
    });
  }

  if (!currentRule) {
    return true;
  }

  // Check if target is entity field
  if (operationConfig.target === OPERATION_TARGET_FIELD) {
    const restrictedField = currentRule.restrictedFields.includes(info.fieldName);
    return !restrictedField;
  }

  const currentOperation = await RoleRuleOperationModel.findOne({
    _id: { $in: currentRule.operations },
    operationType: operationConfig.operationType as RoleRuleOperationTypeEnum,
  });
  if (!currentOperation) {
    return true;
  }

  return currentOperation.allow;
};
