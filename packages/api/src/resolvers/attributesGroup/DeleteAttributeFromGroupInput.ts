import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class DeleteAttributeFromGroupInput {
  @Field(() => ID)
  groupId: string;

  @Field(() => ID)
  attributeId: string;
}
