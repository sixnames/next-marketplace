import { ContextInterface } from '../../types/context';
import { FilterQuery } from 'mongoose';
import { RoleModel } from '../../entities/Role';
import { ROLE_SLUG_GUEST } from '@yagu/config';
import {
  RoleRuleModel,
  RoleRuleOperationModel,
  RoleRuleOperationTypeEnum,
} from '../../entities/RoleRule';

export interface AuthCheckerConfigInterface {
  entity: string;
  operationType: 'create' | 'read' | 'update' | 'delete';
  target: 'operation' | 'field';
}

interface GetRoleRuleCustomFilterInterface {
  req: ContextInterface['req'];
  entity: string;
  operationType: AuthCheckerConfigInterface['operationType'];
}

export async function getRoleRuleCustomFilter<T>({
  req,
  entity,
  operationType,
}: GetRoleRuleCustomFilterInterface): Promise<FilterQuery<T>> {
  let entityRule;
  const { roleId, userId } = req.session!;

  if (!roleId) {
    const guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
    if (!guestRole) {
      throw Error('Guest role not found');
    }
    entityRule = await RoleRuleModel.findOne({
      roleId: guestRole.id,
      entity,
    });
  } else {
    entityRule = await RoleRuleModel.findOne({
      roleId: roleId,
      entity,
    });
  }

  if (!entityRule) {
    return {};
  }

  const entityRuleOperation = await RoleRuleOperationModel.findOne({
    _id: { $in: entityRule.operations },
    operationType: operationType as RoleRuleOperationTypeEnum,
  });

  if (!entityRuleOperation) {
    return {};
  }

  const { customFilter = '{}' } = entityRuleOperation;
  const customFilterResult = customFilter.replace(/__authenticatedUser/gi, `${userId}`);

  return JSON.parse(customFilterResult);
}
