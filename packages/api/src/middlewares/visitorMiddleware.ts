import { NextFunction } from 'express';
import { RoleRuleModel, RoleRuleOperationModel } from '../entities/RoleRule';
import { RoleModel } from '../entities/Role';
import { ROLE_SLUG_GUEST } from '@yagu/config';

// TODO params types
export const visitorMiddleware = async (req: any, _res: any, next: NextFunction) => {
  // Set request role
  const roleRuleOperationsPopulate = {
    path: 'operations',
    model: RoleRuleOperationModel,
    options: {
      sort: {
        order: 1,
      },
    },
  };

  if (req.session.userId) {
    let userRole = await RoleModel.findOne({ _id: req.session!.roleId });
    if (!userRole) {
      userRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
    }

    if (!userRole) {
      throw Error('Guest role not found');
    }

    req.role = userRole;
    req.roleRules = await RoleRuleModel.find({
      roleId: userRole.id,
    }).populate(roleRuleOperationsPopulate);
  } else {
    const guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
    if (!guestRole) {
      throw Error('Guest role not found');
    }

    req.role = guestRole;
    req.roleRules = await RoleRuleModel.find({
      roleId: guestRole.id,
    }).populate(roleRuleOperationsPopulate);
  }

  next();
};
