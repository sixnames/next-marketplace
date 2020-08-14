import {
  Arg,
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
import {
  OPERATION_TYPE_CREATE,
  OPERATION_TYPE_DELETE,
  OPERATION_TYPE_READ,
  OPERATION_TYPE_UPDATE,
  ROLE_SLUG_GUEST,
  ROLE_TEMPLATE_GUEST,
  ROUTE_APP_NAV_GROUP,
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
import { SetRoleOperationCustomFilterInput } from './SetRoleOperationCustomFilterInput';
import { SetRoleRuleRestrictedFieldInput } from './SetRoleRuleRestrictedFieldInput';
import toggleItemInArray from '../../utils/toggleItemInArray';
import { SetRoleAllowedNavItemInput } from './SetRoleAllowedNavItemInput';
import getApiMessage from '../../utils/translations/getApiMessage';
import getMessagesByKeys from '../../utils/translations/getMessagesByKeys';
import fs from 'fs';
import {
  createRoleSchema,
  setRoleAllowedNavItemSchema,
  setRoleOperationCustomFilterSchema,
  setRoleOperationPermissionSchema,
  setRoleRuleRestrictedFieldSchema,
  updateRoleSchema,
} from '../../validation/roleSchema';
import { AuthMethod } from '../../decorators/methodDecorators';

@ObjectType()
class RolePayloadType extends PayloadType() {
  @Field((_type) => Role, { nullable: true })
  role?: Role | null;
}

@Resolver((_for) => Role)
export class RoleResolver {
  @AuthMethod({
    entity: 'Role',
    operationType: OPERATION_TYPE_READ,
  })
  @Query((_returns) => Role)
  async getRole(@Ctx() ctx: ContextInterface, @Arg('id', (_type) => ID) id: string): Promise<Role> {
    const customFilter = await getRoleRuleCustomFilter<Role>({
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

  @AuthMethod({
    entity: 'Role',
    operationType: OPERATION_TYPE_READ,
  })
  @Query((_returns) => [Role])
  async getAllRoles(@Ctx() ctx: ContextInterface): Promise<Role[]> {
    const customFilter = await getRoleRuleCustomFilter<Role>({
      req: ctx.req,
      entity: 'Role',
      operationType: OPERATION_TYPE_READ,
    });

    return RoleModel.find({ ...customFilter });
  }

  @Query((_returns) => Role)
  async getSessionRole(@Ctx() ctx: ContextInterface): Promise<Role> {
    const sessionRoleId = ctx.req.session!.roleId;

    if (!sessionRoleId) {
      const sessionRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
      if (!sessionRole) {
        throw new Error('Guest session role not found');
      }
      return sessionRole;
    }

    const sessionRole = await RoleModel.findById(sessionRoleId);
    if (!sessionRole) {
      throw new Error('Session role not found');
    }
    return sessionRole;
  }

  @Query((_returns) => [String])
  async getEntityFields(@Arg('entity') entity: string): Promise<string[]> {
    const rawSchema = fs.readFileSync('./introspectionSchema.json');
    const {
      __schema: { types },
    }: any = JSON.parse(rawSchema.toString());
    const entitySchema = types.find(({ name }: any) => {
      return name === entity;
    });
    if (!entitySchema) {
      return [];
    }

    const entityFields = entitySchema.fields.map(({ name }: any) => name);

    return entityFields
      .filter((key: string) => {
        const excludedKeys = ['id', 'password', 'children'];
        return !excludedKeys.includes(key);
      })
      .sort();
  }

  @AuthMethod({
    entity: 'Role',
    operationType: OPERATION_TYPE_CREATE,
  })
  @Mutation(() => RolePayloadType)
  async createRole(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: CreateRoleInput,
  ): Promise<RolePayloadType> {
    try {
      const { lang, defaultLang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.roles.name',
        'validation.roles.description',
      ]);
      await createRoleSchema({ messages, lang, defaultLang }).validate(input);

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
          message: await getApiMessage({ key: 'roles.create.duplicate', lang }),
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
          message: await getApiMessage({ key: 'roles.create.error', lang }),
        };
      }

      await createRoleRules({ allow: false, roleId: role.id });

      return {
        success: true,
        message: await getApiMessage({ key: 'roles.create.success', lang }),
        role,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @AuthMethod({
    entity: 'Role',
    operationType: OPERATION_TYPE_UPDATE,
  })
  @Mutation(() => RolePayloadType)
  async updateRole(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateRoleInput,
  ): Promise<RolePayloadType> {
    try {
      const { lang, defaultLang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.roles.id',
        'validation.roles.name',
        'validation.roles.description',
      ]);
      await updateRoleSchema({ messages, lang, defaultLang }).validate(input);
      const customFilter = await getRoleRuleCustomFilter<Role>({
        req: ctx.req,
        entity: 'Role',
        operationType: OPERATION_TYPE_UPDATE,
      });

      const { id, ...values } = input;
      const nameValues = values.name.map(({ value }) => value);
      const exists = await RoleModel.exists({
        _id: { $ne: id },
        'name.value': {
          $in: nameValues,
        },
      });

      if (exists) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.update.duplicate', lang }),
        };
      }

      const updatedRole = await RoleModel.findOneAndUpdate({ _id: id, ...customFilter }, input, {
        new: true,
      });

      if (!updatedRole) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.update.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'roles.update.success', lang }),
        role: updatedRole,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @AuthMethod({
    entity: 'Role',
    operationType: OPERATION_TYPE_DELETE,
  })
  @Mutation(() => RolePayloadType)
  async deleteRole(
    @Ctx() ctx: ContextInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<RolePayloadType> {
    try {
      const { lang } = ctx.req;
      const role = await RoleModel.findById(id);

      if (!role) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.delete.notFound', lang }),
        };
      }

      // Remove rules and operations
      const rules = await RoleRuleModel.find({ roleId: role.id });
      if (!rules) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.delete.rulesNotFound', lang }),
        };
      }
      const rulesIds = rules.map(({ id }) => id);

      const operationsIds = rules.reduce((acc: string[], { operations = [] }) => {
        return [...acc, ...operations.map((operation) => `${operation}`)];
      }, []);

      const removedOperations = await RoleRuleOperationModel.deleteMany({
        _id: { $in: operationsIds },
      });

      const removedRules = await RoleRuleModel.deleteMany({ _id: { $in: rulesIds } });

      if (!removedOperations || !removedRules) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.delete.rulesError', lang }),
        };
      }

      // Update users with guest role
      const guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
      if (!guestRole) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.delete.guestRoleNotFound', lang }),
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
          message: await getApiMessage({ key: 'roles.delete.usersUpdateError', lang }),
        };
      }

      const removedRole = await RoleModel.findByIdAndDelete(id);

      if (!removedRole) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.delete.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'roles.delete.success', lang }),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @AuthMethod({
    entity: 'Role',
    operationType: OPERATION_TYPE_UPDATE,
  })
  @Mutation(() => RolePayloadType)
  async setRoleOperationPermission(
    @Ctx() ctx: ContextInterface,
    @Arg('input', (_type) => SetRoleOperationPermissionInput)
    input: SetRoleOperationPermissionInput,
  ): Promise<RolePayloadType> {
    try {
      const { lang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.roles.id',
        'validation.roles.operationId',
      ]);
      await setRoleOperationPermissionSchema({ messages, lang }).validate(input);
      const customFilter = await getRoleRuleCustomFilter<Role>({
        req: ctx.req,
        entity: 'Role',
        operationType: OPERATION_TYPE_UPDATE,
      });

      const { operationId, allow, roleId } = input;

      const role = await RoleModel.findById(roleId);
      if (!role) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.permissions.notFound', lang }),
        };
      }

      const updatedOperation = await RoleRuleOperationModel.findOneAndUpdate(
        { _id: operationId, ...customFilter },
        {
          allow,
        },
      );

      if (!updatedOperation) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.permissions.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'roles.permissions.success', lang }),
        role,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @AuthMethod({
    entity: 'Role',
    operationType: OPERATION_TYPE_UPDATE,
  })
  @Mutation(() => RolePayloadType)
  async setRoleOperationCustomFilter(
    @Ctx() ctx: ContextInterface,
    @Arg('input', (_type) => SetRoleOperationCustomFilterInput)
    input: SetRoleOperationCustomFilterInput,
  ): Promise<RolePayloadType> {
    try {
      const { lang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.roles.id',
        'validation.roles.operationId',
      ]);
      await setRoleOperationCustomFilterSchema({ messages, lang }).validate(input);
      const ruleCustomFilter = await getRoleRuleCustomFilter<Role>({
        req: ctx.req,
        entity: 'Role',
        operationType: OPERATION_TYPE_UPDATE,
      });

      const { operationId, customFilter, roleId } = input;
      const role = await RoleModel.findById(roleId);
      if (!role) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.permissions.notFound', lang }),
        };
      }

      const updatedOperation = await RoleRuleOperationModel.findOneAndUpdate(
        { _id: operationId, ...ruleCustomFilter },
        {
          customFilter,
        },
      );

      if (!updatedOperation) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.permissions.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'roles.permissions.success', lang }),
        role,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @AuthMethod({
    entity: 'Role',
    operationType: OPERATION_TYPE_UPDATE,
  })
  @Mutation(() => RolePayloadType)
  async setRoleRuleRestrictedField(
    @Ctx() ctx: ContextInterface,
    @Arg('input', (_type) => SetRoleRuleRestrictedFieldInput)
    input: SetRoleRuleRestrictedFieldInput,
  ): Promise<RolePayloadType> {
    try {
      const { lang } = ctx.req;
      const messages = await getMessagesByKeys(['validation.roles.id', 'validation.roles.ruleId']);
      await setRoleRuleRestrictedFieldSchema({ messages, lang }).validate(input);
      const customFilter = await getRoleRuleCustomFilter<Role>({
        req: ctx.req,
        entity: 'Role',
        operationType: OPERATION_TYPE_UPDATE,
      });

      const { ruleId, roleId, restrictedField } = input;

      const role = await RoleModel.findById(roleId);
      const rule = await RoleRuleModel.findById(ruleId);

      if (!role || !rule) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.permissions.notFound', lang }),
        };
      }

      const updatedFields = toggleItemInArray(rule.restrictedFields, restrictedField);

      const updatedRule = await RoleRuleModel.findOneAndUpdate(
        {
          _id: ruleId,
          ...customFilter,
        },
        {
          restrictedFields: updatedFields,
        },
        { new: true },
      );

      if (!updatedRule) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.permissions.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'roles.permissions.success', lang }),
        role,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @AuthMethod({
    entity: 'Role',
    operationType: OPERATION_TYPE_UPDATE,
  })
  @Mutation(() => RolePayloadType)
  async setRoleAllowedNavItem(
    @Ctx() ctx: ContextInterface,
    @Arg('input', (_type) => SetRoleAllowedNavItemInput)
    input: SetRoleAllowedNavItemInput,
  ): Promise<RolePayloadType> {
    try {
      const { lang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.roles.id',
        'validation.roles.navItemId',
      ]);
      await setRoleAllowedNavItemSchema({ messages, lang }).validate(input);
      const customFilter = await getRoleRuleCustomFilter<Role>({
        req: ctx.req,
        entity: 'Role',
        operationType: OPERATION_TYPE_UPDATE,
      });

      const { roleId, navItemId } = input;

      const role = await RoleModel.findById(roleId);
      const navItem = await NavItemModel.findById(navItemId);

      if (!role || !navItem) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.permissions.notFound', lang }),
        };
      }

      const allowedAppNavigation = toggleItemInArray(role.allowedAppNavigation, navItemId);

      const updatedRole = await RoleModel.findOneAndUpdate(
        {
          _id: roleId,
          ...customFilter,
        },
        {
          allowedAppNavigation,
        },
        { new: true },
      );

      if (!updatedRole) {
        return {
          success: false,
          message: await getApiMessage({ key: 'roles.permissions.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'roles.permissions.success', lang }),
        role: updatedRole,
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
      navGroup: ROUTE_APP_NAV_GROUP,
    })
      .sort({ order: 1 })
      .populate({
        path: 'children',
        model: NavItemModel,
        options: { sort: { order: 1 } },
        match: {
          _id: { $in: role.allowedAppNavigation },
          navGroup: ROUTE_APP_NAV_GROUP,
        },
      });
  }
}
