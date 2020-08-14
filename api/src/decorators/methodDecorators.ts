import { createMethodDecorator } from 'type-graphql';
import { ContextInterface } from '../types/context';
import { RoleModel } from '../entities/Role';
import { ROLE_SLUG_GUEST } from '../config';
import {
  RoleRuleModel,
  RoleRuleOperationModel,
  RoleRuleOperationTypeEnum,
} from '../entities/RoleRule';

export interface AuthMethodConfigInterface {
  entity: string;
  operationType: 'create' | 'read' | 'update' | 'delete';
}

export function AuthMethod(operationConfig: AuthMethodConfigInterface) {
  return createMethodDecorator<ContextInterface>(
    async (
      {
        context: {
          req: { session },
        },
      },
      next,
    ) => {
      let currentRule;
      const userRoleId = session!.roleId;

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
        return next();
      }

      const currentOperation = await RoleRuleOperationModel.findOne({
        _id: { $in: currentRule.operations },
        operationType: operationConfig.operationType as RoleRuleOperationTypeEnum,
      });
      if (!currentOperation) {
        return next();
      }

      if (!currentOperation.allow) {
        throw Error(`Access denied! You don't have permission for this action!`);
      }

      return next();
    },
  );
}
