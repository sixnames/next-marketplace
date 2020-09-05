import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class UpdateMyPasswordInput {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  oldPassword: string;

  @Field(() => String)
  newPassword: string;

  @Field(() => String)
  newPasswordB: string;
}
