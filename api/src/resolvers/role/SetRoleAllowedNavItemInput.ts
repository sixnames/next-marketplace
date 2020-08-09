import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class SetRoleAllowedNavItemInput {
  @Field((_type) => ID)
  roleId: string;

  @Field((_type) => ID)
  navItemId: string;
}
