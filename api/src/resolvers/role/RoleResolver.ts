import { Arg, Authorized, Ctx, ID, Query, Resolver } from 'type-graphql';
import { Role, RoleModel } from '../../entities/Role';
import { AuthCheckerConfigInterface } from '../../utils/auth/customAuthChecker';
import { OPERATION_TARGET_OPERATION, OPERATION_TYPE_READ } from '../../config';
import { ContextInterface } from '../../types/context';
import { getRoleRuleCustomFilter } from '../../utils/auth/getRoleRuleCustomFilter';

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
}
