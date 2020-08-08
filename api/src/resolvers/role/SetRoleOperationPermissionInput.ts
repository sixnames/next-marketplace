import { Field, ID, InputType } from 'type-graphql';
import { RoleRuleOperationTypeEnum } from '../../entities/Role';

@InputType()
export class SetRoleOperationPermissionInput {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => String)
  entity: string;

  @Field((_type) => RoleRuleOperationTypeEnum)
  operationType: RoleRuleOperationTypeEnum;

  @Field((_type) => Boolean)
  allow: boolean;
}
