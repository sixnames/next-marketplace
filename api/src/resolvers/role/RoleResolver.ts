import { Arg, Authorized, Ctx, FieldResolver, ID, Query, Resolver, Root } from 'type-graphql';
import { Role, RoleModel } from '../../entities/Role';
import { AuthCheckerConfigInterface } from '../../utils/auth/customAuthChecker';
import { OPERATION_TARGET_OPERATION, OPERATION_TYPE_READ } from '../../config';
import { ContextInterface } from '../../types/context';
import { getRoleRuleCustomFilter } from '../../utils/auth/getRoleRuleCustomFilter';
import { DocumentType } from '@typegoose/typegoose';
import { NavItem, NavItemModel } from '../../entities/NavItem';

@Resolver((_for) => Role)
export class RoleResolver {
  @Authorized<AuthCheckerConfigInterface>([
    {
      entity: 'Role',
      operationType: OPERATION_TYPE_READ,
      target: OPERATION_TARGET_OPERATION,
    },
  ])
  @Query((_returns) => Role)
  async getRole(@Ctx() ctx: ContextInterface, @Arg('id', (_type) => ID) id: string): Promise<Role> {
    const customFilter = getRoleRuleCustomFilter<Role>({
      req: ctx.req,
      entity: 'Role',
      operationType: OPERATION_TYPE_READ,
    });

    const role = await RoleModel.findOne({ _id: id, ...customFilter });
    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  }

  @Authorized<AuthCheckerConfigInterface>([
    {
      entity: 'Role',
      operationType: OPERATION_TYPE_READ,
      target: OPERATION_TARGET_OPERATION,
    },
  ])
  @Query((_returns) => [Role])
  async getAllRoles(@Ctx() ctx: ContextInterface): Promise<Role[]> {
    const customFilter = getRoleRuleCustomFilter<Role>({
      req: ctx.req,
      entity: 'Role',
      operationType: OPERATION_TYPE_READ,
    });

    return RoleModel.find({ ...customFilter });
  }

  @Query((_returns) => Role)
  async getSessionRole(@Ctx() ctx: ContextInterface): Promise<Role> {
    return ctx.req.session!.userRole;
  }

  @FieldResolver()
  async appNavigation(@Root() role: DocumentType<Role>): Promise<NavItem[]> {
    return NavItemModel.find({
      _id: { $in: role.allowedAppNavigation },
      parent: null,
    }).populate({
      path: 'children',
      model: NavItemModel,
      match: {
        _id: { $in: role.allowedAppNavigation },
      },
    });
  }
}
