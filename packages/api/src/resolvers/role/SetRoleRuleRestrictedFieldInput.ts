import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class SetRoleRuleRestrictedFieldInput {
  @Field((_type) => ID)
  roleId: string;

  @Field((_type) => ID)
  ruleId: string;

  @Field((_type) => String)
  restrictedField: string;
}
