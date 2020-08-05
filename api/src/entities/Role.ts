import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
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
  @Field((_type) => String)
  readonly id: string;

  @Field(() => RoleRuleOperationTypeEnum)
  @prop({ required: true, enum: OPERATION_TYPE_ENUM })
  public operationType: RoleRuleOperationTypeEnum;

  @Field((_type) => Boolean)
  @prop({ type: Boolean })
  allowed: boolean;

  @Field((_type) => String)
  @prop({ type: String })
  customFilter: string;
}

@ObjectType()
export class RoleRuleField {
  @Field((_type) => String)
  readonly id: string;

  @Field((_type) => String)
  @prop({ type: String })
  nameString: string;

  @Field((_type) => Boolean)
  @prop({ type: Boolean })
  allowed: boolean;
}

@ObjectType()
export class RoleRule {
  @Field((_type) => String)
  readonly id: string;

  @Field((_type) => String)
  @prop({ type: String })
  nameString: string;

  @Field((_type) => String)
  @prop({ type: String })
  entity: string;

  @Field((_type) => [RoleRuleOperation])
  @prop({ type: RoleRuleOperation })
  operations: RoleRuleOperation[];

  @Field((_type) => [RoleRuleField])
  @prop({ type: RoleRuleField })
  fields: RoleRuleField[];
}

@ObjectType()
export class Role {
  @Field((_type) => String)
  readonly id: string;

  @Field((_type) => String)
  @prop({ type: String })
  nameString: string;

  @Field((_type) => String)
  @prop({ type: String })
  description: string;

  @Field((_type) => String)
  @prop({ type: String })
  slug: string;

  @Field((_type) => [RoleRule])
  @prop({ type: RoleRule })
  rules: RoleRule[];
}

export const RoleModel = getModelForClass(Role);
