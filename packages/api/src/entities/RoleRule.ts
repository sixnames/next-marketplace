import { Field, ID, Int, ObjectType, registerEnumType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { OPERATION_TYPE_ENUM } from '@yagu/config';
import { DecoratorOperationType } from '../decorators/methodDecorators';

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
}

export const RoleRuleOperationModel = getModelForClass(RoleRuleOperation);
export const RoleRuleModel = getModelForClass(RoleRule);
