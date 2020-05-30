import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class UpdateAttributesGroupInput {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;
}
