import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Role, RoleModel } from '../../entities/Role';
import { AuthCheckerConfigInterface } from '../../utils/auth/customAuthChecker';
import {
  OPERATION_TARGET_OPERATION,
  OPERATION_TYPE_CREATE,
  OPERATION_TYPE_DELETE,
  OPERATION_TYPE_READ,
  OPERATION_TYPE_UPDATE,
  ROLE_SLUG_GUEST,
  ROLE_TEMPLATE_GUEST,
} from '../../config';
import { ContextInterface } from '../../types/context';
import { getRoleRuleCustomFilter } from '../../utils/auth/getRoleRuleCustomFilter';
import { DocumentType } from '@typegoose/typegoose';
import { NavItem, NavItemModel } from '../../entities/NavItem';
import { CreateRoleInput } from './CreateRoleInput';
import PayloadType from '../common/PayloadType';
import getLangField from '../../utils/translations/getLangField';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateRoleInput } from './UpdateRoleInput';
import { UserModel } from '../../entities/User';
import { generateDefaultLangSlug } from '../../utils/slug';
import { RoleRule, RoleRuleModel, RoleRuleOperationModel } from '../../entities/RoleRule';
import { SetRoleOperationPermissionInput } from './SetRoleOperationPermissionInput';
import { createRoleRules } from '../../utils/initialData/createInitialRoles';

@ObjectType()
class RolePayloadType extends PayloadType() {
  @Field((_type) => Role, { nullable: true })
  role?: Role | null;
}

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
    const sessionRole = await RoleModel.findById(ctx.req.session!.userRole._id);
    if (!sessionRole) {
      throw new Error('Session role not found');
    }
    return sessionRole;
  }

  // TODO validation and messages
  @Authorized<AuthCheckerConfigInterface>([
    {
      entity: 'Role',
      operationType: OPERATION_TYPE_CREATE,
      target: OPERATION_TARGET_OPERATION,
    },
  ])
  @Mutation(() => RolePayloadType)
  async createRole(@Arg('input') input: CreateRoleInput): Promise<RolePayloadType> {
    try {
      const { name } = input;

      const nameValues = name.map(({ value }) => value);
      const exists = await RoleModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });

      if (exists) {
        return {
          success: false,
          message: 'duplicate',
        };
      }

      const slug = generateDefaultLangSlug(name);
      const role = await RoleModel.create({
        ...ROLE_TEMPLATE_GUEST,
        ...input,
        slug,
        allowedAppNavigation: [],
      });

      if (!role) {
        return {
          success: false,
          message: 'error',
        };
      }

      await createRoleRules({ allow: false, roleId: role.id });

      return {
        success: true,
        message: 'success',
        role,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  // TODO validation and messages
  @Authorized<AuthCheckerConfigInterface>([
    {
      entity: 'Role',
      operationType: OPERATION_TYPE_UPDATE,
      target: OPERATION_TARGET_OPERATION,
    },
  ])
  @Mutation(() => RolePayloadType)
  async updateRole(@Arg('input') input: UpdateRoleInput): Promise<RolePayloadType> {
    try {
      const { id, ...values } = input;

      const role = await RoleModel.findById(id);

      if (!role) {
        return {
          success: false,
          message: 'notFound',
        };
      }

      const nameValues = values.name.map(({ value }) => value);
      const exists = await RoleModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });

      if (exists) {
        return {
          success: false,
          message: 'duplicate',
        };
      }

      const updatedRole = await RoleModel.findByIdAndUpdate(id, input, { new: true });

      if (!updatedRole) {
        return {
          success: false,
          message: 'error',
        };
      }

      return {
        success: true,
        message: 'success',
        role: updatedRole,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  // TODO validation and messages
  @Authorized<AuthCheckerConfigInterface>([
    {
      entity: 'Role',
      operationType: OPERATION_TYPE_DELETE,
      target: OPERATION_TARGET_OPERATION,
    },
  ])
  @Mutation(() => RolePayloadType)
  async deleteRole(@Arg('id', (_type) => ID) id: string): Promise<RolePayloadType> {
    try {
      const role = await RoleModel.findById(id);

      if (!role) {
        return {
          success: false,
          message: 'notFound',
        };
      }

      const guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });

      if (!guestRole) {
        return {
          success: false,
          message: 'guestRoleNotFound',
        };
      }

      const updatedUsers = await UserModel.updateMany(
        {
          role: role.id,
        },
        {
          role: guestRole.id,
        },
      );

      if (!updatedUsers) {
        return {
          success: false,
          message: 'usersUpdateError',
        };
      }

      const removedRole = await RoleModel.findByIdAndDelete(id);

      if (!removedRole) {
        return {
          success: false,
          message: 'error',
        };
      }

      return {
        success: true,
        message: 'success',
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  // TODO validation and messages
  @Authorized<AuthCheckerConfigInterface>([
    {
      entity: 'Role',
      operationType: OPERATION_TYPE_UPDATE,
      target: OPERATION_TARGET_OPERATION,
    },
  ])
  @Mutation(() => RolePayloadType)
  async setRoleOperationPermission(
    @Arg('input', (_type) => SetRoleOperationPermissionInput)
    input: SetRoleOperationPermissionInput,
  ): Promise<RolePayloadType> {
    try {
      const { operationId, allow, roleId } = input;

      const role = await RoleModel.findById(roleId);
      if (!role) {
        return {
          success: false,
          message: 'notFound',
        };
      }

      const updatedOperation = await RoleRuleOperationModel.findByIdAndUpdate(operationId, {
        allow,
      });

      if (!updatedOperation) {
        return {
          success: false,
          message: 'error',
        };
      }

      return {
        success: true,
        message: 'success',
        role,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @FieldResolver((_returns) => String)
  async nameString(
    @Root() role: DocumentType<Role>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(role.name, ctx.req.lang);
  }

  @FieldResolver((_returns) => [RoleRule])
  async rules(@Root() role: DocumentType<Role>): Promise<RoleRule[]> {
    return RoleRuleModel.find({
      roleId: role.id,
    });
  }

  @FieldResolver((_returns) => [NavItem])
  async appNavigation(@Root() role: DocumentType<Role>): Promise<NavItem[]> {
    return NavItemModel.find({
      _id: { $in: role.allowedAppNavigation },
      parent: null,
    })
      .sort({ order: 1 })
      .populate({
        path: 'children',
        model: NavItemModel,
        sort: { order: 1 },
        match: {
          _id: { $in: role.allowedAppNavigation },
        },
      });
  }
}
