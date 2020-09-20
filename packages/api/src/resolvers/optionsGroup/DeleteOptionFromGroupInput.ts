import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class DeleteOptionFromGroupInput {
  @Field(() => ID)
  groupId: string;

  @Field(() => ID)
  optionId: string;
}
