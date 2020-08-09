import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { OPERATION_TYPE_ENUM } from '../config';

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
  operations: Ref<RoleRuleOperation>[];

  @Field((_type) => [String])
  @prop({ type: String })
  restrictedFields: string[];
}

export const RoleRuleOperationModel = getModelForClass(RoleRuleOperation);
export const RoleRuleModel = getModelForClass(RoleRule);
