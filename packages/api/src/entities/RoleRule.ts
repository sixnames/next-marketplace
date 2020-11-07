import { Field, ID, Int, ObjectType, registerEnumType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { OPERATION_TYPE_ENUM, ROLE_SLUG_GUEST } from '@yagu/config';
import { DecoratorOperationType } from '../decorators/methodDecorators';
import { ContextInterface } from '../types/context';
import { FilterQuery } from 'mongoose';
import { RoleModel } from './Role';

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

export enum RoleRuleOperationTypeEnum {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}

registerEnumType(RoleRuleOperationTypeEnum, {
  name: 'RoleRuleOperationTypeEnum',
  description: 'Role rule operation type enum',
});

@ObjectType()
export class RoleRuleOperation {
  @Field((_type) => ID)
  readonly id: string;

  @Field(() => RoleRuleOperationTypeEnum)
  @prop({ required: true, enum: OPERATION_TYPE_ENUM })
  operationType: RoleRuleOperationTypeEnum;

  @Field((_type) => Boolean)
  @prop({ type: Boolean })
  allow: boolean;

  @Field((_type) => String)
  @prop({ type: String })
  customFilter: string;

  @Field((_type) => Int)
  @prop({ type: Number })
  order: number;
}

@ObjectType()
export class RoleRule {
  @Field((_type) => ID)
  readonly id: string;

  @Field((_type) => ID)
  @prop({ type: String })
  roleId: string;

  @Field((_type) => String)
  @prop({ type: String })
  nameString: string;

  @Field((_type) => String)
  @prop({ type: String })
  entity: string;

  @Field((_type) => [RoleRuleOperation])
  @prop({ ref: RoleRuleOperation })
  operations: string[];

  @Field((_type) => [String])
  @prop({ type: String })
  restrictedFields: string[];

  static getOperationsConfigs(entity: string) {
    return {
      operationConfigCreate: {
        entity,
        operationType: 'create' as DecoratorOperationType,
      },
      operationConfigRead: {
        entity,
        operationType: 'read' as DecoratorOperationType,
      },
      operationConfigUpdate: {
        entity,
        operationType: 'update' as DecoratorOperationType,
      },
      operationConfigDelete: {
        entity,
        operationType: 'delete' as DecoratorOperationType,
      },
    };
  }

  static async getRoleRuleCustomFilter<T>({
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
}

export const RoleRuleOperationModel = getModelForClass(RoleRuleOperation);
export const RoleRuleModel = getModelForClass(RoleRule);
