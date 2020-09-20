import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class SetRoleOperationPermissionInput {
  @Field((_type) => ID)
  roleId: string;

  @Field((_type) => ID)
  operationId: string;

  @Field((_type) => Boolean)
  allow: boolean;
}
